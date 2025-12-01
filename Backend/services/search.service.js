// services/search.service.js
import Property from "../models/Property.model.js";

class SearchService {
  buildQuery(queryParams) {
    const query = {};

    const {
      city,
      area,
      priceMin,
      priceMax,
      bhk,
      furnishing,
      propertyType,
      postedBy,
      status,
      keyword,
    } = queryParams;

    if (city) query.city = new RegExp(city, "i");
    if (area) query.locality = new RegExp(area, "i");

    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    if (bhk) query.bhk = Number(bhk);
    if (furnishing) query.furnishing = furnishing;
    if (propertyType) query.propertyType = propertyType;
    if (postedBy) query.postedBy = postedBy;
    if (status) query.status = status;

    // Keyword search: title + description + locality
    if (keyword) {
      query.$or = [
        { title: new RegExp(keyword, "i") },
        { description: new RegExp(keyword, "i") },
        { locality: new RegExp(keyword, "i") },
      ];
    }

    return query;
  }

  buildSort(sortParam) {
    if (!sortParam) return { createdAt: -1 }; // default newest

    const sortOptions = {
      newest: { createdAt: -1 },
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
    };

    return sortOptions[sortParam] || { createdAt: -1 };
  }

  async search(queryParams) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    const query = this.buildQuery(queryParams);
    const sort = this.buildSort(queryParams.sort);

    const results = await Property.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const count = await Property.countDocuments(query);

    return {
      success: true,
      results,
      count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }
}

export default new SearchService();
