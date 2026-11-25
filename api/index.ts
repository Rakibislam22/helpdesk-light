import { NestFactory } from '@nestjs/core';
import type { Request, Response } from 'express';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.setup.js';

type ExpressHandler = (req: Request, res: Response) => void;

let cachedHandlerPromise: Promise<ExpressHandler> | undefined;

async function getHandler(): Promise<ExpressHandler> {
  if (!cachedHandlerPromise) {
    cachedHandlerPromise = (async () => {
      const app = await NestFactory.create(AppModule);
      configureApp(app);
      await app.init();
      return app.getHttpAdapter().getInstance() as ExpressHandler;
    })();
  }
  return cachedHandlerPromise;
}

/**
 * Vercel serverless function entrypoint.
 */
export default async function handler(req: Request, res: Response): Promise<void> {
  const expressHandler = await getHandler();
  expressHandler(req, res);
}
