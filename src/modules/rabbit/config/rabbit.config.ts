import { ConfigService } from '@nestjs/config';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq/lib/rabbitmq.interfaces';

import { ExchangeRabbit } from '../enums/exchange-rabbit';

export const rabbitConfig = (configService: ConfigService): RabbitMQConfig => ({
  exchanges: [
    {
      name: ExchangeRabbit.exchangeExample,
      type: 'topic',
    },
  ],
  uri: configService.getOrThrow<string>('RABBITMQ_URL'),
  channels: {
    'channel-1': {
      prefetchCount: 15,
      default: true,
    },
    'channel-2': {
      prefetchCount: 4,
    },
  },
});
