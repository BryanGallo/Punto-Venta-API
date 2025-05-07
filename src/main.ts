import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  //?PIPE: se usa para trasformar datos y es para validacion
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //? elimina los datos que no estan en el dto
      forbidNonWhitelisted: true, //? envia un error si hay datos que no estan en el dto
    }),
  );
  await app.listen(3000);
}
bootstrap();
