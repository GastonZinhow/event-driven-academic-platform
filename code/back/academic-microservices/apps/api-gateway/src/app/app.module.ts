import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModule } from '../modules/student/student.module';
import { EnrollmentModule } from '../modules/enrollment/enrollment.module';
import { RabbitMQModule } from '@org/rabbitmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [StudentModule, EnrollmentModule, RabbitMQModule, StudentModule, EnrollmentModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        host: configService.get<string>('DATABASE_HOST'),

        port: configService.get<number>('DATABASE_PORT'),

        username: configService.get<string>('DATABASE_USER'),

        password: configService.get<string>('DATABASE_PASSWORD'),

        database: configService.get<string>('DATABASE_NAME'),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],

  providers: [AppService],
})
export class AppModule { }