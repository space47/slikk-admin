export interface SellerTemplateData {
    id: number
    name: string
    email_subject: string
    email_body: string
}

export interface SellerTemplateResponse {
    status: string
    data: {
        count: number
        results: SellerTemplateData[]
    }
}
