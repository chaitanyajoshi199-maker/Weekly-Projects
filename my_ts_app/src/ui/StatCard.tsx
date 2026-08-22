import type { StatItem } from "../types"


export default function StatCard({value,label,color}:StatItem) {

    

    return (
        <div className='flex flex-col items-center'>
            <span className={`text-2xl sm:text-3xl ${color}`}> {value}</span> 
            <span className="text-gray-400 uppercase text-center ">
                {label}
            </span>
        </div>
    )
}
