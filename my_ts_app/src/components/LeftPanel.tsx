import type { InspectedData } from "../types";

export default function LeftPanel({ data }: { data: InspectedData }) {
  console.log(data.productId)
  return (
    <div className=" p-4  flex justify-center items-center bg-[#111827]">
      <img className="w-[250px] sm:w-[300px] rounded-2xl" src={data.imageUrl} alt="" />
    </div>
  )
}
