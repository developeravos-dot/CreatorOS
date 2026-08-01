import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { config as loadEnvironment } from 'dotenv';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { ApiErrorFilter } from './modules/core-v1/errors/api-error.filter';
import { RequestIdInterceptor } from './modules/core-v1/errors/request-id.interceptor';



// CREATOROS_ENV_LOADER_START
const creatorOsEnvironmentFiles = [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), 'apps/api/.env'),
];

for (const environmentFile of creatorOsEnvironmentFiles) {
  if (existsSync(environmentFile)) {
    loadEnvironment({
      path: environmentFile,
      override: false,
      quiet: true,
    });

    break;
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL could not be loaded from the CreatorOS environment files.',
  );
}
// CREATOROS_ENV_LOADER_END
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  });

  app.enableShutdownHooks();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new ApiErrorFilter());

  app.useGlobalInterceptors(
    new RequestIdInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  const swagger = new DocumentBuilder()
    .setTitle('CreatorOS API')
    .setDescription('CreatorOS Core V1 API')
    .setVersion('1.0.0')
    .addBearerAuth(
  {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Paste the JWT token only without the word Bearer',
  },
  'bearer',
)
.addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('docs', app, document);

  const config = app.get(ConfigService);
  const port = config.get<number>('port') ?? 3000;

  await app.listen(port);
}

void bootstrap();

