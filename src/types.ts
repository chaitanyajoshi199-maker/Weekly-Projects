// types for data 
export interface statCardDataTy {
    inspected: number,
    pass: number,
}

export interface InspectedData {
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
    inspectedAt: number
}




// common types for prop 
export interface StatItem {
    value: number | string,
    label: string,
    color: string
}


