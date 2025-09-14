-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write access
CREATE POLICY "Allow public read access on rooms" ON rooms
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on rooms" ON rooms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on messages" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Enable Realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;