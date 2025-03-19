import { useMemo } from 'react'

export const RemitanceColumns = () => {
    return useMemo(
        () => [
            { header: 'Invoice Id', accessorKey: 'invoice_id' },
            { header: 'SKU', accessorKey: 'sku' },
            { header: 'Creation Date', accessorKey: 'create_date' },
            { header: 'Completed Date', accessorKey: 'complete_date' },
            { header: 'Product Name', accessorKey: 'name' },
            { header: 'Brand', accessorKey: 'brand_name' },
            { header: 'Quantity', accessorKey: 'quantity' },
            { header: 'MRP', accessorKey: 'mrp' },
            { header: 'Selling Price', accessorKey: 'selling_price' },
            { header: 'Size', accessorKey: 'size' },
        ],
        [],
    )
}
