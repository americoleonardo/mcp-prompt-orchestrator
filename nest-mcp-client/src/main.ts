import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from './config/configuration';
import { Logger } from 'nestjs-pino';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = app.get<ConfigService<ConfigurationType>>(ConfigService);

  app.useLogger(app.get(Logger));
  
  const PORT = env.get('port', { infer: true });
  await app.listen(PORT);
}
bootstrap();
