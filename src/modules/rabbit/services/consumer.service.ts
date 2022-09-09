import { RabbitSubscribe, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ExchangeRabbit } from '../enums/exchange-rabbit';
import { QueueRabbit } from '../enums/queue-rabbit';
import { RoutingRabbit } from '../enums/routing-rabbit';

@Injectable()
export class ConsumerService {
  @RabbitSubscribe({
    exchange: ExchangeRabbit.exchangeExample,
    routingKey: RoutingRabbit.exampleExchangeRoute,
    queue: QueueRabbit.exampleExchangeQueue,
  })
  public async pubSubHandler(msg: object): Promise<void> {
    console.log(
      `[ConsumerService] Received exchange with route: ${JSON.stringify(msg)}`,
    );
  }

  @RabbitSubscribe({
    exchange: '',
    queue: QueueRabbit.exampleQueue,
  })
  public async pubSub(msg: object): Promise<void> {
    console.log(
      `[ConsumerService] Received example queue: ${JSON.stringify(msg)}`,
    );
  }

  // @RabbitRPC({
  //   routingKey: 'subscribe-route',
  //   queue: 'subscribe-queue',
  //   queueOptions: {
  //     channel: 'channel-2',
  //   },
  // })
  // public async rpcHandler(msg: object): Promise<{ message: string }> {
  //   console.log(`Received rpcHandler message: ${JSON.stringify(msg)}`);
  //
  //   return { message: 'hi' };
  // }
}
