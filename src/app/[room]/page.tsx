import ChatRoom from '@/components/ChatRoom'

interface RoomPageProps {
  params: {
    room: string
  }
}

export default function RoomPage({ params }: RoomPageProps) {
  return <ChatRoom roomName={params.room} />
}