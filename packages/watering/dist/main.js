"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_service_1 = require("./config/config.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, new config_service_1.ConfigService().createClientOptions());
    await app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map