import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class ProducerService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  public async sayHelloExchange(queue: string, exchange = ''): Promise<void> {
    console.log('[ProducerService] sayHelloExchange | sent a message!');
    return this.amqpConnection.publish(exchange, queue, 'Hello from rabbit');
  }

  public async addMessage(queue: string, request: any): Promise<void> {
    return this.amqpConnection.publish('', queue, request);
  }
}
