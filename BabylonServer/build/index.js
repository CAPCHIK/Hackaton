"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const sockio = require("socket.io");
const NetworkManager_1 = require("./src/NetworkManager");
const server = http.createServer((req, res) => {
    res.end("For replication");
});
server.listen(4000);
const io = sockio(server);
const networkManager = new NetworkManager_1.NetworkManager(io);
io.on("connection", socket => {
    networkManager.addConnection(socket);
});
//# sourceMappingURL=index.js.map