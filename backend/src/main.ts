import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // origin: 'http://localhost:3001',
    origin: process.env.FRONTEND_URL || "*",
    credential: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalGuards(new JwtAuthGuard(app.get(JwtService)));
  Logger.log('Application is running on: http://localhost:3000', 'Bootstrap');
  await app.listen(process.env.PORT || 3000);
  // await app.listen(3000);
}
bootstrap();



// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();
