import Header from "./components/TopSection"
import StatSection from "./components/StatSection"
import Dashboard from './components/Dashboard'
import type { statCardDataTy } from "./types"
import { useState } from "react"

export default function App() {
  const [statData,setStatData]=useState<statCardDataTy |null>(null)
  return (
    <div>
      <Header />
      <StatSection statData={statData}/>
      <Dashboard setStatData={setStatData}/>
    </div>
  )
}
