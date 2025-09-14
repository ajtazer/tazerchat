'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase, Message } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

interface ChatRoomProps {
  roomName: string
}

export default function ChatRoom({ roomName }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [nickname, setNickname] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  // Generate random nickname on first load
  useEffect(() => {
    const savedNickname = localStorage.getItem('nickname')
    if (savedNickname) {
      setNickname(savedNickname)
    } else {
      const randomNickname = `User${Math.floor(Math.random() * 10000)}`
      setNickname(randomNickname)
      localStorage.setItem('nickname', randomNickname)
    }
  }, [])

  // Initialize room and fetch messages
  useEffect(() => {
    const initializeRoom = async () => {
      try {
        // Ensure room exists
        const { data: room, error: roomError } = await supabase
          .from('rooms')
          .select('id')
          .eq('name', roomName)
          .single()

        if (roomError && roomError.code === 'PGRST116') {
          // Room doesn't exist, create it
          const { error: insertError } = await supabase
            .from('rooms')
            .insert([{ name: roomName }])
          
          if (insertError) {
            console.error('Error creating room:', insertError)
            return
          }
        } else if (roomError) {
          console.error('Error checking room:', roomError)
          return
        }

        // Fetch last 50 messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('room_id', room?.id || (await supabase.from('rooms').select('id').eq('name', roomName).single()).data?.id)
          .order('created_at', { ascending: true })
          .limit(50)

        if (messagesError) {
          console.error('Error fetching messages:', messagesError)
        } else {
          setMessages(messagesData || [])
        }

        // Set up realtime subscription
        const roomId = room?.id || (await supabase.from('rooms').select('id').eq('name', roomName).single()).data?.id
        
        if (roomId) {
          const channel = supabase
            .channel(`room:${roomId}`)
            .on(
              'postgres_changes',
              {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `room_id=eq.${roomId}`,
              },
              (payload) => {
                setMessages(prev => [...prev, payload.new as Message])
              }
            )
            .subscribe()

          channelRef.current = channel
          setIsConnected(true)
        }
      } catch (error) {
        console.error('Error initializing room:', error)
      }
    }

    initializeRoom()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [roomName])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !nickname.trim()) return

    try {
      // Get room ID
      const { data: room } = await supabase
        .from('rooms')
        .select('id')
        .eq('name', roomName)
        .single()

      if (!room) return

      // Insert message
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            room_id: room.id,
            nickname: nickname.trim(),
            content: newMessage.trim(),
          },
        ])

      if (error) {
        console.error('Error sending message:', error)
      } else {
        setNewMessage('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Room: {roomName}
          </h1>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <div className="mt-2">
          <input
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value)
              localStorage.setItem('nickname', e.target.value)
            }}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your nickname"
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900 text-sm">
                {message.nickname}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <p className="text-gray-800">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}