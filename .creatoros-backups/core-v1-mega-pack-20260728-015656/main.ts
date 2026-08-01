import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const port = Number(process.env.CREATOROS_API_PORT ?? 3000);

  await app.listen(port);

  console.log(
    `CreatorOS / AVOS API running on http://localhost:${port}/api/v1`,
  );
}

bootstrap().catch((error: unknown) => {
  console.error('CreatorOS API failed to start:', error);
  process.exit(1);
});
