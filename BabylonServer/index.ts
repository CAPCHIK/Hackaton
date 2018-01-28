import * as http from "http";
import * as sockio from "socket.io";

const server: http.Server = http.createServer((req, res) => {
    res.end("For replication");
});

server.listen(80);

const io: SocketIO.Server = sockio(server);

io.on("connection", socket => {
    console.log("added client");

    socket.on("freeze", data =>
        socket.broadcast.emit("freeze", data));
    socket.on("treasure_hp", () =>
        socket.broadcast.emit("treasure_hp"));
    socket.on("build_tower", data =>
        socket.broadcast.emit("build_tower", data));
    socket.on("carry_buff", () => {
        console.log('carry buff');
        socket.broadcast.emit("carry_buff");
    });
    socket.on("move_treasure", data =>
        socket.broadcast.emit("move_treasure", data));

});