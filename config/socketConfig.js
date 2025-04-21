import { Server } from "socket.io";
import { setupEventHandlers } from "../controllers/socketController.js";

export const initSocketIO = (httpServer) => {
  // Create new Socket.IO server instance
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Allow connections from any origin
      methods: ["GET", "POST"],
      credentials: true,
    },
    // Set ping timeout and interval
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Setup main namespace event handlers
  setupEventHandlers(io);

  // Setup auction namespace
  const auctionNamespace = io.of("/auction");
  setupAuctionNamespace(auctionNamespace);

  return io;
};

// function to setup auction namespace
const setupAuctionNamespace = (namespace) => {
  namespace.on("connection", (socket) => {
    console.log(`Client connected to auction namespace: ${socket.id}`);

    // Send Welcome message to client
    socket.emit("welcome", {
      message: "Welcome to the Auction namespace!",
      socketId: socket.id,
    });

    // Handle joining auction rooms
    socket.on("joinAuction", (auctionId) => {
      const roomName = `auction:${auctionId}`;
      socket.join(roomName);
      console.log(`Client ${socket.id} joined auction room: ${roomName}`);

      // Notify all clients in the room about the new user
      namespace.to(roomName).emit("userJoined", {
        message: `A new user has joined auction ${auctionId}`,
        socketId: socket.id,
      });
    });

    // Handle placing bids
    socket.on("placeBid", ({ auctionId, amount }) => {
      const roomName = `auction:${auctionId}`;

      // Broadcast bid to all users in the auction room
      namespace.to(roomName).emit("newBid", {
        auctionId,
        amount,
        bidder: socket.id,
        timestamp: new Date().toISOString(),
      });
    });
  });
};
