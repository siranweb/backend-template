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
}

export const config: Config = {
  nodeEnv: (process.env.NODE_ENV ?? NodeEnv.DEVELOPMENT) as NodeEnv,
  webServer: {
    port: Number(process.env.WEB_SERVER_PORT) ?? 0,
  },
  webSockets: {
    port: Number(process.env.WS_SERVER_PORT) ?? 0,
  },
};
