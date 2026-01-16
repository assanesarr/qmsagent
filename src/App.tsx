import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card"

import { io } from 'socket.io-client';

type CALLED = {
  id: number,
  status: string,
  guichet: number
  totalWaiting: number
}


const fetchdata = async () => {
  return await fetch(`http://localhost:3000/next`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  ).then(res => {
    if (res.ok) {
      return res.json()
    }
  })
}

export const socket = io(import.meta.env.VITE_API_URL);

function App() {
  const [called, setCalled] = useState<CALLED>()

  // const socket = io('http://localhost:3000');
  const speak = (g: number) => {
    socket.emit('call-next', { ...called, guichet: g });
  };

  useEffect(() => {
    socket.on('ticket-next', data => {
      console.log('ticket-next', data)
      setCalled(data)
    });
    fetchdata()
      .then(data => {
        setCalled(data)
        console.log(data)
      })
    return () => {
      socket.off('ticket-next');
    };
  }, [])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center  p-4">
      <Card className="mb-4 min-w-xs " onClick={() => speak(1)}>
        <CardContent className="flex flex-col items-center gap-4">
          <CardTitle className="text-2xl font-bold mb-2">Guichet 1</CardTitle>
          <h1 className="text-6xl font-bold">
            {called && called?.id}
          </h1>

          <p className='text-xs '>
            Client En attente : {called && called?.totalWaiting}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
