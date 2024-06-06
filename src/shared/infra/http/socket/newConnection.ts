import socketIo from "socket.io";

export const newConnection = (socket: socketIo.Socket) => {
  try {
    const id = socket.handshake.query.id as string;
    socket.join(id);

  } catch (error) {
    console.log(error);
  }
};
