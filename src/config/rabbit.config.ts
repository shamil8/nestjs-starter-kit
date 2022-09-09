import { RmqOptions, Transport } from '@nestjs/microservices';
import config from './index';
import { BrokerQueue } from '../enums/broker-queue';

export default {
  transport: Transport.RMQ,
  options: {
    urls: [config.rabbitUrl],
    // noAck: false,
    queue: BrokerQueue.CLONE_TOKEN,
    queueOptions: {
      durable: false,
    },
  },
} as RmqOptions;
