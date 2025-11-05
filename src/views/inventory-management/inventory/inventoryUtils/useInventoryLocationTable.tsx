/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { ColumnDef } from '@tanstack/react-table'
import { notification } from 'antd'
import React, { useMemo, useState } from 'react'
import { FaSync } from 'react-icons/fa'

interface props {
    handleOpenModal: (img: string) => void
    locationInputRef: React.MutableRefObject<{ [key: number]: HTMLInputElement | null }>
    qtyInputRef: React.MutableRefObject<{ [key: number]: HTMLInputElement | null }>
    storeCode: string
    setLocationTransferModal: React.Dispatch<React.SetStateAction<boolean>>
}

export const useInventoryLocationColumns = ({
    handleOpenModal,
    locationInputRef,
    qtyInputRef,
    storeCode,
    setLocationTransferModal,
}: props) => {
    const [updatedQuantities, setUpdatedQuantities] = useState<{ [key: number]: number }>({})
    const [updatedLocation, setUpdatedLocation] = useState<{ [key: number]: string }>({})

    console.log('STORE CODE', storeCode)

    const handleQuantityChange = (id: number, newQuantity: number) => {
        setUpdatedQuantities((prevQuantity) => {
            if (prevQuantity[id] === newQuantity) return prevQuantity
            return { ...prevQuantity, [id]: newQuantity }
        })
        setTimeout(() => {
            qtyInputRef.current[id]?.focus()
        }, 0)
    }

    const handleLocationChange = (id: number, newLocation: string) => {
        setUpdatedLocation((prevLocations) => {
            if (prevLocations[id] === newLocation) return prevLocations
            return { ...prevLocations, [id]: newLocation }
        })
        setTimeout(() => {
            locationInputRef.current[id]?.focus()
        }, 0)
    }

    const handleUpdate = async (data: any) => {
        const location = updatedLocation[data?.id] ? updatedLocation[data?.id] : data?.location ? data?.location : ''
        const quantity =
            updatedQuantities[data?.id] != null ? Number(updatedQuantities[data?.id]) : data?.quantity ? Number(data?.quantity) : ''

        console.log('DATA', storeCode)

        try {
            const body = {
                skid: data?.skid,
                store_code: storeCode,
                location: location,
                quantity: quantity,
                rack_number: data?.rack_number ? data?.rack_number : '',
                action: 'replace',
            }

            console.log('BODY', body)

            const response = await axioisInstance.post(`/inventory-location`, body)
            notification.success({
                message: 'SUCCESS',
                description: response?.data?.message || 'UPDATE SUCCESS',
            })
        } catch (error) {
            notification.error({ message: 'Field not set' })
            console.error(error)
        }
    }

    return useMemo<ColumnDef<any>[]>(
        () => [
            {
                header: 'Update Row',
                accessorKey: 'id',
                cell: ({ row }) => (
                    <button
                        onClick={() => handleUpdate(row?.original)}
                        className="px-4 py-2 bg-none text-2xl rounded font-bold text-green-600"
                    >
                        <FaSync />
                    </button>
                ),
            },
            // {
            //     header: 'Location Transfer',
            //     accessorKey: 'sku',
            //     cell: ({ row }) => {
            //         return (
            //             <div>
            //                 <Button variant="twoTone" size="sm" onClick={() => setLocationTransferModal(true)}>
            //                     Transfer
            //                 </Button>
            //             </div>
            //         )
            //     },
            // },
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: (info) => info.getValue(),
            },
            {
                header: 'SKID',
                accessorKey: 'skid',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Brand',
                accessorKey: 'brand',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Rack',
                accessorKey: 'rack_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ getValue, row }: any) => (
                    <img
                        src={getValue().split(',')[0]}
                        alt="Image"
                        className="w-24 h-20 object-cover cursor-pointer"
                        onClick={() => handleOpenModal(row.original.image)}
                    />
                ),
            },
            {
                header: 'Location',
                accessorKey: 'location',
                cell: ({ row }) => {
                    const stockId = row.original.id
                    return (
                        <>
                            <input
                                type="text"
                                className="rounded-xl w-[150px]"
                                value={updatedLocation[stockId] ?? row.original.location}
                                onChange={(e) => handleLocationChange(stockId, e.target.value)}
                                ref={(el) => (locationInputRef.current[stockId] = el)}
                            />
                        </>
                    )
                },
            },

            {
                header: 'Stock',
                accessorKey: 'quantity',
                cell: ({ row }) => {
                    const stockId = row.original.id
                    return (
                        <>
                            <input
                                className="w-[70px] rounded-xl"
                                type="number"
                                value={updatedQuantities[stockId] ?? row.original.quantity}
                                onChange={(e) => handleQuantityChange(stockId, Number(e.target.value))}
                                ref={(el) => (qtyInputRef.current[stockId] = el)}
                            />
                        </>
                    )
                },
            },
        ],
        [updatedQuantities, updatedLocation],
    )
}
