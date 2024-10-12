import { Button } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import React from 'react'

const AnalyticsReports = () => {
    const handleOrderDownload = async () => {
        try {
            const response = await axioisInstance.get(`/merchant/order_items?download=true&download_type=master`, {
                responseType: 'blob',
            })

            // Create a Blob from the response
            const blob = new Blob([response.data], { type: response.headers['content-type'] })
            const downloadUrl = window.URL.createObjectURL(blob)

            // Create a temporary anchor element to trigger the download
            const link = document.createElement('a')
            link.href = downloadUrl

            // Set the download attribute with a file name
            link.download = 'order_items_master.csv' // Change the file extension as per the content type or format

            // Append the link to the body
            document.body.appendChild(link)

            link.click()

            // Cleanup
            document.body.removeChild(link)
            window.URL.revokeObjectURL(downloadUrl)

            notification.success({
                message: 'File downloaded successfully',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to download',
            })
        }
    }

    return (
        <div>
            <div className="flex gap-10 items-center">
                <span className="text-xl font-semibold">Order Item Download: </span>
                <Button onClick={handleOrderDownload} variant="new">
                    Download
                </Button>
            </div>
        </div>
    )
}

export default AnalyticsReports
