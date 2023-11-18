import { ApiProperty } from "@nestjs/swagger";
import { ConfigModal } from "../entities/config.entity";

export class CreateMerchantDto {
  @ApiProperty()
  configs: ConfigModal[];

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;
}
