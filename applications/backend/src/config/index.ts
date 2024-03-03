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
  jwt: {
    secret: string;
    accessToken: {
      expirationTime: string;
    };
    refreshToken: {
      expirationTime: string;
    };
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
    primary: {
      user: process.env.POSTGRES_USER ?? '',
      password: process.env.POSTGRES_PASSWORD ?? '',
      db: process.env.POSTGRES_DB ?? '',
      host: process.env.POSTGRES_HOST ?? '',
      port: Number(process.env.POSTGRES_PORT),
    },
  },
};
