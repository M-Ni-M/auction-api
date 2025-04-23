import { AuctionModel } from "../models/auction.js";
import  BidModel  from "../models/bids.js";
import mongoose from "mongoose"; 

export const getBidsByAuction = async (req, res, next) => {
    const auctionId = req.params.auctionId; // Get auctionId from the request parameters
    
    if (!auctionId) {
        return res.status(400).json({ message: 'Auction ID is required.' });
    }

        // Validate auctionId
        if (!mongoose.isValidObjectId(auctionId)) {
            return res.status(400).json({ message: 'Invalid auction ID format.' });
        }

    try {
        // Fetch all bids for the specified auctionId
        const bids = await BidModel.find({ auctionId });

        // Check if bids were found
        if (bids.length === 0) {
            return res.status(404).json({ message: 'No bids found for this auction.' });
        }

        // Respond with the retrieved bids
        res.status(200).json({ bids: bids, totalBids: bids.length});
    } catch (error) {
        console.error('Error retrieving bids:', error);
        res.status(500).json({ message: 'Error retrieving bids.', error: error.message });
    }
};

export const getBidsByUser = async (req, res, next) => {
    // Get userId from the request parameters
    const userId = req.params.userId; 

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        // Fetch all bids made by the specified userId
        const bids = await BidModel.find({ userId });

        // Check if bids were found
        if (bids.length === 0) {
            return res.status(404).json({ message: 'No bids found for this user.' });
        }

        // Respond with the retrieved bids
        res.status(200).json({bids: bids, totalBids: bids.length});
    } catch (error) {
        console.error('Error retrieving bids:', error);
        res.status(500).json({ message: 'Error retrieving bids.', error: error.message });
    }
};


export const createBid = async (req, res, next) => {
    const { bidAmount } = req.body;
    const auctionId = req.params.auctionId;

    // Get userId
    const userId = req.auth.id;

    if (!auctionId || !userId || !bidAmount) {
        return res.status(400).json({ message: 'Required fields are missing.' });
    }

    try {
        // Fetch the auction to get the current highest bid and starting bid
        const auction = await AuctionModel.findById(auctionId);

        if (!auction) {
            return res.status(404).json({ message: 'Auction not found.' });
        }

        if (auction.status === 'closed'){
            return res.status(404).json({message: 'This auction is closed'})
        }

        // Check if the bid amount is higher than the current highest bid
        if (bidAmount <= auction.currentBid) {
            return res.status(400).json({ message: 'Bid amount must be higher than the current highest bid.', currentBid: auction.currentBid});
        }

        // Check if the bid amount is not less than the starting bid
        if (bidAmount < auction.startingBid) {
            return res.status(400).json({ message: 'Bid amount must be at least the starting bid.', startingBid: auction.startingBid});
        }

        // Create the new bid
        const newBid = await BidModel.create({
            auctionId,
            bidAmount,
            userId
        });

        // Update the auction's current bid
        auction.currentBid = bidAmount;
        auction.winningBidderId = userId;
        await auction.save();

        // Respond with the created bid
        res.status(201).json(newBid);
    } catch (error) {
        console.error('Error creating bid:', error); 
        res.status(500).json({ message: 'Error creating bid.', error: error.message });
    }
};

export const deleteBid = async (req, res, next) => {
    // Get bidId from request parameters
    const bidId = req.params.bidId;
    const userId = req.auth.id; // Get the authenticated user's ID
    // Validate required fields
    if (!bidId) {
        return res.status(400).json({ message: 'Bid ID is required.' });
    }

    try {
        // Find the bid by ID
        const bid = await BidModel.findById(bidId);

        // If no bid is found, respond with a 404 error
        if (!bid) {
            return res.status(404).json({ message: 'Bid not found.' });
        }

        // Check if the authenticated user is the owner of the bid
        if (bid.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized: You do not have permission to delete this bid.' });
        }

        // Delete the bid
        const deletedBid = await BidModel.findByIdAndDelete(bidId);

        // Respond with a success message
        res.status(200).json({ message: 'Bid deleted successfully.', bid: deletedBid });
    } catch (error){
        // Handle errors during bid deletion
        console.error('Error deleting bid:', error); // Log the error
        res.status(500).json({ message: 'Error deleting bid.', error: error.message });
    }
};
