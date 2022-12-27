/* eslint-disable no-console */

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app/app.module';

const PORT = process.env.PORT || 3333;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*' },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥🚀`));
}

bootstrap();
