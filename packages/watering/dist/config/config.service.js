"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let ConfigService = class ConfigService {
    isDev() {
        return process.env.NODE_ENV !== 'production';
    }
    isProd() {
        return process.env.NODE_ENV === 'production';
    }
    createClientOptions() {
        return {
            transport: microservices_1.Transport.MQTT,
            options: {
                url: process.env.MQTT_BROKER_URL,
            },
        };
    }
    getRelayPin() {
        return +process.env.PIN_RELAY || 17;
    }
};
ConfigService = __decorate([
    common_1.Injectable()
], ConfigService);
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map