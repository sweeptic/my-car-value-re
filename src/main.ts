import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cookieSession({
      keys: ['some-nasty-keys-here'],
    }),
  );

  //   app.useGlobalPipes(
  //     new ValidationPipe({
  //       whitelist: true,
  //     }),
  //   );
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
