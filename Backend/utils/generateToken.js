// utils/generateToken.js
import jwt from "jsonwebtoken";

export const generateToken = (userId, expires = "2h") => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: expires,
  });
};
