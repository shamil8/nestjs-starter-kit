import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';

import { CustomNamingStrategy } from '../utils/custom-naming-strategy';

export const databaseConfig = (
  configService: ConfigService,
): DataSourceOptions => ({
  namingStrategy: new CustomNamingStrategy(),
  name: 'default',
  type: 'postgres',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.getOrThrow('DB_USER'),
  password: configService.getOrThrow('DB_PASSWORD'),
  database: configService.getOrThrow('DB_NAME'),
  migrations: ['dist/src/migrations/**/*.js'],
  entities: ['dist/src/modules/**/entities/*.entity.js'],
  synchronize: false,
  logging: true,
  migrationsRun: true,
});
