import { AuctionModel } from '../models/auction.js';
import BidModel from '../models/bids.js';
import { Types } from 'mongoose';


export const auctionOwner = async (req, res, next) => {
  const auctionId = req.params.id;

  if (!Types.ObjectId.isValid(auctionId)) {
    return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided auction ID is incomplete or invalid.',
    });
}

  try {
    // Find the auction by ID
    const auction = await AuctionModel.findById(auctionId);

    // Check if the auction exists
    if (!auction) {
      return res.status(404).json({ error: "Auction not found for this auctioneer" });
    }

    // Check if the authenticated user is the owner
    // Check if the auction has a userId and if it matches the authenticated user's ID
    if (!auction.userId) {
      return res.status(403).json({
        error: "Unauthorized",
        message: "This auction does not have a valid owner.",
      });
    }

    const auctionOwnerId = auction.userId.toString();

    const authenticatedUserId = req.auth.id;

    if (auctionOwnerId !== authenticatedUserId) {
      return res.status(403).json({
        error: "Unauthorized",
        message: "You do not have permission to edit this auction.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const bidOwner = async (req, res, next) => {
  const bidId = req.params.id; 

  if (!Types.ObjectId.isValid(bidId)) {
      return res.status(400).json({
          error: 'Invalid ID',
          message: 'The provided bid ID is incomplete or invalid.',
      });
  }

  try {
      // Find the bid by ID
      const bid = await BidModel.findById(bidId);

      // Check if the bid exists
      if (!bid) {
          return res.status(404).json({ error: "Bid not found." });
      }

      // Check if the authenticated user is the owner
      const bidOwnerId = bid.userId.toString();
      const authenticatedUserId = req.auth.id;

      if (bidOwnerId !== authenticatedUserId) {
          return res.status(403).json({
              error: "Unauthorized",
              message: "You do not have permission to modify or delete this bid.",
          });
      }

      next();
  } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
  }
};
