-- Create the userinfo table
CREATE TABLE
  userinfo (
    id TEXT NOT NULL PRIMARY KEY,
    username TEXT,
    name TEXT,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

-- Enable Row-Level Security
ALTER TABLE userinfo ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to see their own userinfo
CREATE POLICY "Users can view their own userinfo" ON userinfo FOR
SELECT
  USING (auth.uid () :: TEXT = id);

-- Create a policy that allows users to update their own userinfo
CREATE POLICY "Users can update their own userinfo" ON userinfo FOR
UPDATE
  USING (auth.uid () :: TEXT = id) WITH CHECK (auth.uid () :: TEXT = id);
