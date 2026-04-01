import { Button, Dialog } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import React, { useState } from 'react'

interface Props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    id: string | number
}

interface PdfResponse {
    data: {
        pdf_url: string
    }
    message: string
    status: string
}

const PoDownloadModal: React.FC<Props> = ({ isOpen, setIsOpen, id }) => {
    const [downloadLoading, setDownloadLoading] = useState(false)
    const [regenLoading, setRegenLoading] = useState(false)

    const triggerDownload = (pdfUrl: string) => {
        const link = document.createElement('a')
        link.href = pdfUrl
        link.setAttribute('download', `PO-${id}.pdf`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleDownload = async () => {
        try {
            setDownloadLoading(true)
            const response = await axioisInstance.get<PdfResponse>(`/merchant/purchase/order/pdf/${id}`)
            const pdfUrl = response.data?.data?.pdf_url
            if (!pdfUrl) return
            triggerDownload(pdfUrl)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        } finally {
            setDownloadLoading(false)
        }
    }

    const handleRegenerate = async () => {
        try {
            setRegenLoading(true)
            const response = await axioisInstance.get<PdfResponse>(`/merchant/purchase/order/pdf/${id}?regenerate=true`)
            const pdfUrl = response.data?.data?.pdf_url
            if (!pdfUrl) return
            triggerDownload(pdfUrl)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        } finally {
            setRegenLoading(false)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className="flex flex-col gap-5 p-6 ">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">Purchase Order</h3>
                    <p className="text-sm text-gray-500 mt-1">Download or regenerate the PDF for this order</p>
                </div>
                <div className="bg-gray-50 border flex gap-2 items-center rounded-lg p-3">
                    <p className="text-sm text-gray-600">PO Number:</p>
                    <p className="font-medium text-gray-900">#PO-{id}</p>
                </div>
                <div className="text-xs bg-yellow-200 p-3  rounded-lg text-gray-800 leading-relaxed">
                    <span className="font-medium text-gray-700">Note:</span> Regenerating will create a new PDF with the latest updated
                    data. Use this if any changes were made after the last generation.
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="gray" size="sm" onClick={handleDownload} disabled={downloadLoading || regenLoading}>
                        {downloadLoading ? 'Downloading...' : 'Download'}
                    </Button>

                    <Button variant="new" size="sm" onClick={handleRegenerate} disabled={downloadLoading || regenLoading}>
                        {regenLoading ? 'Regenerating...' : 'Regenerate'}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default PoDownloadModal
