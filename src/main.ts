import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import config from './config';
import swagger from './config/swagger.config';
import { AppModule } from './app.module';
import rabbitConfig from './config/rabbit.config';

async function main(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // const adapter = app.get(HttpAdapterHost);
  // const exceptionFilter = new AppExceptionsFilter(adapter);
  //
  // app.useGlobalFilters(exceptionFilter);
  // app.enableShutdownHooks();
  app.setGlobalPrefix(config.server.routePrefix);

  // const validatorPipe = new AppValidationPipe();
  // app.useGlobalPipes(validatorPipe);
  //
  // const responseInterceptor = new ResponseInterceptor();
  // app.useGlobalInterceptors(responseInterceptor);

  app.connectMicroservice(rabbitConfig);

  /** Settings Swagger */
  const document = SwaggerModule.createDocument(app, swagger, {
    ignoreGlobalPrefix: true,
  });

  SwaggerModule.setup(
    `${config.server.routePrefix}${config.swagger.prefix}`,
    app,
    document,
  );

  app.enableCors(config.server.cors);
  app.use(helmet());

  await app.startAllMicroservices();
  await app.listen(config.server.port);
}

main();
