const devOrigins = [
  "http://localhost:5173",
  "http://localhost:5500",
  "http://localhost:3031",
  "http://localhost:3000",
];

const prodOrigins = ["https://worthitproperties.com"];

export default {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow mobile apps / Postman
    const whitelist = [...devOrigins, ...prodOrigins];
    cb(null, whitelist.includes(origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
