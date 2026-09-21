import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap') // para verlo en la terminal la linea de App runing

  // para poner el prefijo api a la url
  app.setGlobalPrefix('api')

  //para definir los pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted : true
    })
  )

  // mandamos el puerto donde hacer la app
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`App Runing on port ${process.env.PORT || 3000}`)

}
bootstrap();
