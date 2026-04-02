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
    delivery_type: {
        EXPRESS: number
        STANDARD: number
        TRY_AND_BUY: number
        EXCHANGE: number
    }
    cancelled: {
        count: number
        total_amount: number
    }
    declined: {
        count: number
        total_amount: number
    }
    device_type: { ANDROID: number; WEB: number; IOS: number }

    ANDROID: 1
    WEB: 2
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

export type OrderMapType = {
    amount: string
    distance: number
    invoice_id: string
    latitude: number
    longitude: number
    status: string
    create_date: string
    logistic_partner: string | null
    logistic_details: {
        state: string
        distance: string
        partner: number
        runner_name: string
        runner_phone_number: string
        tracking_url: string
        price: string | null
        estimate_delivery_time: string | null
        awb_code: string
        eta_dropoff_time: string | null
        actual_pickup_time: string | null
        actual_drop_time: string | null
        is_delayed: boolean | null
        attempt_number: number
    }
}
