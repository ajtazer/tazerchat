'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [roomName, setRoomName] = useState('')
  const router = useRouter()

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomName.trim()) {
      router.push(`/${encodeURIComponent(roomName.trim())}`)
    }
  }

  const handleRandomRoom = () => {
    const randomRoom = `room${Math.floor(Math.random() * 10000)}`
    router.push(`/${randomRoom}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TazerChat
          </h1>
          <p className="text-gray-600">
            Simple, instant chat rooms. Just like tlk.io!
          </p>
        </div>

        <form onSubmit={handleJoinRoom} className="space-y-4">
          <div>
            <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-2">
              Enter room name
            </label>
            <input
              id="roomName"
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g., myroom, general, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Join Room
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-3">or</p>
          <button
            onClick={handleRandomRoom}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Join Random Room
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Any URL path becomes a chat room automatically
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Try: /general, /work, /friends, etc.
          </p>
        </div>
      </div>
    </div>
  )
}
