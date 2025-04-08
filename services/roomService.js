// Join a specific room

export const joinRoom = (socket, roomName) => {
  // Validate room name
  if (!roomName || typeof roomName !== "string") {
    throw new Error("Invalid room name");
  }

  // Join the room
  socket.join(roomName);
  console.log(`Client ${socket.id} joined room: ${roomName}`);

  // Send Confirmation to client
  socket.emit("roomJoined", {
    message: `Welcome, You have joined room: ${roomName}`,
    room: roomName,
  });

  return true;
};

// Leave a Specific room
export const leaveRoom = (socket, roomName) => {
  //Validate room name
  if (!roomName || typeof roomName !== "string") {
    throw new Error("Invalid room name");
  }

  // leave the room
  socket.leave(roomName);
  console.log(`Client ${socket.id} left room : ${roomName}`);

  // Send confirmation to client
  socket.emit("roomLeft", {
    message: `You left room: ${roomName}`,
    room: roomName,
  });

  return true;
};
