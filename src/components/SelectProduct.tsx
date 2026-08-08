import type { InspectedData } from "../types";

type SelectProductProps = {
    inspectedData: InspectedData[],
    isSelected: string,
    setIsSelected: React.Dispatch<React.SetStateAction<string>>
}

export default function SelectProduct({ inspectedData, isSelected, setIsSelected }: SelectProductProps) {


    return (
        <div className="col-span-2  flex flex-col justify-end gap-2 ">
            {
                inspectedData.map((data) => (
                    <div className={`rounded-2xl overflow-hidden relative cursor-pointer text-white p-2 ${isSelected == data.productId && 'border border-blue-400'} ${data.defectDetails ? 'bg-[#ff00003c]' : 'bg-[rgba(0,63,4,0.48)]'} `} onClick={() => setIsSelected(data.productId)} >
                        <span className={`absolute top-0 left-0 p-1 h-full ${data.defectDetails ? 'bg-red-500' : 'bg-green-500'} rounded`}></span>
                        <div className="flex ml-2  justify-between  gap-2">
                            <span>{new Date(data.inspectedAt).toLocaleTimeString()}</span>
                            <span className={`text-${data.defectDetails ? 'red' : 'green'}-500`}>{data.defectDetails ? 'FAIL' : 'PASS'}</span>
                            <span>{data.confidence}%</span>
                        </div>
                    </div>
                )
                )
            }
        </div>
    )
}
