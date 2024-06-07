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
        text,
        timeSent,
      }: {
        id: string;
        authorId: string;
        recipientId: string;
        conversationId: string;
        text: string;
        timeSent: Date;
      }) => {
        socket.broadcast.to(recipientId).emit("receive-message", {
          id,
          authorId,
          recipientId,
          conversationId,
          text,
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
