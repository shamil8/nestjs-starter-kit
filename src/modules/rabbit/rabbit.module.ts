import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { LoggerModule } from '../logger/logger.module';
import { rabbitConfig } from './config/rabbit.config';
import { ConsumerService } from './services/consumer.service';
import { ProducerService } from './services/producer.service';
import { RabbitListener } from './listeners/rabbit.listener';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: rabbitConfig,
    }),
    RabbitModule,
  ],
  providers: [
    // services
    ProducerService,
    ConsumerService,

    // listeners
    RabbitListener,
  ],
  exports: [ProducerService],
  // controllers: [],
})
export class RabbitModule {}
