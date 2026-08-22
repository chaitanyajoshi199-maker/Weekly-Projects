import type { ConnectionStatus } from '../types'

interface StatusBarProps {
  connectionStatus: ConnectionStatus
}

export default function StatusBar({ connectionStatus }: StatusBarProps) {
  return (
    <div className="flex justify-between items-center bg-[#111827] px-5 py-3 border-b border-gray-800 text-sm">
      <span className="text-gray-300 font-semibold tracking-wide"></span>
      <div className="flex items-center gap-3 w-full justify-between">
        <span className="text-xs text-gray-400">WebSocket Status:</span>
        <span className={`flex items-center gap-2 font-semibold px-3 py-1 rounded-full text-xs border transition-all duration-300 ${
          connectionStatus === 'connected' ? 'bg-green-950/80 text-green-400 border-green-600' :
          connectionStatus === 'connecting' ? 'bg-yellow-950/80 text-yellow-400 border-yellow-600' :
          connectionStatus === 'stale' ? 'bg-orange-950/80 text-orange-400 border-orange-600' :
          'bg-red-950/80 text-red-600 border-red-600'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
            connectionStatus === 'connecting' ? 'bg-yellow-500 animate-ping' :
            connectionStatus === 'stale' ? 'bg-orange-500' : 'bg-red-500'
          }`}></span>
          {connectionStatus.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
