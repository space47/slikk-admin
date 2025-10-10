export const InventoryFilters = [
    { label: 'SKU', value: 'sku' },
    { label: 'LOCATION', value: 'location' },
    { label: 'SKID', value: 'skid' },
    { label: 'Barcode', value: 'barcode' },
]

export type InventoryType = {
    id: number
    sku: string
    skid: string
    location: string
    rack_number: string
    quantity: number
    image: string
    brand: string
}

export type InventoryCatalog = {
    brand: number[]
    division: string
    category: string
    subCategory: string
}
