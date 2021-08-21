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
import { IotMqttClient } from '../constants';

@WebSocketGateway({ cors: true })
export class WateringGateway implements OnGatewayConnection {
  constructor(
    protected readonly configService: ConfigService,
    @Inject(IotMqttClient) private mqttClient: ClientProxy,
  ) {}

  @WebSocketServer()
  public wsServer: Server;
  /** TODO: Save and emit last status on connect */

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

    return client;
  }

  @SubscribeMessage('iot/watering/toggle')
  toggle() {
    this.mqttClient.emit('iot/watering/toggle', '');
  }
}
