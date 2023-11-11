import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const config = new DocumentBuilder()
    .setTitle('POS Apis')
    .setDescription('The POS API description')
    .setVersion('1.0')
    .addTag('pos')
    .build();
    const options: SwaggerDocumentOptions = {
      deepScanRoutes: true
  };
  const document = SwaggerModule.createDocument(app, config,options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
