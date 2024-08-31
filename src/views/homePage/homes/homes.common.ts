export type SalesData = {
    received: {
        count: number
        total_amount: number
    }
    completed: {
        count: number
        total_amount: number
    }
    returned: {
        count: number
        total_amount: number
    }
    open: number
    brand_wise_sale: Record<string, number>
}

interface Profile {
    first_name: string
    last_name: string
    email: string
    mobile: number
    country_code: string
    dob: string
    gender: string | null
    image: string
    device_id: string
}

interface Orders {
    count: number
    total_amount: number
}

export interface CUSTOMERANALYTICS {
    orders: Orders
    cart: any
    profile: Profile
}
