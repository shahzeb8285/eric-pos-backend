import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AbstractProvider, getDefaultProvider } from 'ethers';
import { getRPC } from 'src/settings';

@Injectable()
export class WatcherService {

    lastSyncedBlock: null| number;
    rpc: string;
    ethersProvider: AbstractProvider;

    constructor() {
        this.lastSyncedBlock = null;
        const rpc = getRPC()
        this.rpc = rpc
        this.ethersProvider = getDefaultProvider(rpc)
        // this.ethersProvider.on("block",(block)=>{this.onBlockReceived(block,this.ethersProvider)})
    }


    // async onBlockReceived(blockNumber:number,provider:AbstractProvider) {
    //     console.log("received:-", blockNumber)
    //     const transactions = await provider.getBlock(blockNumber);
    //     console.log({transactions:transactions.transactions})
    // }




}


