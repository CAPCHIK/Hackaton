"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const sockio = require("socket.io");
const server = http.createServer((req, res) => {
    res.end("For replication");
});
server.listen(4000);
const io = sockio(server);
io.on("connection", socket => {
    console.log("added client");
    socket.on("freeze", data => socket.broadcast.emit("freeze", data));
    socket.on("treasure_hp", () => socket.broadcast.emit("treasure_hp"));
    socket.on("build_tower", data => socket.broadcast.emit("build_tower", data));
    socket.on("playerUpdate", data => socket.broadcast.emit("playerUpdate", data));
    socket.on("treasureUpdate", data => socket.broadcast.emit("treasureUpdate", data));
    socket.on("mobsUpdate", data => socket.broadcast.emit("mobsUpdate", data));
    socket.on("lootUpdate", data => socket.broadcast.emit("lootUpdate", data));
    socket.on("carry_buff", () => {
        socket.broadcast.emit("carry_buff");
    });
    socket.on("move_treasure", data => socket.broadcast.emit("move_treasure", data));
});
//# sourceMappingURL=index.js.map