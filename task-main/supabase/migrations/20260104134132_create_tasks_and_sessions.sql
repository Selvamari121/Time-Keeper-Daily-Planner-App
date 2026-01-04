/*
  # Daily Task Planner Schema

  ## Overview
  Creates the foundation for a comprehensive task planning and time tracking application.

  ## New Tables
  
  ### `tasks`
  Stores all task information including scheduling and categorization.
  - `id` (uuid, primary key) - Unique task identifier
  - `title` (text, required) - Task title
  - `description` (text) - Detailed task description
  - `category` (text) - Task category (Work, Personal, Health, etc.)
  - `priority` (text) - Priority level (High, Medium, Low)
  - `start_time` (timestamptz) - Scheduled start time
  - `end_time` (timestamptz) - Scheduled end time
  - `estimated_duration` (integer) - Estimated duration in minutes
  - `status` (text, default 'pending') - Task status (pending, in-progress, completed, cancelled)
  - `notes` (text) - Additional notes
  - `tags` (text array) - Array of tags for categorization
  - `attachment_url` (text) - URL to attached file or resource
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `time_sessions`
  Tracks actual time spent on tasks with timer sessions.
  - `id` (uuid, primary key) - Unique session identifier
  - `task_id` (uuid, foreign key) - Reference to the task
  - `start_time` (timestamptz, required) - Session start time
  - `end_time` (timestamptz) - Session end time (null if running)
  - `duration` (integer) - Duration in seconds
  - `break_duration` (integer, default 0) - Break time in seconds
  - `notes` (text) - Session notes
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on both tables
  - Public access policies for demo purposes (can be restricted to authenticated users later)
  - Select, insert, update, delete policies for all users
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'General',
  priority text DEFAULT 'Medium',
  start_time timestamptz,
  end_time timestamptz,
  estimated_duration integer DEFAULT 30,
  status text DEFAULT 'pending',
  notes text DEFAULT '',
  tags text[] DEFAULT '{}',
  attachment_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create time_sessions table
CREATE TABLE IF NOT EXISTS time_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  duration integer DEFAULT 0,
  break_duration integer DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_sessions ENABLE ROW LEVEL SECURITY;

-- Tasks policies (public access for demo)
CREATE POLICY "Anyone can view tasks"
  ON tasks FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create tasks"
  ON tasks FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update tasks"
  ON tasks FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete tasks"
  ON tasks FOR DELETE
  TO public
  USING (true);

-- Time sessions policies (public access for demo)
CREATE POLICY "Anyone can view time sessions"
  ON time_sessions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create time sessions"
  ON time_sessions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update time sessions"
  ON time_sessions FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete time sessions"
  ON time_sessions FOR DELETE
  TO public
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_start_time ON tasks(start_time);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_time_sessions_task_id ON time_sessions(task_id);
CREATE INDEX IF NOT EXISTS idx_time_sessions_start_time ON time_sessions(start_time);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tasks updated_at
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();