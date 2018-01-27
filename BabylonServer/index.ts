import * as http from "http";
import * as sockio from "socket.io";
import { NetworkManager } from "./src/NetworkManager";

const server: http.Server = http.createServer((req, res) => {
    res.end("For replication");
});

server.listen(4000);

const io: SocketIO.Server = sockio(server);
const networkManager = new NetworkManager(io);

io.on("connection", socket => {
    networkManager.addConnection(socket);
});