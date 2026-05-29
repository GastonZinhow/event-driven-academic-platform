import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditModule } from '../modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        host: configService.get<string>('DATABASE_HOST'),

        port: Number(configService.get<string>('DATABASE_PORT')),

        username: configService.get<string>('DATABASE_USER'),

        password: configService.get<string>('DATABASE_PASSWORD'),

        database: configService.get<string>('DATABASE_NAME'),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),

    AuditModule,
  ],
})
export class AppModule {}