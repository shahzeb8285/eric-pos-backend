import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { WatcherModule } from './watcher/watcher.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MerchantModule } from './merchant/merchant.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TransactionsModule } from './transactions/transactions.module';
import { SettlementModule } from './settlement/settlement.module';
import { SettlementService } from './settlement/settlement.service';
import { WalletService } from './wallet/wallet.service';
import { GasModule } from './gas/gas.module';
import { OrphanHistoryModule } from './orphan-history/orphan-history.module';
import { GlobalSettingsModule } from './global_settings/global_settings.module';

@Module({
  imports: [
   
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        prismaOptions: {
          log: [
            {
              emit: 'event',
              level: 'query',
            },
          ],
        },
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
  MerchantModule,
  AuthModule,
  AdminModule,
  TransactionsModule,
  SettlementModule,
  GasModule,
  OrphanHistoryModule,
  GlobalSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService,SettlementService,WalletService],
})
export class AppModule {}
