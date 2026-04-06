export interface DeliveryAgency {
    id: number
    name: string
    registered_name: string
    agency_domains: string
    poc_name: string
    poc_mobile: string
    poc_email: string
    address: string
    agency_documents: Record<string, string>
    gstin: string
    cin: string
    is_active: true
    create_date: string
    update_date: string
    last_updated_by: string
}

export interface DeliveryAgencyResponse {
    status: string
    data: {
        count: number
        next: boolean
        results: DeliveryAgency[]
    }
}

export interface CreateAgencyRequest {
    name: string
    registered_name: string
    agency_domains: string
    poc_name: string
    poc_mobile: string
    poc_email: string
    address: string
    gstin: string
    cin: string
    is_active: boolean
}

export interface CreateAgencyResponse {
    status: string
    data: DeliveryAgency
}
