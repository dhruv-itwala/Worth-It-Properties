import jwt from "jsonwebtoken";

export const generateToken = (
  payload = {},
  expires = "2h",
  secret = process.env.JWT_SECRET
) => jwt.sign(payload, secret, { expiresIn: expires });
