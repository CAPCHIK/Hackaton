
export class NetworkManager {
    private sockets: SocketIO.Socket[];

    private currentUid: number = 0;
    private units: Map<number, any>;

    constructor(private io: SocketIO.Server) {
        this.sockets = new Array<SocketIO.Socket>();
        this.units = new Map<number, any>();
    }

    addConnection(socket: SocketIO.Socket) {
        console.log('add connection');

        socket.on('create_object', (args) => {
            console.log('test');
            this.onCreateObject(socket, args);
        });

        this.sockets.push(socket);
    }

    onCreateObject(socket: SocketIO.Socket, args: any) {
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