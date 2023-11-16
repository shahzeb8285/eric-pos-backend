import { Injectable } from '@nestjs/common';
import { AbstractProvider, Contract, ethers, getDefaultProvider } from 'ethers';
import { SETTINGS, getRPC } from 'src/settings';
import IERC20ABI from "src/abis/IERC20";
import { WalletService } from 'src/wallet/wallet.service';
import { OnEvent } from '@nestjs/event-emitter';
import { WalletCreatedEvent } from 'src/events/wallet.event';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CreateIncomingTransactionDto,CreateOutgoingTransactionDto } from 'src/transactions/dto/create-transaction.dto';
@Injectable()
export class WatcherService {

    rpc: string;
    contracts: Contract[];
    ethersProvider: AbstractProvider;
    globalWalletAddresses: string[]

    constructor(private walletService: WalletService,
        private transactionService: TransactionsService) {
        const rpc = getRPC()
        this.rpc = rpc
        this.ethersProvider = getDefaultProvider(rpc);
        this.contracts = this.prepareContracts(this.ethersProvider);
        this.startListening()
    }




    prepareContracts(provider: AbstractProvider) {
        const contracts = [];
        for (const token of SETTINGS.ACCEPTED_TOKENS) {
            if (token.address != "") {
                contracts.push(new ethers.Contract(token.address, IERC20ABI, provider))
            }
        }
        return contracts
    }

    isValidWallet(address: string) {
        return this.globalWalletAddresses.indexOf(address) !== -1
    }

    getCurrencySymbolByContract(contractAddress:string) {
        const token =  SETTINGS.ACCEPTED_TOKENS.find((currency) => {
            return currency.address.toLowerCase() === contractAddress.toLowerCase()
        })
        if (token) {
            return token.symbol
        }
        return contractAddress;
    }
    async validateAndSaveTxn(to: string, amount: Number, from: string, transactionHash: string, contractAddress: string) {
        
        if (this.isValidWallet(to)) {
            const payload: CreateIncomingTransactionDto = new CreateIncomingTransactionDto();
            payload.amount = amount.toString()
            payload.currencySymbol = this.getCurrencySymbolByContract(contractAddress);
            payload.fromAddress = from;
            payload.walletId = to;
            payload.txnHash = transactionHash;
            payload.gasFee = "-"
            await this.transactionService.createIncoming(payload)
            // invoke merchant call back 

        } else if (this.isValidWallet(from)) {
            const payload: CreateOutgoingTransactionDto = new CreateOutgoingTransactionDto();
            payload.amount = amount.toString()
            payload.currencySymbol = this.getCurrencySymbolByContract(contractAddress);
            payload.toAddress = to;
            payload.walletId = from;
            payload.txnHash = transactionHash;
            payload.gasFee = "-"
            await this.transactionService.createOutgoing(payload)

        }


       
        
    }

    @OnEvent('wallet.created')
    handleNewWalletAddEvent(payload: WalletCreatedEvent) {
        const addresses = [...this.globalWalletAddresses];
        addresses.push(payload.walletAddress);
        this.globalWalletAddresses = addresses;
    }


    async startListening() {
        this.globalWalletAddresses = await this.walletService.getAllWalletAddresses()

        this.contracts.map((contract) => {
            contract.on("Transfer", (_, __, ___, txnData) => {
                this.validateAndSaveTxn(txnData.log.args[1], txnData.log.args[2], txnData.log.args[0], txnData.log.transactionHash, txnData.log.address)
            });
        })
    }

    

}


