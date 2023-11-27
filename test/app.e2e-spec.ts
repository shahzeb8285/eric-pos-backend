import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CreateIncomingTransactionDto } from 'src/transactions/dto/create-transaction.dto';

function generateGuid() {
  var result, i, j;
  result = '';
  for(j=0; j<32; j++) {
    if( j == 8 || j == 12 || j == 16 || j == 20)
      result = result + '-';
    i = Math.floor(Math.random()*16).toString(16).toUpperCase();
    result = result + i;
  }
  return result;
}


describe('AppController (e2e)', () => {
  let app: INestApplication;
  let transactionService: TransactionsService

  let payload: CreateIncomingTransactionDto
  let txnFromDB;
  beforeEach(async () => {
    
    // basic setup 
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    transactionService = moduleFixture.get<TransactionsService>(TransactionsService);

    app = moduleFixture.createNestApplication();
    await app.init();


    // create dummy txn
    payload = new CreateIncomingTransactionDto();
    payload.amount = "7210007080"
    payload.currencySymbol = "IDRT"
    payload.fromAddress = "0xd34e2294289bc709D8d62Ae23235346279741066";
    payload.walletId = "0x4Ac253851E07f82582a8E9a2d0757ADd95573330";
    //mock txn hash
    payload.txnHash = generateGuid()
    payload.gasFee = "-"


    // creating txn
    await transactionService.createIncoming(payload)

    //fetching record
    txnFromDB = await transactionService.findOneIncoming(payload.txnHash);

  });

  it('comparing hash correct one', async () => {
    expect(txnFromDB.txnHash).toBe(payload.txnHash)
  });

  it('comparing hash failed one ', async () => {
    expect(txnFromDB.txnHash).toBe("invalidhash")
  });
});
