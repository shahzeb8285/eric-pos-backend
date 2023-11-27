import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { WalletService } from 'src/wallet/wallet.service';
import { HDNodeWallet, ethers } from 'ethers';
import { SETTINGS, getRPC } from 'src/settings';
import IERC20 from 'src/abis/IERC20';
import sendMail from 'src/utils/notifier';

@Injectable()
export class SettlementService {
  private logger = new Logger(SettlementService.name);

  constructor(private prisma: PrismaService,
    // private configService: ConfigService,
    private walletService: WalletService) {
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
      return item.symbol === "BNB"
    })

    const idrt = balances.find((item) => {
      return item.symbol === SETTINGS.ACCEPTED_TOKENS[0].symbol
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
    const settlementAmount = BigInt(idrt.balance);

    const { idrtContract, etherjsSignerForCurrentWallet, etherjsProvider } = this.getContractUsingSigner(wallet.pathId, idrt.address)

    const settlementGasEstimate = await idrtContract.transfer.estimateGas(merchantWalletConfig.value, settlementAmount)

    const currentFeeData = await etherjsProvider.getFeeData()
    const currentGasPrice = currentFeeData.gasPrice
    const totalSettlementGasFee = currentGasPrice * settlementGasEstimate;
    const totalGasRequired = totalSettlementGasFee + BigInt(SETTINGS.BNB_BUFFER)

    this.logger.debug(`settlementAmount: ${settlementAmount}, totalGasRequired: ${totalGasRequired}`)

    if (BigInt(bnb.balance) < totalGasRequired) {
      await this.transferBNBToCurrentAddress(totalGasRequired, wallet.address);
    } else {
      await this.transferIDRT(etherjsSignerForCurrentWallet.address, idrtContract, settlementAmount, merchantWalletConfig.value);
    }

    const finalBNBBalance = await etherjsProvider.getBalance(etherjsSignerForCurrentWallet.address);

    await this.walletService.updateBNBBalance(etherjsSignerForCurrentWallet.address, finalBNBBalance.toString());
  }

  async transferIDRT(fromWalletAddress: string, idrtContract, settlementAmount: bigint, settlementAddress: string) {
    this.logger.log({ level: "info", message: `Transfering out IDRT from ${fromWalletAddress}, settlementAmount: ${settlementAmount}, settlementAddress: ${settlementAddress}`, });

    const settlementTxn = await idrtContract.transfer(settlementAddress, settlementAmount.toString());
    const settlementTxnResp = await settlementTxn.wait();
    const settlementTxnHash = settlementTxnResp.hash;
    const settlementGasFee = settlementTxnResp.gasUsed * settlementTxnResp.gasPrice

    const totalGasFeePaid = (settlementGasFee).toString()

    await this.settleWallet({
      settlementTxnHash,
      settlementAddress,
      settlementAmount: settlementAmount.toString(),
      currencySymbol: "IDRT",
      totalGasFeePaid,
      fromWalletAddress
    })
  }

  async transferBNBToCurrentAddress(amount: BigInt, to: string) {
    this.logger.log({ level: "info", message: `Transfering in BNB to ${to}, amount: ${amount}`, });
    const etherjsProvider = this.getJSONProvider();
    const bnbFundsWallet = new ethers.Wallet(process.env.BNB_FUND_WALLET_PK, etherjsProvider)
    const bnbFundWalletBalance = await etherjsProvider.getBalance(bnbFundsWallet.address);

    if (bnbFundWalletBalance < SETTINGS.MIN_BNB_BALANCE) {
      await sendMail(SETTINGS.BNBLOW_ALERT_MAIL, "BNB RUNNING LOW", `BNB balande is : ${bnbFundWalletBalance} BNB`)
    }

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
    return this.prisma.settlements.findUnique({
      where: {
        settlementTxnHash
      }
    });
  }
}
