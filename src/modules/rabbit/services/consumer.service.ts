import { RabbitSubscribe, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

import { ExchangeRabbit } from '../enums/exchange-rabbit';
import { QueueRabbit } from '../enums/queue-rabbit';
import { RoutingRabbit } from '../enums/routing-rabbit';
import { LoggerService } from '../../logger/services/logger.service';

@Injectable()
export class ConsumerService {
  constructor(private readonly logger: LoggerService) {}

  @RabbitSubscribe({
    exchange: ExchangeRabbit.exchangeExample,
    routingKey: RoutingRabbit.exampleExchangeRoute,
    queue: QueueRabbit.exampleExchangeQueue,
  })
  public async pubSubHandler(msg: object): Promise<void> {
    this.logger.log(`Received exchange with route: ${JSON.stringify(msg)}`);
  }

  @RabbitSubscribe({
    exchange: '',
    queue: QueueRabbit.exampleQueue,
  })
  public async pubSub(msg: object): Promise<void> {
    this.logger.log(`Received example queue: ${JSON.stringify(msg)}`);
  }

  // @RabbitRPC({
  //   routingKey: 'subscribe-route',
  //   queue: 'subscribe-queue',
  //   queueOptions: {
  //     channel: 'channel-2',
  //   },
  // })
  // public async rpcHandler(msg: object): Promise<{ message: string }> {
  //   this.logger.log(`Received rpcHandler message: ${JSON.stringify(msg)}`);
  //
  //   return { message: 'hi' };
  // }
}
