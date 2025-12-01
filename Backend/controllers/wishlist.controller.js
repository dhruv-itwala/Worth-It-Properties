// controllers/wishlist.controller.js
import wishlistService from "../services/wishlist.service.js";

class WishlistController {
  async toggle(req, res) {
    try {
      const { propertyId } = req.params;

      const result = await wishlistService.toggleWishlist(
        req.userId,
        propertyId
      );

      res.json({
        success: true,
        message: result.added ? "Added to favorites" : "Removed from favorites",
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const list = await wishlistService.getWishlist(req.userId);

      res.json({ success: true, favorites: list });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async remove(req, res) {
    try {
      const { propertyId } = req.params;

      await wishlistService.removeFromWishlist(req.userId, propertyId);

      res.json({ success: true, message: "Removed from favorites" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new WishlistController();
