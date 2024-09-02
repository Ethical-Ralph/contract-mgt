import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors';
import { HttpExceptionFilter } from './filters';
import { ValidationPipe } from './pipes';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('shortlet');

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(app.get(ConfigService)));

  app.disable('x-powered-by');

  const config = new DocumentBuilder()
    .setTitle('shortlet API')
    .setDescription('shortlet API')
    .setVersion('1.0')
    .addTag('shortlet')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/api/docs',
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const auth = { login: 'shortlet', password: 'shortlet' };

      const b64auth = (req.headers.authorization || '').split(' ')[1] || '';

      const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

      if (!login || !password || login !== auth.login || password !== auth.password) {
        res.set('WWW-Authenticate', 'Basic realm="401"');
        res.status(401).send('Authentication required.');
        return;
      }

      next();
    }
  );

  SwaggerModule.setup('api/docs', app, document);

  const configService = app.get(ConfigService);

  const port = configService.get('PORT');

  process
    .on('unhandledRejection', (reason, p) => {
      logger.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
      logger.error(err, 'Uncaught Exception thrown');
    });

  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
