
var funHackManager = {};

var socket = io('http://62.109.18.175:4000');

socket.on('connect', function () { console.log('connected') });
socket.on('playerUpdate', function (data) {
    if (funHackManager.onPlayerUpdate) {
        funHackManager.onPlayerUpdate(data);
    }
});
socket.on('treasureUpdate', function (data) {
    if (funHackManager.treasureUpdate) {
        funHackManager.treasureUpdate(data);
    }
});
socket.on('mobsUpdate', (data) => {
    if (funHackManager.mobsUpdate) {
        funHackManager.mobsUpdate(data);
    }
});
socket.on('lootUpdate', (data) => {
    if (funHackManager.lootUpdate) {
        funHackManager.lootUpdate(data);
    }
});

funHackManager.Freeze = function(position){
    socket.emit('freeze', position);
}
funHackManager.TreasureHP= function() {
    this.socket.emit('treasure_hp');
}
funHackManager.BuildTower= function(position) {
    this.socket.emit('build_tower', position);
}
funHackManager.CarryBuff= function() {
    console.log("carry_buff invoked");
    this.socket.emit('carry_buff');
}
