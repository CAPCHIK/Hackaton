var socket = io('http://localhost:4000');
socket.on('connect', function () { });
var ServerCommunication = /** @class */ (function () {
    function ServerCommunication() {
    }
    ServerCommunication.prototype.Freeze = function (position) {
        socket.emit('freeze', position);
    };
    ServerCommunication.prototype.TreasureHP = function () {
        socket.emit('treasure_hp');
    };
    ServerCommunication.prototype.BuildTower = function (position) {
        socket.emit('build_tower', position);
    };
    ServerCommunication.prototype.CarryBuff = function () {
        console.log("carry_buff invoked");
        socket.emit('carry_buff');
    };
    ServerCommunication.prototype.MoveTreasure = function (position) {
        socket.emit('move_treasure', position);
    };
    return ServerCommunication;
}());
var Vector2 = /** @class */ (function () {
    function Vector2() {
        this.X = 0;
        this.Y = 0;
    }
    return Vector2;
}());
var funHackManager = new ServerCommunication();
