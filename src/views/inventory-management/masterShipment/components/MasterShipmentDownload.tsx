import { Button, Dialog, Select } from '@/components/ui'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { masterShipmentService } from '@/store/services/masterShipmentService'
import { Modal, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { FaDownload, FaFilePdf, FaFileCsv, FaSyncAlt } from 'react-icons/fa'

interface Props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    id: number | string
    shipment_number: string
}

const downloadOptions = [
    {
        label: 'PDF',
        value: 'pdf',
        icon: <FaFilePdf className="text-red-500" />,
    },
    {
        label: 'CSV',
        value: 'csv',
        icon: <FaFileCsv className="text-green-500" />,
    },
]

const MasterShipmentDownload: React.FC<Props> = ({ isOpen, setIsOpen, id, shipment_number }) => {
    const [downloadType, setDownloadType] = useState(downloadOptions[0])

    const [downloadLineItems, downloadResponse] = masterShipmentService.useLazyMasterShipmentLineItemsDownloadQuery()

    useEffect(() => {
        if (downloadResponse.isSuccess) {
            if (downloadType?.value === 'csv') {
                const blob = downloadResponse.data as Blob
                const url = window.URL.createObjectURL(blob)

                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${shipment_number}-LineItems.csv`)

                document.body.appendChild(link)
                link.click()
                link.remove()

                URL.revokeObjectURL(url)
                setIsOpen(false)
            } else {
                const url = downloadResponse?.data?.data?.[0]

                if (url) {
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', `${shipment_number}-LineItems.pdf`)

                    document.body.appendChild(link)
                    link.click()
                    link.remove()

                    setIsOpen(false)
                }
            }
        }

        if (downloadResponse.isError) {
            const errorMessage = getApiErrorMessage(downloadResponse.error)
            notification.error({ message: errorMessage })
        }
    }, [downloadResponse.isSuccess, downloadResponse.isError, downloadResponse.data])

    const handleRegenerate = () => {
        Modal.confirm({
            title: 'Generate a new file',
            content: `Are you sure you want to regenerate the download file?`,
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => handleDownload(true),
        })
    }

    const handleDownload = (regenerate: boolean) => {
        downloadLineItems({
            download_type: downloadType?.value,
            id: typeof id === 'string' ? id : id?.toString(),
            regenerate,
        })
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className="bg-white overflow-hidden">
                <div className=" border-b bg-gradient-to-r  text-white">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FaDownload /> Download Line Items
                    </h2>
                    <p className="text-sm opacity-90 mt-1">Export shipment data in your preferred format</p>
                </div>
                <div className="p-6 space-y-5">
                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-2 block">Select Format</label>

                        <Select
                            options={downloadOptions}
                            value={downloadType}
                            className="w-full"
                            onChange={(option) => {
                                if (option) setDownloadType(option)
                            }}
                        />
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                            {downloadType.icon}
                            <span>{downloadType.label} selected</span>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t flex gap-3">
                    <Button
                        variant="gray"
                        size="sm"
                        className="w-1/2 flex items-center justify-center gap-2 hover:bg-gray-100 transition"
                        icon={<FaSyncAlt className="text-sm" />}
                        loading={downloadResponse.isLoading && downloadResponse.originalArgs?.regenerate}
                        onClick={handleRegenerate}
                    >
                        Regenerate
                    </Button>

                    <Button
                        variant="new"
                        size="sm"
                        className="w-1/2 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                        icon={<FaDownload className="text-sm" />}
                        loading={downloadResponse.isLoading && !downloadResponse.originalArgs?.regenerate}
                        onClick={() => handleDownload(false)}
                    >
                        Download
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default MasterShipmentDownload
