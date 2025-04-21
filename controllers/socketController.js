import { joinRoom, leaveRoom } from "../services/roomService.js";
import { handleSocketError } from "../utils/errorHandler.js";

export const setupEventHandlers = (io) => {
  // Handle new client connections
  io.on("connection", (socket) => {
    try {
      console.log(`New Client connected: ${socket.id}`);

      // send welcome message to newly connected client
      socket.emit("welcome", {
        message: "Welcome to the Finalixima Server!",
        socketId: socket.id,
      });

      // Handle incoming messages from clients
      socket.on("message", (data) => {
        try {
          console.log(
            `Message received from ${socket.id} : ${JSON.stringify(data)}`
          );

          // Validate message data
          if (!data || !data.content) {
            throw new Error("Invalid message format");
          }

          // create message object with metadata
          const message = {
            id: Date.now().toString(),
            content: data.content,
            sender: socket.id,
            timestamp: new Date().toISOString(),
          };

          // Broadcast to all others clients
          socket.broadcast.emit("message", message);

          // Confirm receipt to sender
          socket.emit("messageSent", {
            status: "success",
            message,
          });
        } catch (error) {
          handleSocketError(socket, error);
        }
      });

      // Handle Room operations
      socket.on("joinRoom", (roomName) => {
        try {
          joinRoom(socket, roomName);

          // Notify room members about new user
          io.to(roomName).emit("userJoined", {
            message: `User ${socket.id} has joined the room`,
            room: roomName,
            userId: socket.id,
          });
        } catch (error) {
          handleSocketError(socket, error);
        }
      });

      socket.on("leaveRoom", (roomName) => {
        try {
          leaveRoom(socket, roomName);

          // Notify room members that user left
          io.to(roomName).emit("userLeft", {
            message: `User ${socket.id} has left the room`,
            room: roomName,
            userId: socket.id,
          });
        } catch (error) {
          handleSocketError(socket, error);
        }
      });

      // handle client disconnection
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);

        // Notify all clients about the diconnection
        io.emit("userDisconnected", {
          message: `User ${socket.id} has disconnected`,
          socketId: socket.id,
        });
      });
    } catch (error) {
      handleSocketError(socket, error);
    }
  });
};
