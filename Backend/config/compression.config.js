// config/compression.config.js
import compression from "compression";

const compressionConfig = compression({
  level: 6,
  threshold: 0,
});

export default compressionConfig;
