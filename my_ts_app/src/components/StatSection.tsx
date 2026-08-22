import { useEffect, useState } from 'react'
import StatCard from '../ui/StatCard'
import { prepareStatData } from "../utils/prepareStatData"
import type { statCardDataTy, StatItem } from '../types'


export default function StatSection({statData}:{
    statData:statCardDataTy|null
}) {

    const [data, setData] = useState<StatItem[] | null>(null)

    useEffect(() => {
        if(statData){
            setData(prepareStatData(statData))
        }
    }, [statData])




    return (
        <div className="grid grid-cols-3 gap-4  sm:grid-cols-5 px-4 pt-1 pb-3 text-sm text-white bg-[#000001]">
            {data?.map(({ value, label, color }: StatItem, i) => (
                <StatCard value={value} label={label} color={color} key={i} />
            ))}
        </div>
    )
}
