const { io } = require('../app');

const userSocketMap = {};


// const getAllConnectedClients = ({ roomId }) => {

//     return Array.from(io?.socket?.adapter.rooms.get(roomId) || []).map((socketId) => {
//         return {
//             socketId,
//             userId: userSocketMap[socketId],
//         }
//     }
//     );
// }

exports.onConnection = (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("coderoom:join-room", ({ roomId, userId, name }) => {
        console.log("User joined room:", roomId, userId);
        userSocketMap[socket.id] = { userId, name };
        socket.join(roomId);
        // const clients = getAllConnectedClients({ roomId });
        console.log("clients", userSocketMap);
        socket.to(roomId).emit("coderoom:user-connected", { userId, name });
    });

    socket.on("disconnect", () => {
        // userId = socket.id;
        const roomId = 1;
        const userId = userSocketMap[socket.id];
        delete userSocketMap[socket.id];

        console.log("User disconnected:", roomId, userId);
        socket.to(roomId).emit("coderoom:user-disconnected", userId);
    });

    socket.on("coderoom:leave-room", ({ roomId, userId }) => {
        socket.leave(roomId);
        socket.to(roomId).emit("coderoom:user-disconnected", userId);
    });

    socket.on("coderoom:code-change", ({ roomId, userId, isSocket, code }) => {
        // console.log("code change", roomId, userId, code);
        // socket.to(roomId).emit("coderoom:code-change", { isSocket, code });
    });

    socket.on("coderoom:cursor-change", ({ roomId, userId, cursor }) => {
        // console.log("cursor change", roomId, userId, cursor);
        socket.to(roomId).emit("coderoom:cursor-change", { cursor });
    });


}

