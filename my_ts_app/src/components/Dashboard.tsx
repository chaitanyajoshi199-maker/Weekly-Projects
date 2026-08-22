import { useState, useEffect, useRef } from 'react'
import type { InspectedData, ConnectionStatus, WebsocketData } from '../types'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import SelectProduct from './SelectProduct'
import StatusBar from './StatusBar'
import type { statCardDataTy } from '../types'

export default function Dashboard({ setStatData }: {
  setStatData: React.Dispatch<React.SetStateAction<statCardDataTy | null>>
}) {

  const [inspectedData, setInspectedData] = useState<WebsocketData[] | null>(null)
  const [currentProduct, setCurrentProduct] = useState<InspectedData | WebsocketData | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const lastMessageTime = useRef<number | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')

  const reconnectDelay = useRef<number>(1000)
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { //heart beat
    const interval = setInterval(() => {
      if (lastMessageTime.current) {
        const timeDiff = Date.now() - lastMessageTime.current
        if (timeDiff > 10000) {
          setConnectionStatus('stale')
        }
      }
    }, 3000)
    return () => clearInterval(interval);
  }, [])

  const shouldReconnect = useRef(true)
  const connectWebsocket = () => {
    if (wsRef.current) {
      wsRef.current.onclose = null
      wsRef.current.close()
    }
    const ws = new WebSocket('ws://localhost:8000/ws')
    wsRef.current = ws
    setConnectionStatus('connecting')

    ws.onopen = () => {
      setConnectionStatus('connected')
      console.log('opened from dashboard')
      reconnectDelay.current = 1000
      console.log(reconnectDelay.current)
    }

    ws.onmessage = (event) => { //keep running untill message comes if not any message just closed
      try {
        const data: WebsocketData = JSON.parse(event.data)
        lastMessageTime.current = Date.now()
        setConnectionStatus('connected')

        if (data.type === 'result') {
          setStatData(data.stats)
        }

        if (data.type === 'heartbeat') {
          return;
        }
        // console.log(data)

        setInspectedData((prev => prev ? [data, ...prev].slice(0, 50) : [data]))
        setCurrentProduct(data)
        inspectedData && console.log("djjb", data)
        console.log("hi", data)

      } catch (error) {
        console.log(error)
      }
    }

    ws.onclose = () => {
      if (!shouldReconnect.current) return
      setConnectionStatus('disconnected')
      console.log("Retrying to connect in ", reconnectDelay.current / 1000, ' seconds')


      reconnectTimeout.current = setTimeout(connectWebsocket, reconnectDelay.current)
      reconnectDelay.current = Math.min((reconnectDelay.current * 2), 30000)

      console.log('closed from dashboard')
    }

    ws.onerror = () => {
      setConnectionStatus('disconnected')
      console.log('error from dashboard')
    }

    // return () => ws.close()

    // will this automaticlly closes if thre is no any messg came form that ws://localhost:8000/ws enspoint 
  }

  useEffect(() => {
    shouldReconnect.current = true
    connectWebsocket()
    return () => {
      shouldReconnect.current = false
      wsRef.current?.close()
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current)
      }
    }
  }, [])

  return (
    <div className='bg-[#00142f] text-white'>

      <StatusBar connectionStatus={connectionStatus} />

      {currentProduct && currentProduct.type === 'result' ? (
        <div className='grid sm:grid-cols-2 min-h-[390px] '>
          <LeftPanel data={currentProduct as InspectedData} />
          <RightPanel data={currentProduct as InspectedData} />
        </div>
      ) : (
        <div className="p-10 text-center flex flex-col items-center justify-center min-h-[300px] text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
          <p className="text-lg font-medium text-gray-300">Waiting for live inspection data...</p>
          <p className="text-sm text-gray-500 mt-1">Status: <span className="uppercase font-semibold">{connectionStatus}</span></p>
        </div>
      )}

      {inspectedData && (
        <div className='p-5 flex flex-col gap-3 bg-[#00132b]'>
          <span className='col-span-2 text-white flex justify-between font-semibold'>
            Recent Results <span>Last {inspectedData.length}</span>
          </span>
          <SelectProduct inspectedData={inspectedData} />
        </div>
      )}
    </div>
  )
}