const SETTINGS = {
    WALLET_PATH: "m/44'/60'/1'/0/",
    WALLET_DETACH_TIME: 24 * 60 * 60, // 24 hours
    BNB_BUFFER: 1000,
    MIN_BNB_BALANCE: 200000000000000000,
    BNBLOW_ALERT_MAIL:"test@test.com",
    NATIVE:  {
        symbol: "BNB",
        decimals:18
    },
    ACCEPTED_TOKENS: [
    
        {
            
            symbol: "IDRT",
            address: "0xAf356b653F324D919198e49f24485983331172bB",
            decimals:18
        },
     
    ],
    RPCs: ["https://data-seed-prebsc-1-s1.bnbchain.org:8545","https://data-seed-prebsc-2-s1.bnbchain.org:8545"],
    CHAIN_ID:97
}

const getRPC = () => {
    
    return SETTINGS.RPCs[Math.floor(Math.random()*SETTINGS.RPCs.length)];
}

export {
    SETTINGS,
    getRPC
}