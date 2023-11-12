
export class CreateIncomingTransactionDto {
    txnHash: string
    fromAddress: string
    amount: string
    gasFee: string
    currencySymbol: string
    walletId: string
}




export class CreateOutgoingTransactionDto {
    txnHash: string
    toAddress: string
    amount: string
    gasFee: string
    currencySymbol: string
    walletId: string
}


