import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

import { LoggerService } from '../../logger/services/logger.service';

@Injectable()
export class ProducerService {
  constructor(
    private readonly logger: LoggerService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  public async sayHelloExchange(queue: string, exchange = ''): Promise<void> {
    this.logger.log(`${this.sayHelloExchange.name} | sent a message!`);

    return this.amqpConnection.publish(exchange, queue, 'Hello from rabbit');
  }

  public async addMessage<T>(queue: string, request: T): Promise<void> {
    return this.amqpConnection.publish('', queue, request);
  }
}
