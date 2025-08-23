export const InventoryFilters = [
    { label: 'SKU', value: 'sku' },
    { label: 'SKID', value: 'skid' },
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
