import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { resolve } from "path";
import { writeFileSync } from "fs";

const PORT = process.env.PORT || 5000;
const serverUrl = "https://nest-products-vercel-swagger.vercel.app";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle("Cats example")
    .setDescription("The cats API description")
    .setVersion("1.0")
    .addTag("cats")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  await app.listen(PORT);
  console.log("(process.env.NODE_ENV", process.env.NODE_ENV);

  // get the swagger json file (if app is running in development mode)
  if (process.env.NODE_ENV === "development") {
    const pathToSwaggerStaticFolder = resolve(process.cwd(), "swagger-static");

    // write swagger json file
    const pathToSwaggerJson = resolve(
      pathToSwaggerStaticFolder,
      "swagger.json"
    );
    const swaggerJson = JSON.stringify(document, null, 2);
    writeFileSync(pathToSwaggerJson, swaggerJson);
    console.log(`Swagger JSON file written to: '/swagger-static/swagger.json'`);
  }

}

bootstrap();
