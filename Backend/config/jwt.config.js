// config/jwt.config.js
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: "7d", // adjust if needed
};

export default jwtConfig;
