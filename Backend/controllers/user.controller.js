// controllers/user.controller.js
import userService from "../services/user.service.js";

class UserController {
  async getMe(req, res) {
    const user = await userService.getUserById(req.userId);
    res.json({ success: true, user });
  }

  async completeProfile(req, res) {
    try {
      const updatedUser = await userService.completeProfile(
        req.userId,
        req.body
      );

      res.json({
        success: true,
        user: updatedUser,
        message: "Profile completed successfully",
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async updatePhoto(req, res) {
    try {
      if (!req.file)
        return res.status(400).json({ message: "Image file required" });

      const user = await userService.updateProfilePhoto(
        req.userId,
        req.file.path
      );

      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new UserController();
