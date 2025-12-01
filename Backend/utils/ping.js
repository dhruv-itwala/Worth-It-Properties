///utils/ping.js
export const ping = (req, res) => {
  res.status(200).send("✅ App is awake.");
};
