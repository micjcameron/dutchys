import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { CartsModule } from './carts/carts.module';
import { CatalogModule } from './catalog/catalog.module';
import { PaymentsModule } from './payments/payments.module';
import { SalesModule } from './sales/sales.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DB_HOST');
        const port = Number(config.get<string>('DB_PORT'));
        const username = config.get<string>('DB_USER');
        const password = config.get<string>('DB_PASSWORD');
        const database = config.get<string>('DB_NAME');
    
        // HARD FORCE SSL (for DO managed Postgres)
        const ssl = { rejectUnauthorized: false };
    
        // TEMP LOG (remove after working)
        console.log('[DB]', { host, port, username, database, ssl: true });
    
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize: true,
    
          // ✅ both paths
          ssl,
          extra: { ssl },
        };
      },
    }),    
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 60,
        },
      ],
    }),
    CartsModule,
    CatalogModule,
    PaymentsModule,
    SalesModule,
    SessionsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
