import Joi from "joi";


export const auctionItemValidator = new Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    startingBid: Joi.number().required(),
    endTime: Joi.string().required(),
})