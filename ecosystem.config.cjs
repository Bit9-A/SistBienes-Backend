const path = require('path');

module.exports = {
  apps : [{
    name   : "sistbienes-backend",
    script : path.resolve(__dirname, "dist", "index.mjs"),
    env: {
      NODE_ENV: "production"
    }
  }]
};
