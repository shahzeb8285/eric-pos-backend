import { ApiProperty } from "@nestjs/swagger";

export class ConfigModal {
  
    @ApiProperty()
    id?: string;
    
    @ApiProperty()
    key: string;
    @ApiProperty()
    value: string;
}
