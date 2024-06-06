import { newConnection } from "./newConnection";
import socketIo from "socket.io";

const socketRouter = (io: socketIo.Server) => {
  io.on("connection", async (socket) => {
    newConnection(socket);

    socket.on("error", function (err) {
      console.log(err.stack);
    });

    socket.on(
      "send-message",
      ({
        id,
        authorId,
        recipientId,
        conversationId,
        message,
        timeSent,
      }: {
        id: number;
        authorId: number;
        recipientId: number;
        conversationId: number;
        message: string;
        timeSent: Date;
      }) => {
        socket.broadcast.to(recipientId.toString()).emit("receive-message", {
          id,
          authorId,
          recipientId,
          conversationId,
          message,
          timeSent,
        });
      }
    );

    socket.on("disconnect", function () {
      socket.removeAllListeners("disconnect");
    });
  });
};

export { socketRouter };
