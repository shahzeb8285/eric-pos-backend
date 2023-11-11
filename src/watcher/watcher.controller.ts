import { Controller } from '@nestjs/common';
import { WatcherService } from './watcher.service';

@Controller('watcher')
export class WatcherController {
  constructor(private readonly watcherService: WatcherService) {}
}
