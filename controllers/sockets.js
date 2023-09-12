var colors = [
    'goldenRod',
    'robinBlue',
    'copper',
    'peach'
];
const socketInfo = {};

/*
    socketInfo = {
        roomId: {
            userId: {
                socketId: socketId,
                userName: userName,
                userEmail: userEmail
                isAdmin: isAdmin [true/false]
                userCursorPos: {
                    startLineNumber: 0,
                    startColumn: 0,
                    endLineNumber: 0,
                    endColumn: 0
                }
            }
        }
    }

*/

exports.EditorSockets = (io) => {

    io.use((socket, next) => {
        socket.data = socket.handshake.auth;
        console.log(socket.data);
        next();
    });

    io.on("connection", (socket) => {
        socket.on('join-room', ({ roomId, userId, userEmail, userName }) => {

            socket.join(roomId);
            socketInfo[roomId] = socketInfo[roomId] || {};
            socketInfo[roomId][userId] = {
                socketId: socket.id,
                userId: userId,
                userName: userName,
                userEmail: userEmail,
                userColor: colors[(Object.keys(socketInfo[roomId]).length + 1) % colors.length],
                userCursorPos: {
                    startLineNumber: 1 + Object.keys(socketInfo[roomId]).length,
                    startColumn: 1,
                    endLineNumber: 1 + Object.keys(socketInfo[roomId]).length,
                    endColumn: 2
                },
                isAdmin: Object.keys(socketInfo[roomId]).length === 0 ? true : false,
            };
            console.log("socketInfo", socketInfo);
            console.log("socketInfo", Object.values(socketInfo[roomId]));

            // io.to(roomId).emit("user-connected", { ...socketInfo[roomId][userId] }); //sent to all users
            io.to(roomId).emit("user-data-transfer", Object.values(socketInfo[roomId])); //sent to all users
            // io.in(roomId).emit('announcement', `${username} has joined the room`);
        });

        socket.on('code-change', ({ roomId, userId, isSocket, code }) => {
            try {
                // console.log("code change", code.changes[0].range.startLineNumber, code.changes[0].range.startColumn, code.changes[0].range.endLineNumber, code.changes[0].range.endColumn);

                //recheck the logic
                // if (code.changes[0].text.length >= 1) {
                //     socketInfo[roomId][userId].userCursorPos.endColumn = code.changes[0].range.endColumn + 1;
                // }
                // else {
                //     socketInfo[roomId][userId].userCursorPos.endColumn = code.changes[0].range.endColumn;
                // }
                socketInfo[roomId][userId].userCursorPos.endColumn = code.changes[0].range.endColumn;
                socketInfo[roomId][userId].userCursorPos.startLineNumber = code.changes[0].range.startLineNumber;
                socketInfo[roomId][userId].userCursorPos.startColumn = code.changes[0].range.startColumn;
                socketInfo[roomId][userId].userCursorPos.endLineNumber = code.changes[0].range.endLineNumber;
                socket.to(roomId).emit("code-change-transfer", { isSocket, userId, code }); //broadcasting to all users except the sender
            }
            catch (err) {
                console.log(err);
            }
        });



        socket.on('leave-room', ({ roomId, userId }) => {
            try {

                socket.leave(roomId);
                delete socketInfo[roomId][userId];
                io.to(roomId).emit("user-disconnected", userId);
            }
            catch (err) {
                console.log(err);
            }
        });

        socket.on('disconnect', () => {
            try {
                socket.leave(socket.data.roomId);
                delete socketInfo[socket.data.roomId][socket.data.userId];
                io.to(socket.data.roomId).emit("user-disconnected", socket.data.userId);
                console.log(socketInfo, 'user disconnected');
            }
            catch (err) {
                console.log(err);
            }
        });
    });

}