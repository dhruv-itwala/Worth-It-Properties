import { OAuth2Client } from "google-auth-library";
import User from "../models/User.model.js";
import { generateToken } from "../utils/generateToken.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
  async verifyGoogleToken(token) {
    try {
      // Decode token (NOT verifying yet)
      const decoded = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString()
      );

      console.log("🔍 Google Token AUD (from token):", decoded.aud);
      console.log("🔧 Backend GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

      // Now verify token properly
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      return ticket.getPayload();
    } catch (err) {
      console.error("❌ Google token verification failed:", err);
      throw err;
    }
  }

  async findOrCreateGoogleUser(googleData) {
    const { name, email, picture, sub } = googleData;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub,
        profilePhoto: picture,
        role: "buyer",
        lastLogin: new Date(),
      });
    } else {
      user.googleId = sub;
      user.profilePhoto = picture;
      user.lastLogin = new Date();
      await user.save();
    }
    return user;
  }

  createSession(userId) {
    return generateToken({ userId }, "2h");
  }
}

export default new AuthService();
