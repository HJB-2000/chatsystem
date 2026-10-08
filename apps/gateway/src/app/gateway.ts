import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { connect } from 'http2';
import { Server } from 'socket.io';
// import { WebSocketServer } from 'ws';


@WebSocketGateway({
    path: '/chat',
})

export class MyGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on('connection', (socket) => {
           console.log(socket.id);
           console.log('Connected'); 
        })
    }

    @SubscribeMessage('ping')
    onePing(@MessageBody() data:any) {
        console.log(data);
        this.server.emit('onMessage',
            {
                msg : "new message",
                content: data,
            }
        );
    }
}