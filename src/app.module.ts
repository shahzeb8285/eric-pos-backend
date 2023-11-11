import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { WatcherModule } from './watcher/watcher.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),

    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          // configure your prisma middleware
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
  UsersModule,
  WalletModule,
  WatcherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
