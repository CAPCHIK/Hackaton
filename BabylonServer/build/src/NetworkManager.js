"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NetworkManager {
    constructor(io) {
        this.io = io;
        this.currentUid = 0;
        this.sockets = new Array();
        this.units = new Map();
    }
    addConnection(socket) {
        console.log('add connection');
        socket.on('create_object', (args) => {
            console.log('test');
            this.onCreateObject(socket, args);
        });
        this.sockets.push(socket);
    }
    onCreateObject(socket, args) {
        var unit = {
            uid: this.currentUid++
        };
        for (var property in args) {
            if (args.hasOwnProperty(property)) {
                unit[property] = args[property];
            }
        }
        console.log(unit);
        this.units.set(unit.uid, unit);
        this.io.emit('create_object', unit);
    }
}
exports.NetworkManager = NetworkManager;
//# sourceMappingURL=NetworkManager.js.map