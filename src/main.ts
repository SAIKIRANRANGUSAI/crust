import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.static(join(__dirname, '..', 'public')));

  app.getHttpAdapter().get('/', (req, res) => {
    res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  });

  app.enableCors();
  await app.listen(process.env.PORT || 3000);

  console.log('Listening on port', process.env.PORT || 3000);
}
bootstrap();