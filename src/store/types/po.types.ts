export type PurchaseOrderTable = {
    id: number
    name: string
}

export type PurchaseOrderResponseType = {
    status: string
    data: {
        count: number
        results: PurchaseOrderTable[]
    }
}
