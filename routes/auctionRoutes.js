import { Router } from "express";
import { auctionItemImage } from "../middlewares/upload.js";
import {
  addItemToAuction,
  allAuctionItems,
  deleteItem,
  getAuctionItem,
  updateItem,
} from "../controllers/auctionController.js";

const itemRouter = Router();

itemRouter.post(
  "/add-item",
  auctionItemImage.single("image"),
  addItemToAuction
);

itemRouter.get("/all-items", allAuctionItems);

itemRouter.get("/item/:id", getAuctionItem);

itemRouter.patch(
  "/update-item/:id",
  auctionItemImage.single("image"),
  updateItem
);

itemRouter.delete("/delete-item/:id", deleteItem);


export default itemRouter;