import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as compression from "compression";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(compression());

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
