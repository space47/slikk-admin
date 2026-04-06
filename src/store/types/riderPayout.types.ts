export interface RiderPayoutResponse {
    status: string
    data: {
        count: number
        next: boolean
        results: RiderPayout[]
    }
}

export interface CommercialDetails {
    currency: string
    penalties: Record<string, string>
    incentives: Record<string, string>
    base_payout: number
    payout_model: string
}

export interface RiderPayout {
    id: number
    name: string
    description: string
    commercial_details: CommercialDetails
    create_date: string
    update_date: string
    created_by: string
}

export interface PayoutCommercialRequestType {
    agency: number
    store: number
    payout_model: number
    management_fees: number
}

export interface PayoutCommercialResponse {
    id?: string
    agency: string
    store: string
    start_date: string
    end_date: string
    commercials: RiderPayout
}

export interface PayoutCommercialGetResponse {
    status: string
    data: {
        count: number
        next: boolean
        results: PayoutCommercialResponse[]
    }
}
