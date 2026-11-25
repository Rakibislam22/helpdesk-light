import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/response.interceptor.js';

/**
 * Applies shared global pipes, interceptors, route prefix, and OpenAPI docs
 * for both local server startup and Vercel serverless execution.
 */
export function configureApp(app: INestApplication): void {
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
      get: {
        summary: 'OpenAPI JSON document',
        responses: { '200': { description: 'The OpenAPI specification' } },
      },
    };
    return document;
  };

  const swaggerOptions = process.env.VERCEL
    ? {
        customCssUrl: 'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css',
        customJs: [
          'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js',
          'https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
        ],
      }
    : undefined;

  SwaggerModule.setup('docs', app, documentFactory, swaggerOptions);
}
