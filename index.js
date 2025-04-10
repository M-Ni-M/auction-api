import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { initSocketIO } from "./config/socketConfig.js";
import { createServer } from "http";
import itemRouter from "./routes/auctionRoutes.js";
import userRouter from "./routes/userRoutes.js";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";

//Database connection
async function connectionDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database too Fired Up🔥😎");
  } catch (error) {
    throw new Error("Database is too calm 😩", error);
  }
}

//Call the function to connect to the database
await connectionDatabase();

// App Setup and Creation
const myApp = express();
myApp.use(express.json());
myApp.use(express.urlencoded({ extended: true }));
myApp.use(cors());

// Basic Route for testing
myApp.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "WebSocket server is running",
  });
});
const port = process.env.PORT || 3333;

myApp.use(
  session({
    secret: process.env.JWT_SECRET_KEY || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

myApp.use(passport.initialize());
myApp.use(passport.session());

//Create HTTP server using Express app
const httpServer = createServer(myApp);

// Routes
myApp.use("/api/v1", itemRouter);
myApp.use("/api/v1", userRouter);

// Initialize socket.io with the HTTP server
const io = initSocketIO(httpServer);

// Start the Server
httpServer.listen(port, () => {
  console.log(`Server is fired up on ${port}`);
});
