// controllers/property.controller.js
import propertyService from "../services/property.service.js";

class PropertyController {
  async create(req, res) {
    try {
      const property = await propertyService.create(
        req.userId,
        req.body,
        req.files
      );
      return res.json({ success: true, property });
    } catch (err) {
      console.error("PROPERTY CREATE ERROR:", err);
      return res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  async getAll(req, res) {
    const data = await propertyService.getAll(req.query);
    return res.json({ success: true, ...data });
  }

  async getOne(req, res) {
    const property = await propertyService.getOne(req.params.id);
    if (!property)
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    return res.json({ success: true, property });
  }

  async getUserProperties(req, res) {
    const properties = await propertyService.getUserProperties(
      req.params.userId
    );
    return res.json({ success: true, properties });
  }

  async update(req, res) {
    try {
      const property = await propertyService.update(
        req.params.id,
        req.userId,
        req.body,
        req.files
      );
      return res.json({ success: true, property });
    } catch (err) {
      console.error("PROPERTY UPDATE ERROR:", err);
      return res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  async delete(req, res) {
    try {
      await propertyService.delete(req.params.id, req.userId);
      return res.json({ success: true, message: "Property deleted" });
    } catch (err) {
      console.error("PROPERTY DELETE ERROR:", err);
      return res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }
}

export default new PropertyController();
