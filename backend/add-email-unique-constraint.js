// One-off script — run once with `node add-email-unique-constraint.js`
// from inside backend/, same pattern as migrate.js / reset-migrate.js.
// It does NOT get required by server.js.
//
// Adds a database-level guarantee that no two users can ever share an
// email, closing the gap where registerUser used to only check for a
// duplicate email *within the same organisation* — two different
// organisations could end up with colliding accounts, and loginUser
// looks a user up by email alone with no organisation filter, so that
// collision made login ambiguous.
//
// Existing duplicate emails (e.g. left over from earlier testing) have
// to be resolved by hand before Postgres will accept the constraint, so
// this script checks for them first and tells you exactly which rows to
// look at instead of failing with a cryptic constraint-violation error.
const pool = require("./config/db");

async function run() {
  try {
    const duplicates = await pool.query(`
      SELECT email, COUNT(*) AS count, array_agg(id) AS user_ids
      FROM users
      GROUP BY email
      HAVING COUNT(*) > 1
    `);

    if (duplicates.rows.length > 0) {
      console.log("⚠️  Found duplicate emails — resolve these before re-running this script:\n");
      duplicates.rows.forEach((row) => {
        console.log(`  ${row.email} — user ids: ${row.user_ids.join(", ")}`);
      });
      console.log(
        "\nDelete or update the extra rows (e.g. via a one-off DELETE query for the id(s) you don't need), then run this script again."
      );
      return;
    }

    await pool.query(`
      ALTER TABLE users
      ADD CONSTRAINT users_email_unique UNIQUE (email)
    `);

    console.log("✅ users.email is now unique at the database level.");
  } catch (error) {
    if (error.code === "42710") {
      // duplicate_object — constraint already exists, nothing to do.
      console.log("✅ Constraint already exists — nothing to do.");
    } else {
      console.error("Migration failed:", error);
    }
  } finally {
    await pool.end();
  }
}

run();