


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
    public onPlayerUpdate;
    public lootUpdate;
    public mobsUpdate;
    public treasureUpdate;
    setTreasureUpdate(func){
        func('lol');
        this.treasureUpdate = func;
    }
    private socket;
    constructor() {
        this.socket = io('http://62.109.18.175:4000');
        this.socket.on('connect', function () { console.log('connected') });
        this.socket.on('playerUpdate', (data) => {
            if (this.onPlayerUpdate) {
                this.onPlayerUpdate(data);
            }
        });
        this.socket.on('treasureUpdate', data => {
            console.log('asd');
            console.log(this.treasureUpdate);
            console.log(data);
            if (this.treasureUpdate) {
                this.treasureUpdate(data);
            }
        });
        this.socket.on('mobsUpdate', (data) => {
            if (this.mobsUpdate) {
                this.mobsUpdate(data);
            }
        });
        this.socket.on('lootUpdate', (data) => {
            if (this.lootUpdate) {
                this.lootUpdate(data);
            }
        })
    }
}

class Vector2 {
    public x: number = 0;
    public y: number = 0;
}

const funHackManager = new ServerCommunication();