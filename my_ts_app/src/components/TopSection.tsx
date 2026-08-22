import { useState, useEffect } from "react"

export default function TopSection() {
  const [time, setTime] = useState('')
  const [isRunning, setIsRunning] = useState<boolean>(false)

  const updateRun = (): void => {
    setIsRunning(prev => !prev)
  }

  useEffect(() => {
    setTime(new Date().toLocaleTimeString())
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-[#00142e] p-1">
      <div className="m-3 flex flex-col sm:flex-row gap-y-3  justify-between items-center header-text">
        <span className="flex items-center w-full justify-between  sm:justify-start gap-3">
          <img className="w-25 rounded-xl" src="./pixtron-logo.svg" alt="" />
          <span className="text-yellow-500 sm:text-md text-[15px] font-medium  ">
            Line- Pharma Bottle Inspection
          </span>
        </span>
        <div className="flex items-center w-full justify-between sm:justify-end  ">
          <div className="flex gap-3 ">
            <button
              disabled={isRunning}
              onClick={updateRun}
              className={`px-3 py-1 rounded font-medium text-white transition-all duration-300 ease-in-out border border-blue-400 ${isRunning
                ? "bg-gray-700 opacity-40 cursor-not-allowed border-gray-600"
                : "bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 cursor-pointer"
                }`}
            >
              RUN
            </button>

            <div
              className={`mr-2 flex items-center gap-3 transition-all duration-300 ease-in-out overflow-hidden ${isRunning
                ? "max-w-[300px] opacity-100 translate-x-0"
                : "max-w-0 opacity-0 -translate-x-3 pointer-events-none"
                }`}
            >


              <button
                onClick={updateRun}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/30 active:scale-95 rounded text-white text-sm font-medium border border-red-400 cursor-pointer transition-all duration-300 whitespace-nowrap"
              >
                STOP RUN
              </button>

              <span className="p-2  bg-green-600/90 rounded-full text-white text-xs font-semibold tracking-wide border border-green-400 animate-pulse whitespace-nowrap">
              </span>
            </div>
          </div>
            <span className="text-gray-300 text-sm ml-2 whitespace-nowrap">{time}</span>
        </div>
      </div>
    </div>
  )
}

