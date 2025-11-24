-- Create the tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  name TEXT,
  user_id UUID REFERENCES auth.users(id)
);

-- Enable Row-Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to see their own tasks
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own tasks
CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
