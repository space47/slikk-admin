import { commonDownload } from '@/common/commonDownload'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'

interface Props {
    id: number
    setIsDownloading: (x: boolean) => void
}

export const usePoDetailFunction = ({ id, setIsDownloading }: Props) => {
    async function handleDownloadPo() {
        setIsDownloading(true)
        try {
            const res = await axioisInstance.get(`/merchant/purchase/bulkupload/orderitem?purchase_order_id=${id}&download=1`, {
                responseType: 'blob',
            })
            commonDownload(res, 'orderItems.csv')
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        } finally {
            setIsDownloading(false)
        }
    }

    return { handleDownloadPo }
}
