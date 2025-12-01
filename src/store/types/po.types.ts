import { ApiResponse } from './generic.types'

export type PurchaseOrderTable = {
    id: number
    store: number
    warehouse_id: number
    company: number
    company_name: string
    brand_name: string
    business_model: string
    vendor_gst_no: string
    vendor_address: string
    status: 'APPROVED' | 'PENDING' | 'REJECTED' | string // extend as needed
    order_billing_entity: string
    order_billing_address: string
    order_shipping_address: string
    po_nature: 'REGULAR' | 'SPECIAL' | string // extend if API has fixed values
    poc_name: string
    poc_contact: string
    approver_name: string
    commercial_terms: string // URL
    total_count: number
    total_amount: string // API sends as string
    poc_email: string | null
    po_issued_date: string // ISO date string
    agreement_completed: boolean
    payment_terms: string
    expected_delivery_date: string | null
    delivery_date: string | null
    discount_sharing_applicable: boolean
    special_terms: string
    state_code: string
    order_reciept: string | null
    payment_mode: string | null
    comment: string | null
    created_at: string
    updated_at: string
}

export type PurchaseSingleData = {
    data: PurchaseOrderTable
    status: string
    message: string
}

export type PurchaseOrderResponseType = {
    data: {
        results: PurchaseOrderTable[]
        count: number
        next?: boolean
        previous?: boolean
        summary: {
            total_amount: number
            total_approved: number
            total_waiting: number
        }
    }
    status: string
    message?: string
}

export type PurchaseOrderItem = {
    id: number
    vendor_sku: string
    slikk_sku: string
    style_code: string
    category: string
    hsn_code: string
    supplier_mrp: string
    title: string | null
    ean: string | null
    quantity: number
    available_quantity: number
    fulfilled_quantity: number
    pending_quantity: number
    uom: string
    size: string
    stock_correction_percentage: number
    item_value: string
    gv: string
    tax_type: 'GST' | 'IGST' | 'NONE' | string
    tax_percentage: number
    cgst: string
    sgst: string
    igst: string
    total_value: string
    created_at: string
    updated_at: string
    order: number
}

export type PurchaseOrderItemSingleResponse = {
    data: PurchaseOrderItem
    status: string
    message: string
}

export type PurchaseOrderItemResponse = ApiResponse<PurchaseOrderItem>
