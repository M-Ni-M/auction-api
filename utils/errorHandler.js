//Handling socket-specific errors
export const handleSocketError = (socket, error) => {
  console.error(`Socket error for ${socket.id} : ${error.message}`);

  // Determine error type for more specific handling
  let errorType = "GENERAL_ERROR";
  let statusCode = 500;

  if (error.message.includes("Invalid")) {
    errorType = "Validation_Error";
    statusCode = 400;
  } else if (
    error.message.includes("permission") ||
    error.message.includes("unauthorized")
  ) {
    errorType = "AUTHORIZATION_ERROR";
    statusCode = 403;
  }

  // Send error information to client
  socket.emit("error", {
    type: errorType,
    statusCode,
    message: "An error ocurred",
    details: process.env.NODE_ENV === "production" ? undefined : error.message,
  });
};
