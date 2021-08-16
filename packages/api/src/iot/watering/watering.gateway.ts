import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ConfigService } from 'src/config/config.service';

@WebSocketGateway({ cors: true })
export class WateringGateway implements OnGatewayConnection {
  constructor(protected readonly configService: ConfigService) {}

  handleConnection(client: Socket) {
    const authToken = client.handshake.auth.token;
    try {
      jwt.verify(authToken, this.configService.createJwtSecretOptions().secret);
    } catch (e) {
      client.emit('error', 'Not authorized!');
      client.disconnect(true);
      console.log('client disconnected');
    }

    return client;
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    return ['Hello world!'];
  }
}
