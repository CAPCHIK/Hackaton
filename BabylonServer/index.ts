import * as http from "http";
import * as sockio from "socket.io";



const server: http.Server = http.createServer((req, res) => {
    res.end("For replication");
});
server.listen(80);
const io: SocketIO.Server = sockio(server);
io.on("connection", socket => {
    socket.emit("ok", "hi message");
});
