const Pool = require("pg").Pool;

// keep commented out locally, restore before deploying to Vercel (prod DB requires SSL)
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: true,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 5,
});

module.exports = pool;
