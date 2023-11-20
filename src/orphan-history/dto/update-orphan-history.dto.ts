import { PartialType } from '@nestjs/swagger';
import { CreateOrphanHistoryDto } from './create-orphan-history.dto';

export class UpdateOrphanHistoryDto extends PartialType(CreateOrphanHistoryDto) {}
