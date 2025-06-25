/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

export const fetchInput = async (searchInput: string, currentSelectedPage: any, setTableData: any) => {
    try {
        if (searchInput) {
            const qname =
                currentSelectedPage?.value === 'sku'
                    ? 'sku'
                    : currentSelectedPage?.value === 'name'
                      ? 'name'
                      : currentSelectedPage?.value === 'barcode'
                        ? 'barcode'
                        : ''
            const response = await axioisInstance.get(`/merchant/products?dashboard=true&${qname}=${searchInput}`)
            const data = response.data.data.results
            setTableData(data)
        }
    } catch (error) {
        console.log(error)
    }
}

export const fetchPost = async (postInput: string, setPostTableData: any) => {
    try {
        if (postInput) {
            const response = await axioisInstance.get(`/posts?name=${postInput}`)
            const data = response.data.data.results
            setPostTableData(data)
        }
    } catch (error) {
        console.log(error)
    }
}
