import type { WebsocketData, InspectedData } from "../types";

export default function SelectProduct({ inspectedData }: { inspectedData: WebsocketData[] }) {
    return (
        <div className="col-span-2 flex flex-col justify-end gap-2">
            {inspectedData.map((data, index) => {
                if (data.type === 'heartbeat') return null;
                const item = data as InspectedData;
                const isFail = Boolean(item.defectDetails);

                return (
                    <div
                        key={item.productId ? `${item.productId}-${item.inspectedAt}` : index}
                        className={`rounded-xl overflow-hidden relative text-white p-2.5 ${
                            isFail ? 'bg-red-950/70' : 'bg-green-950/80'
                        } border border-gray-800`}
                    >
                        <span className={`absolute top-0 left-0 w-1.5 h-full ${isFail ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        <div className="flex ml-2 justify-between items-center text-sm font-medium gap-3">
                            <span className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">ID #{item.productId}</span>
                                <span className="text-xs text-gray-500">|</span>
                                <span className="text-gray-300">{item.inspectedAt ? new Date(item.inspectedAt).toLocaleTimeString() : 'N/A'}</span>
                            </span>

                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                    isFail ? 'bg-red-900/80 text-red-400 border border-red-700' : 'bg-green-900/80 text-green-400 border border-green-700'
                                }`}>
                                    {isFail ? 'FAIL' : 'PASS'}
                                </span>
                                <span className="text-xs text-gray-300 w-12 text-right">{item.confidence}%</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
