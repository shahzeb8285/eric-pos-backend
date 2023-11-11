import { Module } from '@nestjs/common';
import { WatcherService } from './watcher.service';
import { WatcherController } from './watcher.controller';

@Module({
  controllers: [WatcherController],
  providers: [WatcherService],
})
export class WatcherModule {}
