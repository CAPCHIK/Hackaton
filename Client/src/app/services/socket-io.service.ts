import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketIoService {
    connection: SocketIOClient.Socket;

    constructor() {
        this.connection = io('https://scenereplica.azurewebsites.net');
        this.connection.on('carry_buff',
            () => console.log('AZAZAZAZ'));
    }
}
