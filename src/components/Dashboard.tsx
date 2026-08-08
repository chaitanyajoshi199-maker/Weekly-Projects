import { useState, useEffect } from 'react'
import type { InspectedData } from '../types'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import SelectProduct from './SelectProduct'
// import { prepareInspectedData } from '../utils/prepareInspectedData'
// import { prepareInspectedData } from '../utils/prepareInspectedData'


export default function Dashboard() {

  const [inspectedData, setInspectedData] = useState<InspectedData[] | null>(null)
  const [isSelected, setIsSelected] = useState<string>('1')
  let key: number = 0

  useEffect(() => {
    fetch('http://localhost:4000/inspectionData')
      .then((res) => res.json())
      .then((data) => setInspectedData(data))
  }, [])


  inspectedData && console.log(inspectedData)


  return (
    <div className='bg-[#0c1622]'>
      {inspectedData ?
        inspectedData.map((data) => (

          isSelected === data.productId &&
          <div className='grid sm:grid-cols-2 min-h-[390px] '>
            <LeftPanel key={data.productId} data={data} />

            <RightPanel key={data.productId} data={data} />
          </div>
        ))
        :
        <p>Loading...</p>
      }
      {inspectedData &&
        <div className='p-5 flex flex-col gap-3'>
          <span className=' col-span-2 text-white flex justify-between'>Recent Result <span>Last 5</span></span>
          <SelectProduct key={key + 1} inspectedData={inspectedData} isSelected={isSelected} setIsSelected={setIsSelected} />
        </div>

      }
      </div>
  )
}
