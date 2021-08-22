import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { Socket, Server } from 'socket.io';
import { ConfigService } from 'src/config/config.service';
import { DeviceType, Device } from 'api-common';
import { IotMqttClient } from './constants';

@WebSocketGateway({ cors: true })
export class IotGateway implements OnGatewayConnection {
  constructor(
    protected readonly configService: ConfigService,
    @Inject(IotMqttClient) private mqttClient: ClientProxy,
  ) {}

  @WebSocketServer()
  public wsServer: Server;
  public lastStatusMap = new Map<string, Device>();

  handleConnection(client: Socket) {
    const authToken: string = client.handshake.auth.token;
    try {
      if (this.configService.isProd()) {
        jwt.verify(
          authToken.slice(7),
          this.configService.createJwtSecretOptions().secret,
        );
      }
    } catch (e) {
      client.emit('error', 'Not authorized!');
      client.disconnect(true);
    }

    this.lastStatusMap.forEach((status) => {
      client.emit('iot/device/status', status);
    });

    return client;
  }

  emitStatus(data: Device) {
    this.lastStatusMap.set(data.id, data);
    this.wsServer.emit('iot/device/status', data);
  }

  @SubscribeMessage(`iot/${DeviceType.WATERING_CAN}/action`)
  actionWatering() {
    this.mqttClient.emit(`iot/${DeviceType.WATERING_CAN}/action`, '');
  }
}
