import { Module } from '@nestjs/common';
import { GlobalSettingsService } from './global_settings.service';
import { GlobalSettingsController } from './global_settings.controller';

@Module({
  controllers: [GlobalSettingsController],
  providers: [GlobalSettingsService],
})
export class GlobalSettingsModule {}
