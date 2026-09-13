const { Pool } = require("pg");
require("dotenv").config();

// Neon (and most hosted Postgres providers) require an SSL connection.
// Using a single connection string instead of separate host/port/user/
// password fields also means there's only one value to copy correctly
// from Neon's dashboard into .env, rather than five.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("connect", () => {
  console.log("PostgreSQL database connected successfully ✅");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
});

module.exports = pool;