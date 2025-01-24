export type markdownPriceTypes = {
    id: number
    product_filter: number
    name: string
    start_date: string // ISO date string
    end_date: string // ISO date string
    discount_type: 'PERCENTOFF' | 'FLATOFF' | 'BOGO' | string // Extendable with other discount types
    offer_value: string // Stored as a string to handle precision
    apply_on: 'MRP' | 'SELLING_PRICE' | string // Extendable with other application types
    status: 'CREATED' | 'ACTIVE' | 'EXPIRED' | 'DELETED' | string // Extendable with other statuses
    error_barcodes: Record<string, any> // Assuming this could contain dynamic key-value pairs
    products_count: number
    create_date: string // ISO date string
    update_date: string // ISO date string
}

export const FormArray = [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter Name' },
    { name: 'offer_value', type: 'number', label: 'Offer Value', placeholder: 'Enter Offer Values' },
]
