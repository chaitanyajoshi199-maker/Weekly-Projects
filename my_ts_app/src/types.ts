export type ConnectionStatus = "connecting" | "connected" | "stale" | "disconnected"

// types for data 
export interface statCardDataTy {
    inspected: number,
    fail: number,
}

export interface InspectedData {
    type: string,
    productId: string,
    batchNo: string,
    imageUrl: string,
    defectDetails: null | {
        type: string,
        location: {
            x: number,
            y: number
        },
        size: {
            width: number,
            height: number
        },
        severity: string,
        threshold: number
    },
    confidence: number,
    inspectedAt: number,
    stats: {
        inspected: number,
        fail: number
    }
}

interface Heartbeat {
    type: 'heartbeat',
    ts: number
}

export type WebsocketData = InspectedData | Heartbeat




// common types for prop 
export interface StatItem {
    value: number | string,
    label: string,
    color: string
}


