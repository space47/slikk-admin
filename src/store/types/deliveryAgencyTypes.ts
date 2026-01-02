export interface DeliveryAgency {
    id: number
    name?: string
    delivery_type?: 'EXPRESS' | 'TRY_AND_BUY' | string
    client_id: string
    client_secret: string
    token: string | null
    url: string
    return_url: string
    other_info: Record<string, string>
    is_active: boolean
    create_date: string
    update_date: string
}

export interface DeliveryAgencyResponse {
    status: string
    data: DeliveryAgency[]
}
