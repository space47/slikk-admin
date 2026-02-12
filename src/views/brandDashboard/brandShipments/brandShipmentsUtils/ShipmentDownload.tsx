import { Button, Select } from '@/components/ui'
import React, { useState } from 'react'
import { FaDownload, FaSyncAlt, FaFilePdf, FaLink, FaFileCsv } from 'react-icons/fa'
import { DownloadTypeArray } from './brandShipmentsCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { AxiosError } from 'axios'
import moment from 'moment'
import { errorMessage } from '@/utils/responseMessages'

interface Props {
    id?: string
}

const ShipmentDownload: React.FC<Props> = ({ id }) => {
    const [downloadType, setDownloadType] = useState<string>(DownloadTypeArray?.[0]?.value)
    const [urlData, setUrlData] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchShipmentFiles = async (regenerate: boolean) => {
        if (!id) return
        try {
            setLoading(true)
            setError(null)
            const response = await axioisInstance.get('/shipment/item', {
                params: {
                    download: true,
                    shipment_id: id,
                    download_type: downloadType,
                    regenerate,
                },
            })
            if (downloadType === 'pdf') {
                setUrlData(response?.data?.data || [])
            } else {
                const csvText = response?.data
                const blob = new Blob([csvText], { type: 'text/csv' })
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `Shipment-${moment().format('YYYY-MM-DD_HH-mm-ss')}.csv`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(link.href)
            }
        } catch (err) {
            setError('Something went wrong while fetching shipment documents.')
        } finally {
            setLoading(false)
        }
    }

    const handleGenerate = async (url: string) => {
        if (downloadType !== 'pdf') return

        try {
            const fileResponse = await fetch(url)
            if (!fileResponse.ok) {
                throw new Error(`Failed to fetch the file: ${fileResponse.statusText}`)
            }

            const blob = await fileResponse.blob()
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `Shipment-${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(link.href)
            console.log('PDF file downloaded.')
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    const handleDownload = () => {
        fetchShipmentFiles(false)
    }

    const handleRegenerate = () => {
        fetchShipmentFiles(true)
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3 mt-7">
            <div className="flex items-center justify-between">
                <h5 className="text-lg font-semibold text-gray-800">Shipment Downloads</h5>
            </div>
            <div className="flex justify-between mb-4">
                <div className="flex gap-2 items-center">
                    <Select
                        size="sm"
                        className="xl:w-[260px] w-auto"
                        isClearable={false}
                        isSearchable={false}
                        options={DownloadTypeArray}
                        value={DownloadTypeArray.find((item) => item.value === downloadType)}
                        onChange={(e) => setDownloadType(e?.value as string)}
                    />
                    <span>
                        {downloadType === 'csv' ? (
                            <FaFileCsv className="text-green-500 text-xl" />
                        ) : (
                            <FaFilePdf className="text-red-500 text-xl" />
                        )}
                    </span>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="blue"
                        size="sm"
                        icon={<FaDownload />}
                        loading={loading}
                        disabled={loading || !id}
                        onClick={handleDownload}
                    >
                        View Docs
                    </Button>

                    <Button
                        variant="gray"
                        size="sm"
                        icon={<FaSyncAlt />}
                        loading={loading}
                        disabled={loading || !id}
                        onClick={handleRegenerate}
                    >
                        Regenerate Docs and view
                    </Button>
                </div>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

            {!loading && urlData.length === 0 && !error && (
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">No documents available.</div>
            )}

            {!!urlData.length && !loading && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Available Files:</p>

                    {urlData.map((url, index) => (
                        <div
                            key={index}
                            onClick={() => handleGenerate(url)}
                            className="flex items-center justify-between bg-gray-50 hover:bg-blue-50 transition-all duration-200 cursor-pointer px-4 py-2 rounded-xl border border-gray-100 hover:border-blue-300"
                        >
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <FaLink className="text-blue-500" />
                                <span className="truncate">Shipment_File_{index + 1}</span>
                            </div>

                            <FaDownload className="text-gray-400 text-sm" />
                        </div>
                    ))}
                </div>
            )}
            {loading && (
                <div className="flex items-center justify-center mb-5 mt-7 animate-pulse text-xl">Downloading documents from server</div>
            )}
        </div>
    )
}

export default ShipmentDownload
