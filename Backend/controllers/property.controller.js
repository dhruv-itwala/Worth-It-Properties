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
      res.json({ success: true, property });
    } catch (err) {
      console.error("PROPERTY CREATE ERROR:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getAll(req, res) {
    const data = await propertyService.getAll(req.query);
    res.json({ success: true, ...data });
  }

  async getOne(req, res) {
    const property = await propertyService.getOne(req.params.id);
    property
      ? res.json({ success: true, property })
      : res.status(404).json({ message: "Property not found" });
  }

  async getUserProperties(req, res) {
    const properties = await propertyService.getUserProperties(
      req.params.userId
    );
    res.json({ success: true, properties });
  }

  async update(req, res) {
    const property = await propertyService.update(
      req.params.id,
      req.userId,
      req.body
    );
    res.json({ success: true, property });
  }

  async delete(req, res) {
    await propertyService.delete(req.params.id, req.userId);
    res.json({ success: true, message: "Property deleted" });
  }
}

export default new PropertyController();
