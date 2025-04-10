import { Router } from "express";
import { auctionItemImage } from "../middlewares/upload.js";
import {
  addItemToAuction,
  allAuctionItems,
  deleteItem,
  getAuctionItem,
  updateItem,
} from "../controllers/auctionController.js";
import { auth } from "../middlewares/auth.js";
import { auctionOwner } from "../middlewares/authz.js";

const itemRouter = Router();

itemRouter.post(
  "/add-item",
  auctionItemImage.single("image"),auth,
  addItemToAuction
);

itemRouter.get("/all-items", allAuctionItems);

itemRouter.get("/item/:id", getAuctionItem);

itemRouter.patch(
  "/update-item/:id",
  auctionItemImage.single("image"), auth, auctionOwner,
  updateItem
);

itemRouter.delete("/delete-item/:id", auth, auctionOwner, deleteItem);


export default itemRouter;