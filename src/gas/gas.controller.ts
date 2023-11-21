import { Controller } from '@nestjs/common';
import { GasService } from './gas.service';
import { Cron } from '@nestjs/schedule';
import { TransactionsService } from 'src/transactions/transactions.service';
import { getRPC } from 'src/settings';
import { AbstractProvider, ethers } from 'ethers';

@Controller('gas')
export class GasController {
  private readonly ethersProvider: AbstractProvider;
  constructor(
    private readonly transactionsService: TransactionsService) {
    const rpc = getRPC()
    this.ethersProvider = new ethers.JsonRpcProvider(rpc)
    this.findAndFillGasFee()
  }

  @Cron('*/5 * * * *')
  async findAndFillGasFee() {
    const allTxnsWithoutGasFee = await this.transactionsService.findTxnsWithoutGasFee()
    for (const txn of allTxnsWithoutGasFee) {
      const gasFee = await this.fetchGasFee(txn.txnHash);
      await this.transactionsService.updateGasFee(txn.txnHash, gasFee.toString())
    }
  }

  async fetchGasFee(txnHash: string) {
    const txnDetail = await this.ethersProvider.getTransactionReceipt(txnHash);
    const gasFee = txnDetail.gasPrice * txnDetail.gasUsed;
    return gasFee
  }
}
