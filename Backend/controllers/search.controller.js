// controllers/search.controller.js
import searchService from "../services/search.service.js";

class SearchController {
  async search(req, res) {
    try {
      const data = await searchService.search(req.query);
      res.json(data);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new SearchController();
