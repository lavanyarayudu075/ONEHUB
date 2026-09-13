ALTER TABLE users
ADD COLUMN reset_password_token TEXT,
ADD COLUMN reset_password_expires TIMESTAMP;

SELECT id, email FROM users WHERE email = 'lavanyarayudu075@gmail.com';
-- Departments, Members, and Tasks now live in Postgres instead of the
-- frontend's in-memory AppDataContext. Every table carries an
-- organization_id so a query scoped to the authenticated user's
-- organisation can never see or touch another organisation's rows.

CREATE TABLE IF NOT EXISTS departments (
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

CREATE TABLE IF NOT EXISTS members (
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

CREATE TABLE IF NOT EXISTS tasks (
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

CREATE INDEX IF NOT EXISTS idx_departments_org ON departments(organization_id);
CREATE INDEX IF NOT EXISTS idx_members_org ON members(organization_id);
CREATE INDEX IF NOT EXISTS idx_members_department ON members(department_id);
CREATE INDEX IF NOT EXISTS idx_tasks_org ON tasks(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_department ON tasks(department_id);