import { Router } from "express";
import authMiddleware from "../middlewares/auth.js";
import { createBid, deleteBid, getBidsByAuction, getBidsByUser } from "../controllers/bidController.js";
import { bidOwner } from "../middlewares/authz.js";

export const bidRouter = Router();

bidRouter.post("/create-bid/:auctionId", authMiddleware, createBid)

bidRouter.delete("/delete-bid/:bidId", authMiddleware, bidOwner, deleteBid);

bidRouter.get("/auction/bids/:auctionId", authMiddleware, getBidsByAuction)

bidRouter.get("/user/bids/:userId", authMiddleware, getBidsByUser)