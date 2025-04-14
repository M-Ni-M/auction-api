import { Schema, model, Types } from "mongoose";
import normalize from "normalize-mongoose";

const bidSchema = new Schema(
  {
    auctionId: {
      type: Types.ObjectId,
      required: true,
      ref: "Auction",
    },
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    bidAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    bidTime: {
      type: Date,
      default: Date.now,
    },
    isWinning: {
      type: Boolean,
      default: false,
    },
    bidStatus: {
      type: String,
      enum: ["active", "withdrawn", "canceled"],
      default: "active",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);


bidSchema.plugin(normalize);


const BidModel = model("Bid", bidSchema);

export default BidModel;