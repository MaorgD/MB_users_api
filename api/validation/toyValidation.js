const Joi = require("joi");


exports.validateToy = (_reqBody) => {
    let schemaJoi = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(3).max(100).required(),
        category: Joi.string().min(3).max(15).required(),
        img_url: Joi.string().min(2).max(500).allow(null, ""),
        price: Joi.number().min(1).max(9999).required()
    })
    return schemaJoi.validate(_reqBody);
}


