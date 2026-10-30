import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Vercel routes /api/* to this service without stripping the prefix.
  app.setGlobalPrefix("api");
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
