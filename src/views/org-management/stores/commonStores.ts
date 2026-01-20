type OpeningHour = {
    weekday: number
    from_hour: string
    to_hour: string
}
export type StoreTypes = {
    company: number | null
    code: string
    name: string
    description: string
    area: string
    city: string
    state: string
    pincode: number | string | null
    latitude: number | null
    longitude: number | null
    contactNumber: string
    poc: string
    poc_designation: string
    type: string
    return_area: string
    return_city: string
    return_state: string
    return_pincode: string
    gstin: string
    instruction: string
    location_url: string
    is_fulfillment_center: boolean
    image: string
    opening_hours: OpeningHour[]
    images_array: []
    is_volumetric_store?: boolean
}

export type STORETABLE = {
    id: number
    image: string
    company: number
    code: string
    name: string
    is_fulfillment_center: boolean
    openingHours: string[]
    description: string
    area: string
    city: string
    state: string
    pincode: string
    rating: number
    latitude: number
    longitude: number
    contactNumber: string
    alternate_contact_number: string
    poc: string
    poc_designation: string
    type: string
    return_area: string
    return_city: string
    return_state: string
    return_pincode: string
    gstin: string
    instruction: string
    is_active: boolean
    create_date: string
    update_date: string
    location_url: string
}

export const StoreOption = [
    { label: 'Dark Store', value: 'darkstore' },
    { label: 'Mini Store', value: 'ministore' },
    { label: 'Local Hub', value: 'localhub' },
    { label: 'Mother Hub', value: 'motherhub' },
]

export const StoreStatusForAvailability = [
    { label: 'OPEN', value: 'open' },
    { label: 'CLOSE', value: 'close' },
]
