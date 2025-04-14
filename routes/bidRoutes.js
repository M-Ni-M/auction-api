import { Router } from "express";
import authMiddleware from "../middlewares/auth.js";
import { createBid, deleteBid } from "../controllers/bidController.js";
import { bidOwner } from "../middlewares/authz.js";

export const bidRouter = Router();

bidRouter.post("/create-bid/:auctionId", authMiddleware, createBid)

bidRouter.delete("/delete-bid/:id", authMiddleware, bidOwner, deleteBid);