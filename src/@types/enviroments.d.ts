declare namespace NodeJS {
  declare interface ProcessEnv {
    BASE_API_PREFIX: string;
    JWT_SECRET: string;
    NODE_ENV: 'development' | 'production' | 'test';

    SENDGRID_SENDER_EMAIL: string;
    SENDGRID_RECEIVER_EMAIL: string;
    SENDGRID_API_KEY: string;
  }
}
