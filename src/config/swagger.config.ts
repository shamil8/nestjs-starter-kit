import { DocumentBuilder } from '@nestjs/swagger';
import config from './index';

export default new DocumentBuilder()
  .setTitle('Dev backend template')
  .setDescription('The NestJS template API description')
  .setVersion('1.0')
  .addBearerAuth()
  .addServer(`${config.server.appUrl}${config.server.routePrefix}`)
  .build();
