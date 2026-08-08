import type { statCardDataTy, StatItem } from "../types";

export const prepareStatData = (({ inspected, pass }: statCardDataTy): StatItem[] => {

    const fail: number = inspected > 0 ? (inspected - pass) : 0
    const rejectionRate = `${inspected > 0 ? ((fail / inspected) * 100).toFixed(2) : 0}%`
    const aveargeConfidance = `${inspected > 0 ? ((pass / inspected) * 100).toFixed(2) : 0}%`


    return (
        [
            {
                value: inspected,
                label: "Inspected",
                color: "text-white"
            },
            {
                value: pass,
                label: "Pass",
                color: "text-green-500"
            },
            {
                value: fail,
                label: "Fail",
                color: "text-red-500"
            },
            {
                value: rejectionRate,
                label: "Rejection Rate",
                color: "text-red-500"
            },
            {
                value: aveargeConfidance,
                label: "Average Confidence",
                color: "text-green-500"
            }

        ]
    )
})