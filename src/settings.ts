const SETTINGS = {
    ACCEPTED_TOKENS: [
        {
            symbol: "USDT",
            address: "0x55d398326f99059ff775485246999027b3197955",
            decimals:18
        },
        {
            SYMBOL: "BNB",
            address: "0x0000000000000000000000000000000000000000",
            decimals:18
        }
    ],
    RPCs: ["https://bsc-dataseed1.defibit.io","https://bsc-dataseed3.ninicoin.io"],
    CHAIN_ID:56

}

const getRPC = () => {
    return SETTINGS.RPCs[Math.floor(Math.random()*SETTINGS.RPCs.length)];
}

export {
    SETTINGS,
    getRPC
}