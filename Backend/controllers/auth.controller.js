import authService from "../services/auth.service.js";
import User from "../models/User.model.js";
import { comparePassword } from "../utils/encryption.js";

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
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 2 * 60 * 60 * 1000,
      });
      res.json({ success: true, user });
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Invalid Google Token" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });

      const user = await User.findOne({ email }).select("+password");
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
      if (!user.password)
        return res.status(400).json({ message: "Account uses Google login" });

      const match = await comparePassword(password, user.password);
      if (!match)
        return res.status(401).json({ message: "Invalid credentials" });

      const jwtToken = authService.createSession(user._id);
      res.cookie("auth_token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 2 * 60 * 60 * 1000,
      });

      const sanitizedUser = await User.findById(user._id);
      res.json({ success: true, user: sanitizedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "User login failed" });
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
