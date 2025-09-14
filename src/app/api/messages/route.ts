import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const roomName = searchParams.get('room')

  if (!roomName) {
    return NextResponse.json({ error: 'Room name is required' }, { status: 400 })
  }

  try {
    // Get room ID
    const { data: room, error: roomError } = await supabaseAdmin
      .from('rooms')
      .select('id')
      .eq('name', roomName)
      .single()

    if (roomError) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Fetch last 50 messages
    const { data: messages, error: messagesError } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('room_id', room.id)
      .order('created_at', { ascending: true })
      .limit(50)

    if (messagesError) {
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    return NextResponse.json({ messages })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { roomName, nickname, content } = await request.json()

    if (!roomName || !nickname || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Ensure room exists
    const { data: room, error: roomError } = await supabaseAdmin
      .from('rooms')
      .select('id')
      .eq('name', roomName)
      .single()

    if (roomError && roomError.code === 'PGRST116') {
      // Room doesn't exist, create it
      const { data: newRoom, error: insertError } = await supabaseAdmin
        .from('rooms')
        .insert([{ name: roomName }])
        .select('id')
        .single()

      if (insertError) {
        return NextResponse.json({ error: 'Failed to create room' }, { status: 500 })
      }

      // Insert message
      const { data: message, error: messageError } = await supabaseAdmin
        .from('messages')
        .insert([
          {
            room_id: newRoom.id,
            nickname,
            content,
          },
        ])
        .select()
        .single()

      if (messageError) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
      }

      return NextResponse.json({ message })
    } else if (roomError) {
      return NextResponse.json({ error: 'Failed to find room' }, { status: 500 })
    }

    // Insert message
    const { data: message, error: messageError } = await supabaseAdmin
      .from('messages')
      .insert([
        {
          room_id: room.id,
          nickname,
          content,
        },
      ])
      .select()
      .single()

    if (messageError) {
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }

    return NextResponse.json({ message })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}