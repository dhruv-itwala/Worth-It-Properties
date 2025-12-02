import userService from "../services/user.service.js";

class UserController {
  async getMe(req, res) {
    const user = await userService.getUserById(req.userId);
    res.json({ success: true, user });
  }

  async completeProfile(req, res) {
    try {
      const fileBuffer = req.file ? req.file.buffer : null;
      const payload = {
        ...req.body,
        fileBuffer,
        password: req.body.password || null,
      };
      const updatedUser = await userService.completeProfile(
        req.userId,
        payload
      );
      res.json({
        success: true,
        user: updatedUser,
        message: "Profile updated",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default new UserController();
