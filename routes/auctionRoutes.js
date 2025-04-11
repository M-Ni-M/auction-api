import { Router } from "express";
import { auctionItemImage } from "../middlewares/upload.js";
import {
  addItemToAuction,
  allAuctionItems,
  deleteItem,
  getAuctionItem,
  updateItem,
} from "../controllers/auctionController.js";
import  authMiddleware  from "../middlewares/auth.js";
import { auctionOwner } from "../middlewares/authz.js";

const itemRouter = Router();

itemRouter.post(
  "/add-item",
  auctionItemImage.single("image"), authMiddleware,
  addItemToAuction
);

itemRouter.get("/all-items", allAuctionItems);

itemRouter.get("/item/:id", getAuctionItem);

itemRouter.patch(
  "/update-item/:id",
  auctionItemImage.single("image"), authMiddleware, auctionOwner,
  updateItem
);

itemRouter.delete("/delete-item/:id", authMiddleware, auctionOwner, deleteItem);


export default itemRouter;