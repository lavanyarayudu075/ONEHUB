const pool = require("./config/db");

const resetSchema = `
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  manager VARCHAR(150) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, name)
);

CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'Member' CHECK (role IN ('Administrator', 'Manager', 'Member')),
  department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, email)
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  organization_id INTEGER NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee VARCHAR(150) NOT NULL,
  department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
  due_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_departments_org ON departments(organization_id);
CREATE INDEX idx_members_org ON members(organization_id);
CREATE INDEX idx_members_department ON members(department_id);
CREATE INDEX idx_tasks_org ON tasks(organization_id);
CREATE INDEX idx_tasks_department ON tasks(department_id);
`;

async function resetMigration() {
  try {
    await pool.query(resetSchema);
    console.log("✅ Reset complete — departments, members, and tasks tables recreated with the correct schema.");
  } catch (error) {
    console.error("❌ Reset failed:", error);
  } finally {
    await pool.end();
  }
}

resetMigration();