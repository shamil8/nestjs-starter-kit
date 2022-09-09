import { config } from 'dotenv';

config();

export default {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  },
  server: {
    appUrl: process.env.APP_URL,
    isDev: process.env.APP_ENV === 'develop',
    routePrefix: process.env.ROUTE_PREFIX || '/api',
    port: process.env.APP_PORT ? Number(process.env.APP_PORT) : 5000,
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  },
  swagger: {
    prefix: process.env.SWAGGER_PREFIX,
  },
};
