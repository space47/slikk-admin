/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'

export const useMaterialFailedColumns = () => {
    return useMemo(
        () => [
            { header: 'SKU', accessorKey: 'sku' },
            {
                header: 'quantity',
                accessorKey: 'quantity_sent',
            },
            {
                header: 'Location',
                accessorKey: 'location',
            },
        ],
        [],
    )
}
