var socket = io('http://localhost');
socket.on('connect', function () { });
socket.on('event', function (data) { });
socket.on('disconnect', function () { });
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
        socket.emit('carry_buff');
    };
    ServerCommunication.prototype.MoveTreasure = function (position) {
        socket.emit('move_treasure', position);
    };
    return ServerCommunication;
}());
var Vector2 = /** @class */ (function () {
    function Vector2() {
    }
    return Vector2;
}());
var funHackManager = new ServerCommunication();
