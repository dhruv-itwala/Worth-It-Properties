// services/auth.service.js
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.model.js";
import { generateToken } from "../utils/generateToken.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
  async verifyGoogleToken(token) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  }

  async findOrCreateGoogleUser(googleData) {
    const { name, email, picture, sub } = googleData;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub,
        avatar: picture,
        role: "user",
        lastLogin: new Date(),
      });
    } else {
      user.googleId = sub;
      user.avatar = picture;
      user.lastLogin = new Date();
      await user.save();
    }

    return user;
  }

  createSession(userId) {
    return generateToken(userId, "2h");
  }
}

export default new AuthService();
