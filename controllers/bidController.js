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
        const newBid = await BidModel.create({
            auctionId,
            bidAmount,
            userId
        });

        // Respond with the created bid
        res.status(201).json(newBid);
    } catch (error) {
        console.error('Error creating bid:', error); 
        res.status(500).json({ message: 'Error creating bid.', error: error.message });
    }
};

export const deleteBid = async (req, res, next) => {
    // Get bidId from request parameters
    const bidId = req.params.id;

    // Validate required fields
    if (!bidId) {
        return res.status(400).json({ message: 'Bid ID is required.' });
    }

    try {
        // Find and delete the bid using the provided bid ID
        const deletedBid = await BidModel.findByIdAndDelete(bidId);

        // If no bid is found, respond with a 404 error
        if (!deletedBid) {
            return res.status(404).json({ message: 'Bid not found.' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'Bid deleted successfully.', bid: deletedBid });
    } catch (error) {
        // Handle errors during bid deletion
        console.error('Error deleting bid:', error); // Log the error
        res.status(500).json({ message: 'Error deleting bid.', error: error.message });
    }
};