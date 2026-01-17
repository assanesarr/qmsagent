import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card"

import { io } from 'socket.io-client';
import { useLocalStorage } from './hook/local_storage';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

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
  const [config, setConfig] = useLocalStorage('config', { guichet: 0 });
  const [value, setValue] = useState<string>('');

  // const socket = io('http://localhost:3000');
  const speak = (g: number) => {
    socket.emit('call-next', { ...called, guichet: g });
  };

  useEffect(() => {
    socket.on('ticket-next', data => {
      setCalled(data)
    });
    fetchdata()
      .then(data => {
        setCalled(data)
      })

    return () => {
      socket.off('ticket-next');
    };
  }, [])

  if (!config || config.guichet === 0) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center  p-4">
        <Card className="mb-4 min-w-xs ">
          <CardContent className="flex flex-col items-center gap-4">
            <CardTitle className="text-2xl font-bold mb-2">Configuration manquante</CardTitle>
            <p className='text-sm '>Veuillez configurer l'application avant de l'utiliser.</p>

            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>
                  Guichet Numero
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput onChange={(e) => {
                setValue(e.target.value)
              }} />

              <InputGroupButton onClick={() => {
                setConfig({ guichet: parseInt(value) })
              }}>
                Sauvegarder
              </InputGroupButton>
            </InputGroup>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center  p-4">
      <Card className="mb-4 min-w-xs " onClick={() => speak(config?.guichet)}>
        <CardContent className="flex flex-col items-center gap-4">
          <CardTitle className="text-2xl font-bold mb-2">Guichet {config?.guichet}  </CardTitle>
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
