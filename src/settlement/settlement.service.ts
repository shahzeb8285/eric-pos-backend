import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { WalletService } from 'src/wallet/wallet.service';
import { HDNodeWallet, ethers } from 'ethers';
import { SETTINGS, getRPC } from 'src/settings';
import IERC20 from 'src/abis/IERC20';

@Injectable()
export class SettlementService {
  private logger = new Logger(SettlementService.name);

  constructor(private prisma: PrismaService, private walletService: WalletService) {
  }

  async settleWallets() {
    this.logger.debug('Checking for unsettled wallets');
    const allUnsetteledWallets = await this.walletService.findAllUnsettledWallets()
    await this.handleSettlements(allUnsetteledWallets)
  }

  async handleSettlements(wallets) {
    for (const wallet of wallets) {
      await this.handleSettlement(wallet);
    }
  }

  getJSONProvider() {
    const rpc = getRPC()
    const etherjsProvider = new ethers.JsonRpcProvider(rpc)
    return etherjsProvider
  }

  getContractUsingSigner(pathId: number, contractAddress: string) {
    const path = `${SETTINGS.WALLET_PATH}${pathId}`;
    const mnemonics = process.env.MASTER_MNEMONIC
    const hdNodeWallet = HDNodeWallet.fromPhrase(mnemonics, "", path);
    const etherjsProvider = this.getJSONProvider();

    const etherjsSignerForCurrentWallet = new ethers.Wallet(hdNodeWallet.privateKey, etherjsProvider)
    const idrtContract = new ethers.Contract(contractAddress, IERC20, etherjsSignerForCurrentWallet)
    return { idrtContract, etherjsSignerForCurrentWallet, etherjsProvider }
  }

  async handleSettlement(wallet) {
    this.logger.log({ level: "info", message: `Handling settlement for wallet ${wallet.address}`, });

    const merchantConfigs = wallet.user.merchant.configs
    const balances = await this.walletService.getBalancesByWallet(wallet.address);
    const bnb = balances.find((item) => {
      return item.symbol === "BNB"  // todo: Shahzeb, we don't store BNB balances in the balances table
    })

    const idrt = balances.find((item) => {
      return item.symbol === "USDT" // todo: Shahzeb if not idrt balances? better use Settings name
    })

    const comissionConfig = merchantConfigs.find((item) => {
      return item.key === "commissionPercentage"
    })

    const merchantWalletConfig = merchantConfigs.find((item) => {
      return item.key === "merchantWallet"
    })

    const commissionWalletConfig = merchantConfigs.find((item) => {
      return item.key === "commissionWallet"
    })

    const comissionRate = Number(comissionConfig.value)
    const comissionAmount = (BigInt(idrt.balance) * BigInt(comissionRate)) / BigInt(100);
    const settlementAmount = BigInt(idrt.balance) - comissionAmount;

    const { idrtContract, etherjsSignerForCurrentWallet, etherjsProvider } = this.getContractUsingSigner(wallet.pathId, idrt.address)

    const settlementGasEstimate = await idrtContract.transfer.estimateGas(merchantWalletConfig.value, settlementAmount)
    const comissionGasEstimate = await idrtContract.transfer.estimateGas(commissionWalletConfig.value, comissionAmount)

    const currentFeeData = await etherjsProvider.getFeeData()
    const currentGasPrice = currentFeeData.gasPrice
    const totalSettlementGasFee = currentGasPrice * settlementGasEstimate;
    const totalComissionGasFee = currentGasPrice * comissionGasEstimate;
    const totalGasRequired = totalComissionGasFee + totalSettlementGasFee + BigInt(1000)  // todo: Shahzeb make this buffer configurable, or shall we transfer more if the settlement is more frequent

    this.logger.debug(`comissionAmount: ${comissionAmount}, settlementAmount: ${settlementAmount}, totalGasRequired: ${totalGasRequired}`)

    if (BigInt(bnb.balance) < totalGasRequired) {
      await this.transferBNBToCurrentAddress(totalGasRequired, wallet.address);
    } else {
      await this.transferIDRT(etherjsSignerForCurrentWallet.address, idrtContract, comissionAmount, settlementAmount, merchantWalletConfig.value, commissionWalletConfig.value);
    }
  }

  async transferIDRT(fromWalletAddress: string, idrtContract, commissionAmount: bigint, settlementAmount: bigint, settlementAddress: string, commissionAddress: string) {
    this.logger.log({ level: "info", message: `Transfering out IDRT from ${fromWalletAddress}, settlementAmount: ${settlementAmount}, commissionAmount: ${commissionAmount}, settlementAddress: ${settlementAddress}, commissionAddress: ${commissionAddress}`, });

    const settlementTxn = await idrtContract.transfer(settlementAddress, settlementAmount.toString());
    const settlementTxnResp = await settlementTxn.wait();
    const settlementTxnHash = settlementTxnResp.hash;
    const settlementGasFee = settlementTxnResp.gasUsed * settlementTxnResp.gasPrice

    const commissionTxn = await idrtContract.transfer(commissionAddress, commissionAmount.toString());
    const commissionTxnResp = await commissionTxn.wait();
    const commissionTxnHash = commissionTxnResp.hash;
    const commissionGasFee = commissionTxnResp.gasUsed * commissionTxnResp.gasPrice

    const totalGasFeePaid = (settlementGasFee + commissionGasFee).toString()
    // todo: Shahzeb please backfill settlementGasFee and commissionGasFee in the outgoing transaction table

    await this.settleWallet({
      settlementTxnHash,
      settlementAddress,
      settlementAmount: settlementAmount.toString(),
      currencySymbol: "IDRT",
      commissionAmount: commissionAmount.toString(),
      commissionTxnHash,
      commissionAddress,
      totalGasFeePaid,
      fromWalletAddress
    })
  }

  async transferBNBToCurrentAddress(amount: BigInt, to: string) {
    this.logger.log({ level: "info", message: `Transfering in BNB to ${to}, amount: ${amount}`, });
    const etherjsProvider = this.getJSONProvider();
    const bnbFundsWallet = new ethers.Wallet(process.env.BNB_FUND_WALLET_PK, etherjsProvider)
    const txnData = {
      to,
      value: amount.toString()
    }

    const txnDetails = await bnbFundsWallet.sendTransaction(txnData)
    await txnDetails.wait()
  }

  async settleWallet(data: CreateSettlementDto) {
    const resp = await this.prisma.settlements.create({
      data
    });

    await this.prisma.wallet.update({
      data: {
        isReadyForSettlement: false
      },
      where: {
        address: data.fromWalletAddress
      }
    })
    return resp
  }

  findAll() {
    return this.prisma.settlements.findMany();
  }

  findOne(settlementTxnHash: string) {
    return this.prisma.settlements.findFirst({
      where: {
        settlementTxnHash
      }
    });
  }
}
