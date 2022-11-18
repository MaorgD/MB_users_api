const Joi = require("joi");

exports.validVerifyUser = (_reqBody) => {
  let joiSchema = Joi.object({
    userId:Joi.string().min(2).required(),
    uniqueString: Joi.string().min(3).required(),
  })

  return joiSchema.validate(_reqBody);
}