import { Module } from '@nestjs/common';
import { OrphanHistoryService } from './orphan-history.service';
import { OrphanHistoryController } from './orphan-history.controller';

@Module({
  controllers: [OrphanHistoryController],
  providers: [OrphanHistoryService],
})
export class OrphanHistoryModule {}
