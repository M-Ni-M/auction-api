import { Schema, model, Types } from "mongoose";
import normalize from "normalize-mongoose";

const roomSchema = new Schema(
  {
   auction: {
    type: Types.ObjectId,
    ref: 'Auction',
    required: true,
  },
  users:
    {
      type: Types.ObjectId,
      ref: 'User',
    },
  },
  { 
    timestamps: true 
  }
);

roomSchema.plugin(normalize);
export const RoomModel = model('Room', roomSchema)