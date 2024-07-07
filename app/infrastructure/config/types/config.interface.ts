export interface IConfig {
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
    app: {
      user: string;
      password: string;
      db: string;
      host: string;
      port: number;
    };
  };
}

export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}
