import os from "os";

export function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address; // returns 192.168.x.x locally
      }
    }
  }

  return "0.0.0.0"; // fallback
}
