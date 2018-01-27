"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const sockio = require("socket.io");
const server = http.createServer((req, res) => {
    res.end("For replication");
});
server.listen(80);
const io = sockio(server);
io.on("connection", socket => {
    socket.emit("ok", "hi message");
});
//# sourceMappingURL=index.js.map