import { Schema, model, Types } from "mongoose";
import normalize from "normalize-mongoose";


const TimeSchema = new Schema({
  hours: {
      type: Number,
      required: true,
      min: 0,
      max: 23,
  },
  minutes: {
      type: Number,
      required: true,
      min: 0,
      max: 59, 
  },
});


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
      enum: ['agricultural products', 'artisan crafts', 'electronics & gadgets', 'fashion & home decor'],
    },
    startingBid: {
      type: Number,
      required: true,
    },
    currentBid: {
      type: Number,
      default: null,
    },
    endTime: {
      type: Date,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
    },
    auctionDuration: {
      type: TimeSchema,
      required: true,
  },
  startTime: {
    type: TimeSchema,
    required: true,
},
    winningBidderId: {
      type: Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ['upcoming','active', 'closed'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
  }
);

auctionSchema.plugin(normalize);

export const AuctionModel = model('Auction', auctionSchema);
