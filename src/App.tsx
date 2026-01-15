import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card"

import { io } from 'socket.io-client';


const fetchdata = async () => {
  return await fetch(`http://localhost:3000`,
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
  const [items, setItems] = useState([{ id: 0, guichet: 0 }]);

  // const socket = io('http://localhost:3000');
  const speak = (g: number) => {
    // const text = "The number 45 is called to counter 2";
    socket.emit('call-next', { guichet: g, id: (items[items.length - 1]?.id) });

  };

  useEffect(() => {
    socket.on('ticket-called', data => {
      console.log(data)
      if (data.ticketId) {
        setItems(prev => [...prev, { id: data.ticketId, guichet: data.guichet }]);
      }else{
        setItems([]);
      }
    });
    fetchdata()
      .then(data => {
        setItems(data)
        console.log(data)
      })
 return () => {
      socket.off('ticket-called');
    };
  }, [])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center  p-4">
      <Card className="mb-4 min-w-xs " onClick={() => items.length === 0 ? null : speak(1)}>
        <CardContent className="flex flex-col items-center gap-4">
          <CardTitle className="text-2xl font-bold mb-2">Guichet 1</CardTitle>
          <h1 className="text-6xl font-bold">
            {items[items.length - 1]?.id}
          </h1>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
