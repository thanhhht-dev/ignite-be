import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JsendInterceptor } from './interceptors/jsend.interceptor';
import { JsendExceptionFilter } from './filters/jsend-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.setGlobalPrefix('api', { exclude: ['/'] });

  app.useGlobalInterceptors(new JsendInterceptor());
  app.useGlobalFilters(new JsendExceptionFilter());

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
