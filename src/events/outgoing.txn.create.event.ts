import { Prisma } from "@prisma/client";

export class OutgoingTransactionEvent {
  data: Prisma.OutgoingTransactionsCreateInput;
  walletAddress:string

  }