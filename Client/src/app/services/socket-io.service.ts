import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
@Injectable()
export class SocketIoService {

  constructor() {
    const connection = io('http://localhost');
    connection.on('ok', data => {
    });
  }

}
