// config/server.config.js
import { getLocalIP } from "./ip.config.js";

export const SERVER_CONFIG = {
  PORT: process.env.PORT || 5000,
  VERSION: process.env.API_VERSION || "v1",
  FRONTEND_PORT: process.env.FRONTEND_PORT || 3031,

  getURLs() {
    const ip = getLocalIP();
    const port = this.PORT;
    const ver = this.VERSION;
    const frontendPort = this.FRONTEND_PORT;

    return {
      local: `http://localhost:${port}/api/${ver}`,
      lan: `http://${ip}:${port}/api/${ver}`,
      ping: `http://${ip}:${port}/api/ping`,

      frontendlan: `http://${ip}:${frontendPort}`,
      frontendlocal: `http://localhost:${frontendPort}`,
    };
  },
};
