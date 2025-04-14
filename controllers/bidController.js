import  BidModel  from "../models/bids.js"; 


export const createBid = async (req, res, next) => {
    const { bidAmount } = req.body;

    const auctionId = req.params.auctionId;
    console.log(auctionId, "This is for the auction id");

    // Get userId
    const userId = req.auth.id;

    if (!auctionId || !userId || !bidAmount) {
        return res.status(400).json({ message: 'Required fields are missing.' });
    }

    try {
        const newBid = await BidModel.create({
            auctionId,
            bidAmount 
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
    console.log(bidId, "This is the bid ID to delete");

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