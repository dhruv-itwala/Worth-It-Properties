// services/wishlist.service.js
import User from "../models/User.model.js";
import Property from "../models/Property.model.js";

class WishlistService {
  async toggleWishlist(userId, propertyId) {
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    const exists = user.favouriteProperties.includes(propertyId);

    if (exists) {
      // Remove from favorites
      user.favouriteProperties = user.favouriteProperties.filter(
        (id) => id.toString() !== propertyId
      );
    } else {
      // Add to favorites
      user.favouriteProperties.push(propertyId);
    }

    await user.save();

    return { added: !exists };
  }

  async getWishlist(userId) {
    const user = await User.findById(userId).populate(
      "favouriteProperties",
      "title price city locality images bhk propertyType"
    );

    return user.favouriteProperties;
  }

  async removeFromWishlist(userId, propertyId) {
    const user = await User.findById(userId);

    user.favouriteProperties = user.favouriteProperties.filter(
      (id) => id.toString() !== propertyId
    );

    await user.save();

    return true;
  }
}

export default new WishlistService();
