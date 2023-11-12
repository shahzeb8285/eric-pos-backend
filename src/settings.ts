const SETTINGS = {
    NATIVE:  {
        symbol: "BNB",
        decimals:18
    },
    ACCEPTED_TOKENS: [
        {
            symbol: "IDRT",
            address: "0x66207E39bb77e6B99aaB56795C7c340C08520d83",
            decimals:2
        },
     
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