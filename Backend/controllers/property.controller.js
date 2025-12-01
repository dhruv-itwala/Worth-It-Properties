import propertyService from "../services/property.service.js";

class PropertyController {
  async create(req, res) {
    try {
      const { files } = req;
      const images = files?.images || [];
      const video = files?.video ? files.video[0] : null;

      if (images.length < 1 || images.length > 8) {
        return res.status(400).json({
          message: "Property must have 1–8 images",
        });
      }

      const property = await propertyService.createProperty(
        req.body,
        req.userId,
        images,
        video
      );

      res.json({ success: true, property });
    } catch (err) {
      console.error("[PROPERTY CREATE ERROR]", err);
      res.status(500).json({ message: err.message || "Server error" });
    }
  }

  async getAll(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await propertyService.getAll(page, limit);
    res.json({ success: true, ...data });
  }

  async getById(req, res) {
    const property = await propertyService.getById(req.params.id);
    res.json({ success: true, property });
  }

  async getByUser(req, res) {
    const properties = await propertyService.getByUser(req.params.userId);
    res.json({ success: true, properties });
  }

  async update(req, res) {
    const updated = await propertyService.updateProperty(
      req.params.id,
      req.userId,
      req.body
    );
    res.json({ success: true, property: updated });
  }

  async delete(req, res) {
    const deleted = await propertyService.deleteProperty(
      req.params.id,
      req.userId
    );
    res.json({ success: true, deleted });
  }
}

export default new PropertyController();
