import { ImCross } from "react-icons/im";
import { SiTicktick } from "react-icons/si";
import type { InspectedData } from "../types"

export default function RightPanel({ data }: { data: InspectedData }) {
   console.log(data.productId)
  return (

    <div className=" flex flex-col gap-4 p-5  text-gray-400 shadow-md">
      {data.defectDetails
        ?
        <div>
          <div className="flex items-center gap-5">
            <span className="bg-red-900/40 p-3.5 rounded-xl border border-red-600 flex items-center justify-center">
              <ImCross className="text-red-500 text-lg" />
            </span>
            <div className="flex flex-col">
              <span className="text-red-500 text-xl font-bold">
                FAIL
              </span>
              <span className="text-sm text-gray-400">
                Surface detected defect - Reject triggered
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-1.5 border-t border-gray-800 pt-4">
            <span className="text-white font-semibold text-sm tracking-wider">DEFECT DETAILS</span>
            <span className="flex justify-between text-sm">Type <span className="text-red-500 font-medium">{data.defectDetails.type}</span></span>
            <span className="flex justify-between text-sm">Location(x,y) <span className="text-sky-400 font-medium">{data.defectDetails.location.x},{data.defectDetails.location.y} px</span></span>
            <span className="flex justify-between text-sm">Size <span className="text-white font-medium">{data.defectDetails.size.width}×{data.defectDetails.size.height} px</span></span>
            <span className="flex justify-between text-sm">Severity <span className="text-red-500 font-medium">{data.defectDetails.severity}</span></span>
          </div>
        </div>
        :
        <div>
          <div className="flex items-center gap-5">
            <span className="bg-green-900/40 p-3.5 rounded-xl border border-green-600 flex items-center justify-center">
              <SiTicktick className="text-green-500 text-lg" />
            </span>
            <div className="flex flex-col">
              <span className="text-green-500 text-xl font-bold">
                PASS
              </span>
              <span className="text-sm text-gray-400">
                No Defect
              </span>
            </div>
          </div>
        </div>
      }

      <div className="mt-5 flex flex-col gap-1.5 border-t border-gray-800 pt-4">
        <span className="text-white font-semibold text-sm tracking-wider">OTHER DETAILS</span>
        <span className="flex justify-between text-sm">Confidence <span className="text-white font-medium">{data.confidence}%</span></span>
        <div className="bg-[#11345e9a] p-0.5 rounded w-full overflow-hidden"><div className={` ${data.defectDetails ? 'bg-red-500' : 'bg-green-500'} p-0.5 rounded`} style={{ width: `${data.confidence}%` }}></div></div>
        <span className="flex justify-between text-sm">Recipe <span className="text-white font-medium">Pharma V2</span></span>
      </div>
    </div>
  )
}

