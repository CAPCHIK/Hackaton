


class ServerCommunication {
    public Freeze(position: Vector2): void {
        this.socket.emit('freeze', position);
    }
    public TreasureHP() {
        this.socket.emit('treasure_hp');
    }
    public BuildTower(position: Vector2) {
        this.socket.emit('build_tower', position);
    }

    public CarryBuff() {
        console.log("carry_buff invoked");
        this.socket.emit('carry_buff');
    }

    public MoveTreasure(position: Vector2) {
        this.socket.emit('move_treasure', position);
    }
    moveTreasure: Observable<any>;
    private socket;
    constructor() {
        this.socket = io('http://localhost:4000');
        this.socket.on('connect', function () { console.log('connected')});
        this.socket.on('event', )
    }
}

class Vector2 {
    public x: number = 0;
    public y: number = 0;
}

const funHackManager = new ServerCommunication();