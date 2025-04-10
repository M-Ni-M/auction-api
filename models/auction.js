import { Schema, model, Types } from "mongoose";
import normalize from "normalize-mongoose";

const auctionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
        type: String,
        required: true
    },
    description: {
      type: String,
      required: true,
    },
    startingBid: {
      type: Number,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

auctionSchema.plugin(normalize);

export const AuctionModel = model('Auction', auctionSchema);
