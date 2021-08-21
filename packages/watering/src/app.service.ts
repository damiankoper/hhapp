import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IotMqttClient } from './config/constants';
import { ConfigService } from './config/config.service';
import getMAC from 'getmac';
import { Cron } from '@nestjs/schedule';
import { WateringStatus } from './models/watering-status.model';
import { BinaryValue, Gpio } from 'onoff';

@Injectable()
export class AppService {
  private status: WateringStatus = new WateringStatus();
  private pomp: Gpio;

  constructor(
    @Inject(IotMqttClient) private mqttClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {
    this.status.id = 'WTR_01_LIVING_ROOM';
    this.status.name = 'Watering can';
    this.status.mac = getMAC();

    if (configService.isProd())
      this.pomp = new Gpio(configService.getRelayPin(), 'out');
    else {
      this.pomp = {
        writeSync: ((n: BinaryValue) => {
          console.log('GPIO Write', n);
        }) as any,
      } as Gpio;
    }

    this.turnOff();
    this.emitStatus();
  }

  @Cron('*/10 * * * * *')
  public statusCron() {
    if (!this.status.enabled) this.emitStatus();
  }

  public emitStatus() {
    this.status.timestamp = +new Date();
    this.mqttClient.emit('iot/watering/status', this.status);
    if (this.configService.isDev()) console.log(this.status);
  }

  public toggle() {
    if (this.status.enabled) this.turnOff();
    else this.turnOn();
  }

  private async turnOff() {
    this.status.enabled = false;
    this.status.pompOn = false;
    await this.wait(500);
    this.pomp.writeSync(1);
    this.emitStatus();
  }

  private async turnOn() {
    this.status.enabled = true;
    this.status.pompOn = false;
    this.loop();
  }

  private async loop() {
    this.pomp.writeSync(0);
    this.status.pompOn = true;
    this.emitStatus();
    await this.wait(100);
    this.pomp.writeSync(1);
    this.status.pompOn = false;
    this.emitStatus();
    await this.wait(200);
    if (this.status.enabled) this.loop();
  }

  private async wait(delay = 0) {
    return new Promise((r) => setTimeout(r, delay));
  }
}
