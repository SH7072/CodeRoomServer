exports.EditorSockets = (io) => {

    io.use((socket, next) => {
        socket.data = socket.handshake.auth;
        next();
    });

    io.on("connection", (socket) => {
    });

}