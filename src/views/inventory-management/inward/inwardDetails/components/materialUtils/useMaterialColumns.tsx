/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react'
import { FaSync } from 'react-icons/fa'

interface props {
    formData: any
    qcReceived: number | undefined
    setQcReceived: (x: number) => void
    qcPass: number | undefined
    setQcPass: (x: number) => void
    locationInput: string
    setLocationInput: (x: string) => void
    getSkuData: any[]
    handleEditSku: (location: string, qc_passed: number, quantity_received: number, qc_failed: number, sku: string) => void
    qualitySentInput: any
}

export const useMaterialColumns = ({
    formData,
    getSkuData,
    handleEditSku,
    locationInput,
    qcPass,
    qcReceived,
    qualitySentInput,
    setLocationInput,
    setQcPass,
    setQcReceived,
}: props) => {
    return useMemo(
        () => [
            { header: 'SKU', accessorKey: 'sku' },
            {
                header: 'QUANTITY SENT',
                accessorKey: 'quantity_sent',
            },
            {
                header: 'QUANTITY RECEIVED',
                accessorKey: 'quantity_received',
                cell: ({ row }: any) => {
                    const value = qcReceived ?? row?.original?.quantity_received
                    return (
                        <div className="flex gap-1 items-center">
                            <input
                                className="w-[60px] "
                                type="number"
                                min={0}
                                value={value}
                                onChange={(e) => setQcReceived(Number(e.target.value))}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'QC PASSED',
                accessorKey: 'qc_passed',
                cell: ({ row }: any) => {
                    const value = qcPass ?? row?.original?.qc_passed
                    return (
                        <div className="flex gap-1 items-center">
                            <input
                                className="w-[60px] "
                                type="number"
                                min={0}
                                value={value}
                                onChange={(e) => setQcPass(Number(e.target.value))}
                            />
                        </div>
                    )
                },
            },

            {
                header: 'QC FAILED',
                accessorKey: 'qc_failed',
                cell: ({ row }: any) => {
                    const received = qcReceived ?? row?.original?.quantity_received ?? 0
                    const passed = qcPass ?? row?.original?.qc_passed ?? 0

                    const qcFail = received - passed
                    return <div>{qcFail}</div>
                },
            },
            {
                header: 'LOCATION',
                accessorKey: 'location',
                cell: ({ row }: any) => {
                    console.log(row?.original?.sku, qualitySentInput)
                    const getSame = getSkuData?.find((item) => item.sku === formData?.sku)
                    let value = locationInput !== '' ? locationInput : formData?.location

                    if (getSame) {
                        value =
                            formData?.location && formData.location !== getSame?.location
                                ? `${getSame?.location}/${formData?.location}`
                                : getSame?.location
                    }
                    return (
                        <div className="flex gap-1 items-center">
                            <input
                                className="w-[100px] "
                                type="text"
                                min={0}
                                value={value}
                                onChange={(e) => setLocationInput(e.target.value)}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }: any) => (
                    <button
                        className="border-none bg-none"
                        onClick={() =>
                            handleEditSku(
                                row?.original?.location,
                                row?.original?.qc_passed,
                                row?.original?.quantity_received,
                                row?.original?.qc_failed,
                                row?.original?.sku,
                            )
                        }
                    >
                        <FaSync className="text-xl text-green-600" />
                    </button>
                ),
            },
        ],
        [formData, qcReceived, qcPass, locationInput],
    )
}
