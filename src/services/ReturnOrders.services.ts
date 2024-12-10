import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'

// Return Order API
export const returnOrderApi = async (
    page: number,
    pageSize: number,
    searwiseDownload: string,
    status: string,
    fromToParams: string,
    deliveryStatus: string,
) => {
    const returnUrl = `merchant/return_orders?p=${page}&page_size=${pageSize}${searwiseDownload}${status}${fromToParams}${deliveryStatus}`

    const response = await axiosInstance.get(returnUrl)
    return response
}
