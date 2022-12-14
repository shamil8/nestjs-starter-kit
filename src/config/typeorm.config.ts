import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

import { databaseConfig } from '../modules/database/config/database.config';

config();

const configService = new ConfigService();

export default new DataSource(databaseConfig(configService));
