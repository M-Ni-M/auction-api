import Joi from "joi";


export const auctionItemValidator = new Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required().valid('agricultural products', 'artisan crafts', 'electronics & gadgets', 'fashion & home decor'),
    startingBid: Joi.number().required(),
    // duration: Joi.date().required(),
    // endTime: Joi.date().required(),
    // startTime: Joi.date().required(),
 
 
})