// middlewares/validateProperty.js (example)
import Joi from "joi";

const schema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  price: Joi.number().required(),
  bhk: Joi.number().required(),
  propertyType: Joi.string()
    .valid("flat", "house", "plot", "office", "shop")
    .required(),
  areaSqFt: Joi.number().required(),
  furnishing: Joi.string()
    .valid("unfurnished", "semi-furnished", "fully-furnished")
    .required(),
  status: Joi.string().valid("new", "resale").required(),
  city: Joi.string().required(),
  locality: Joi.string().required(),
  // optional others...
});

export default function validateProperty(req, res, next) {
  const payload = { ...req.body };
  // parse amenities if provided
  if (payload.amenities) {
    try {
      payload.amenities = JSON.parse(payload.amenities);
    } catch {}
  }
  const { error } = schema.validate(payload, { abortEarly: false });
  if (error)
    return res.status(400).json({
      success: false,
      message: error.details.map((d) => d.message).join(", "),
    });
  next();
}
