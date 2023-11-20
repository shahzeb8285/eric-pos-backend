import { ApiProperty } from "@nestjs/swagger"

export class TokenType {
    @ApiProperty({
        default:"IDRT"
    })
    symbol: string

    @ApiProperty({
        default:"0x0000000000000000000000000000"
    })
    address: string
    
    @ApiProperty({
        default:"18"
    })
    decimals: number
}
export class CreateGlobalSettingDto {
    @ApiProperty({
        default:"m/44'/60'/1'/0/"
    })
    WALLET_PATH: string

    @ApiProperty({
        default:24*60*60
    })
    WALLET_DETACH_TIME: number

    @ApiProperty({default:  {
        symbol: "BNB",
        decimals: 18,
        address:"0x0000000000000000000000000000",
    }})
    NATIVE: TokenType

    @ApiProperty({
        default: [
            {
                symbol: "IDRT",
                decimals: 18,
                address:"0xAf356b653F324D919198e49f24485983331172bB",
            }
        ]
    })
    ACCEPTED_TOKENS: TokenType[]

    @ApiProperty()
    RPCs: string[]
    
    @ApiProperty({
        default:97
    })
    CHAIN_ID: number

    @ApiProperty({
        default:"1000"
    })
    BNB_BUFFER: string
}

