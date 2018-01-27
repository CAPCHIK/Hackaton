const socket = io('http://localhost:4000');
socket.on('connect', function () { });


class ServerCommunication {
    public Freeze(position: Vector2): void {
        socket.emit('freeze', position);
    }
    public TreasureHP() {
        socket.emit('treasure_hp');
    }
    public BuildTower(position: Vector2) {
        socket.emit('build_tower', position);
    }

    public CarryBuff() {
        console.log("carry_buff invoked");
        socket.emit('carry_buff');
    }

    public MoveTreasure(position: Vector2) {
        socket.emit('move_treasure', position);
    }
}

class Vector2 {
    public X: number = 0;
    public Y: number = 0;
}

const funHackManager = new ServerCommunication();