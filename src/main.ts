import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/response.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Helpdesk Lite API')
    .setDescription('REST API for managing support tickets')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-staff-key', in: 'header' }, 'x-staff-key')
    .build();
  const documentFactory = () => {
    const document = SwaggerModule.createDocument(app, config);
    document.paths['/docs-json'] = {
      get: { summary: 'OpenAPI JSON document', responses: { '200': { description: 'The OpenAPI specification' } } },
    };
    return document;
  };
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
