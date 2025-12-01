// controllers/auth.controller.js
import authService from "../services/auth.service.js";
import User from "../models/User.model.js";

class AuthController {
  async googleLogin(req, res) {
    try {
      const { token } = req.body;
      if (!token)
        return res.status(400).json({ message: "Google token missing" });

      const googleData = await authService.verifyGoogleToken(token);

      const user = await authService.findOrCreateGoogleUser(googleData);

      const jwtToken = authService.createSession(user._id);

      res.cookie("auth_token", jwtToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 60 * 60 * 1000,
      });

      res.json({ success: true, user });
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: "Invalid Google Token" });
    }
  }

  async getMe(req, res) {
    res.json({ success: true, user: req.user });
  }

  async logout(req, res) {
    res.clearCookie("auth_token");
    res.json({ success: true, message: "Logged out" });
  }
}

export default new AuthController();
