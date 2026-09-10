import { Server } from "socket.io";


let io;


export const initializeSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });


    io.on("connection", (socket) => {

        console.log(
            "User connected:",
            socket.id
        );


        socket.on("joinRoom", (roomId) => {

            socket.join(roomId);

        });


        socket.on("sendMessage", (data) => {

            io.to(data.roomId).emit(
                "receiveMessage",
                data
            );

        });


        socket.on("disconnect", () => {

            console.log(
                "User disconnected:",
                socket.id
            );

        });

    });

};



export const getIO = () => {

    if (!io) {
        throw new Error(
            "Socket.io not initialized"
        );
    }


    return io;

};