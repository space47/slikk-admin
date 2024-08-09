type OpeningHour = {
    weekday: number
    from_hour: string
    to_hour: string
}
type StoreTypes = {
    company: number | null
    code: string
    name: string
    description: string
    area: string
    city: string
    state: string
    pincode: number | null
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
}

export default StoreTypes
