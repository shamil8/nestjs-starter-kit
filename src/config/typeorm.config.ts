import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

import { DatabaseConfig } from '../modules/database/config/database.config';

config();

const configService = new ConfigService();

export default new DataSource(DatabaseConfig(configService));
