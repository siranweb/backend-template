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
  sockets: {
    port: number;
  };
}

export const config: Config = {
  nodeEnv: (process.env.NODE_ENV ?? NodeEnv.DEVELOPMENT) as NodeEnv,
  webServer: {
    port: Number(process.env.WEB_SERVER_PORT) ?? 0,
  },
  sockets: {
    port: Number(process.env.SOCKETIO_PORT) ?? 0,
  },
};
