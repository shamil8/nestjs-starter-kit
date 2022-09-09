import { Injectable } from '@nestjs/common';

import { ProducerService } from '../services/producer.service';
import { ExchangeRabbit } from '../enums/exchange-rabbit';
import { QueueRabbit } from '../enums/queue-rabbit';
import { RoutingRabbit } from '../enums/routing-rabbit';

@Injectable()
export class RabbitListener {
  constructor(private readonly producerService: ProducerService) {
    this.initRabbitExamples();
  }

  async initRabbitExamples(): Promise<void> {
    await this.producerService.addMessage(QueueRabbit.exampleQueue, {
      msg: 'Test connection!',
    });

    await this.producerService.sayHelloExchange(
      RoutingRabbit.exampleExchangeRoute,
      ExchangeRabbit.exchangeExample,
    );
  }
}
