import { Prisma } from "@prisma/client";

export class IncomingTransactionEvent {
  data: Prisma.IncomingTransactionsCreateInput;
  walletAddress:string
  }