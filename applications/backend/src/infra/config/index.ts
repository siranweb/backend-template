import * as process from 'process';

export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export interface Config {
  nodeEnv: NodeEnv;
  webServer: {
    port: number;
  };
  webSockets: {
    port: number;
  };
  database: {
    primary: {
      user: string;
      password: string;
      db: string;
      host: string;
      port: number;
    };
  };
}

export const config: Config = {
  nodeEnv: (process.env.NODE_ENV ?? NodeEnv.DEVELOPMENT) as NodeEnv,
  webServer: {
    port: +Number(process.env.WEB_SERVER_PORT),
  },
  webSockets: {
    port: +Number(process.env.WS_SERVER_PORT),
  },
  database: {
    primary: {
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      db: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
    },
  },
};
