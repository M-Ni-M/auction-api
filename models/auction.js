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
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    startingBid: {
      type: Number,
      required: true,
    },
    currentBid: {
      type: Number,
      default: null,
    },
    startTime: {
      type: Date,
      required : true
    },
    endTime: {
      type: Date,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    winningBidderId: {
      type: Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

auctionSchema.plugin(normalize);

export const AuctionModel = model('Auction', auctionSchema);
