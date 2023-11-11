import { ApiProperty } from "@nestjs/swagger";

export class CreateConfigDto {
  @ApiProperty()
  max_usdt: string;
  @ApiProperty()
  min_usdt: string;
  @ApiProperty()
  min_bnb: string;
  @ApiProperty()
  max_bnb: string;

  @ApiProperty()
  merchant_call_back_url: string;

  @ApiProperty()
  bnb_wallet: string;

  @ApiProperty()
  commission_vault: string;

  @ApiProperty()
  merchant_wallet: string;

  @ApiProperty()
  min_commission: number;

  @ApiProperty()
  comission_percentage: number;
  }
  