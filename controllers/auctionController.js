import { AuctionModel } from "../models/auction.js";
import { auctionItemValidator } from "../validators/auctionValidators.js";

//Add an item for auctioning
export const addItemToAuction = async (req, res, next) => {
  try {
    const { error, value } = auctionItemValidator.validate(
      {
        ...req.body,
        image: req.file?.filename,
      },
      {
        abortEarly: false,
      }
    );
    if (error) {
      res.status(422).json(error);
    }

    const addItem = await AuctionModel.create({
      ...value,
        userId: req.auth.id,
      
    });
    res.status(201).json({ message: "Item added for Auction", item: addItem });
  } catch (error) {
    next(error);
  }
};

// Get all items for auction
export const allAuctionItems = async (req, res, next) => {
  try {
    // Destructure Filter and sort parameters from the query
    const { filter = "{}", sort = "{}" } = req.query;
    // parse the filter and sort parameters
    const parsedFilter = JSON.parse(filter);
    const parsedSort = JSON.parse(sort);

    // fetch Items
    const items = await AuctionModel.find(parsedFilter)
      .populate("userId", "username")
      .sort(parsedSort)
      .exec();

    res.status(200).json({ items, totalItems: items.length });
  } catch (error) {
    next(error);
  }
};

// Get a Single Item for Auction
export const getAuctionItem = async (req, res, next) => {
  try {
    const item = await AuctionModel.findById(req.params.id, req.body);
    if(!item){
        res.status(404).json({message: "Item cannot be found"})
    }
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

// Update an Item for auction
export const updateItem = async (req, res, next) => {
  try {
    const { error, value } = auctionItemValidator.validate(
      {
        ...req.body,
        image: req.file?.filename,
      },
      {
        abortEarly: false,
      }
    );
    if (error) {
      return res.status(422).json(error);
    }

    const item = await AuctionModel.findByIdAndUpdate(req.params.id, value, {
      new: true,
    });

    res.status(200).json({ message: "Item updated !", item });
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const item = await AuctionModel.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "The Item is Gone 😭😔" });
  } catch (error) {
    next(error);
  }
};
