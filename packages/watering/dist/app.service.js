"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const constants_1 = require("./config/constants");
const config_service_1 = require("./config/config.service");
const schedule_1 = require("@nestjs/schedule");
const onoff_1 = require("onoff");
const api_common_1 = require("api-common");
let AppService = class AppService {
    constructor(mqttClient, configService) {
        this.mqttClient = mqttClient;
        this.configService = configService;
        this.status = new api_common_1.WateringStatus('WTR_01_LIVING_ROOM', 'Watering can');
        if (configService.isProd())
            this.pomp = new onoff_1.Gpio(configService.getRelayPin(), 'out');
        else {
            this.pomp = {
                writeSync: ((n) => {
                    console.log('GPIO Write', n);
                }),
            };
        }
        this.turnOff();
        this.emitStatus();
    }
    statusCron() {
        if (!this.status.enabled)
            this.emitStatus();
    }
    emitStatus() {
        this.status.timestamp = +new Date();
        this.mqttClient.emit(`iot/${this.status.id}/status`, this.status);
        if (this.configService.isDev())
            console.log(this.status);
    }
    toggle() {
        if (this.status.enabled)
            this.turnOff();
        else
            this.turnOn();
    }
    async turnOff() {
        this.status.enabled = false;
        this.status.pompOn = false;
        await this.wait(500);
        this.pomp.writeSync(1);
        this.emitStatus();
    }
    async turnOn() {
        this.status.enabled = true;
        this.status.pompOn = false;
        this.loop();
    }
    async loop() {
        this.pomp.writeSync(0);
        this.status.pompOn = true;
        this.emitStatus();
        await this.wait(100);
        this.pomp.writeSync(1);
        this.status.pompOn = false;
        this.emitStatus();
        await this.wait(200);
        if (this.status.enabled)
            this.loop();
    }
    async wait(delay = 0) {
        return new Promise((r) => setTimeout(r, delay));
    }
};
__decorate([
    schedule_1.Cron('*/10 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppService.prototype, "statusCron", null);
AppService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(constants_1.IotMqttClient)),
    __metadata("design:paramtypes", [microservices_1.ClientProxy,
        config_service_1.ConfigService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map