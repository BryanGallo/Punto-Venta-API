import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(SeederModule);
  const seederService = app.get(SeederService);
  await seederService.seed();
  await app.close();
}
bootstrap();
