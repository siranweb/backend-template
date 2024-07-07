import * as process from 'process';
import { IConfig, NodeEnv } from '@/infrastructure/config/types/config.interface';

export const config: IConfig = {
  nodeEnv: (process.env.NODE_ENV ?? NodeEnv.DEVELOPMENT) as NodeEnv,
  webServer: {
    port: Number(process.env.WEB_SERVER_PORT),
  },
  webSockets: {
    port: Number(process.env.WS_SERVER_PORT),
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    accessToken: {
      expirationTime: '2h',
    },
    refreshToken: {
      expirationTime: '30d',
    },
  },
  database: {
    app: {
      user: process.env.POSTGRES_USER ?? '',
      password: process.env.POSTGRES_PASSWORD ?? '',
      db: process.env.POSTGRES_DB ?? '',
      host: process.env.POSTGRES_HOST ?? '',
      port: Number(process.env.POSTGRES_PORT),
    },
  },
};
