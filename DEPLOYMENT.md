# Deployment Guide

## Quick Start

1. **Set up Supabase**:
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Run the SQL from `supabase-schema.sql` in the SQL Editor
   - Copy your project URL and keys

2. **Set up Vercel**:
   - Push this code to GitHub
   - Connect GitHub repo to Vercel
   - Add environment variables in Vercel dashboard:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Deploy!

3. **Test your deployment**:
   - Visit your Vercel URL
   - Try creating rooms like `/test`, `/general`, etc.
   - Open multiple browser tabs to test real-time messaging

## Environment Variables

Create `.env.local` for local development:

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

## Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- See supabase-schema.sql for the complete schema
```

## Features Included

✅ Dynamic room creation via URL paths  
✅ Real-time messaging with Supabase Realtime  
✅ Persistent message storage  
✅ Random nickname generation  
✅ Clean, responsive UI with Tailwind  
✅ Auto-scroll to latest messages  
✅ Connection status indicator  
✅ API routes for SSR fallback  

## Customization

- Modify `src/components/ChatRoom.tsx` for UI changes
- Update `src/lib/supabase.ts` for database schema changes
- Customize styling in Tailwind classes
- Add features like user authentication, message reactions, etc.