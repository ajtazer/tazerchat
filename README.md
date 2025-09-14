# TazerChat - Simple Chat Rooms

A Next.js chat application similar to tlk.io, built with Supabase backend and deployed on Vercel.

## Features

- **Dynamic Room Creation**: Any URL path becomes a chat room automatically
- **Real-time Messaging**: Live message broadcasting using Supabase Realtime
- **Persistent Storage**: Messages are stored in Supabase database
- **Random Nicknames**: Auto-generated user nicknames with customization
- **Clean UI**: Modern, responsive design with Tailwind CSS
- **Auto-scroll**: Messages automatically scroll to bottom

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the schema from `supabase-schema.sql`
3. Get your project URL and anon key from Settings > API
4. Get your service role key from Settings > API (for server-side operations)

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Local Development

```bash
npm install
npm run dev
```

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variables in Vercel dashboard
4. Deploy!

## Database Schema

The app uses two main tables:

- **rooms**: Stores chat room information
- **messages**: Stores chat messages with room relationships

## Usage

1. Visit the homepage to join a room or create a random one
2. Any URL path like `/general`, `/work`, `/friends` becomes a chat room
3. Messages are automatically saved and synced across all users
4. Users can customize their nicknames

## API Routes

- `GET /api/messages?room=roomname` - Fetch last 50 messages for a room
- `POST /api/messages` - Send a new message to a room

## Architecture

- `/[room]` - Dynamic route for chat rooms
- `src/components/ChatRoom.tsx` - Main chat component
- `src/lib/supabase.ts` - Supabase client configuration
- `src/app/api/messages/route.ts` - API routes for message operations