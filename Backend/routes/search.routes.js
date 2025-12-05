import express from "express";
import Property from "../models/Property.model.js";

const router = express.Router();

router.get("/properties", async (req, res) => {
  try {
    let {
      city,
      minPrice,
      maxPrice,
      bhk,
      propertyType,
      furnishing,
      status,
      q,
      sort,
    } = req.query;

    const filter = { published: true };

    if (city) filter.city = new RegExp(city, "i");
    if (bhk) filter.bhk = Number(bhk);
    if (propertyType) filter.propertyType = propertyType;
    if (furnishing) filter.furnishing = furnishing;
    if (status) filter.status = status;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Property.find(filter);

    if (q) query = query.find({ $text: { $search: q } });

    if (sort === "price_asc") query = query.sort({ price: 1 });
    if (sort === "price_desc") query = query.sort({ price: -1 });
    if (sort === "newest") query = query.sort({ createdAt: -1 });

    const properties = await query.exec();

    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
