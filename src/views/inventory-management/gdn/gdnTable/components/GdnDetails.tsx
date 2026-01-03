/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import { HiOutlineCalendar } from 'react-icons/hi'
import isEmpty from 'lodash/isEmpty'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { Modal, notification } from 'antd'
import { FaDownload, FaSync } from 'react-icons/fa'
import { Button, Select, Spinner } from '@/components/ui'
import GDNdetailTable from './GDNdetailTable'
import { AxiosError } from 'axios'
import { GDNDetails } from '@/store/types/gdn.types'
import { gdnService } from '@/store/services/gdnService'
import GdnInfo from './GdnInfo'

const options = [
    { label: 'PDF', value: 'pdf' },
    { label: 'CSV', value: 'csv' },
]

const GdnDetails = () => {
    const [gdnData, setGdnData] = useState<GDNDetails | null>()
    const { gdn_number, id } = useParams()
    const [showSyncModal, setShowSyncModal] = useState(false)
    const [selectValue, setSelectValue] = useState<string | undefined>('')
    const gdnApiData = gdnService.useGdnSingleDetailsQuery(
        { gdn_number: gdn_number as string, id: id },
        { refetchOnMountOrArgChange: true },
    )
    const [syncGdn, syncResponse] = gdnService.useSyncGdnMutation()
    const [createShipment, createShipmentResponse] = gdnService.useLazyCreateShipmentQuery()
    // const [regenerate, regenerateResponse] = gdnService.useLazyRegenerateGrnQuery()

    useEffect(() => {
        if (gdnApiData.isSuccess) setGdnData(gdnApiData?.data?.data)
        if (gdnApiData.isError) setGdnData(null)
    }, [gdnApiData.isSuccess, gdnApiData.isError, gdnApiData.data])

    useEffect(() => {
        if (syncResponse.isSuccess) {
            notification.success({ message: 'GDN synced successfully' })
        }
        if (syncResponse.isError) {
            notification.error({ message: (syncResponse.error as any)?.data?.message })
        }
    }, [syncResponse.isError, syncResponse.isSuccess])

    useEffect(() => {
        if (createShipmentResponse.isSuccess) {
            notification.success({ message: 'Shipment created successfully from GDN' })
        }
        if (createShipmentResponse.isError) {
            notification.error({ message: 'Failed to sync GDN' })
        }
        setShowSyncModal(false)
    }, [createShipmentResponse.isError, createShipmentResponse.isSuccess])

    const handleSyncClick = () => {
        setShowSyncModal(true)
    }

    const syncGRN = async () => {
        const body = { company: id, document_number: gdnData?.document_number }
        syncGdn(body)
    }

    const handleCloseModal = () => {
        setShowSyncModal(false)
    }

    const handleCreateShipment = async () => {
        createShipment({ id: gdnData?.id as number })
    }

    const handleRegenerateGrn = async (doc_number: string) => {
        notification.info({ message: 'Downloading, please wait...' })
        try {
            let responseData = `/goods/dispatch/${id}/detail?download=true&regenerate=true&document_number=${doc_number}`
            if (selectValue === 'csv') {
                responseData += `&download_type=csv`
            }

            const response = await axioisInstance.get(responseData)

            if (selectValue === 'csv') {
                const csvText = response?.data
                const blob = new Blob([csvText], { type: 'text/csv' })

                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `${gdnData?.gdn_number}-${moment().format('YYYY-MM-DD_HH-mm-ss')}.csv`

                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(link.href)
                console.log('CSV file downloaded.')
            } else {
                const preSignedUrl = response?.data?.data
                if (!preSignedUrl) {
                    console.error('Failed to retrieve the pre-signed URL from the response.')
                    return
                }

                const fileResponse = await fetch(preSignedUrl)
                if (!fileResponse.ok) {
                    throw new Error(`Failed to fetch the file: ${fileResponse.statusText}`)
                }

                const blob = await fileResponse.blob()
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `${gdnData?.gdn_number}-${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`

                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(link.href)
                console.log('PDF file downloaded.')
            }
        } catch (error) {
            console.error('Error while regenerating the GDN:', error)
            if (error instanceof AxiosError) {
                notification.error({
                    message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to Regenerate',
                })
            }
        }
    }

    return (
        <Container className="h-full">
            <Loading loading={gdnApiData.isLoading}>
                {!isEmpty(gdnData) && (
                    <>
                        <div className="mb-6">
                            <div className="flex flex-col  mb-2">
                                <div className="flex gap-4">
                                    <div>
                                        <h3>
                                            <span>GDN:</span>
                                            <span className="ltr:ml-2 rtl:mr-2">#{gdnData.gdn_number}</span>
                                        </h3>
                                        <div className="docs flex flex-col">
                                            <div className="flex gap-2">
                                                Document Number : <span className="font-bold">{gdnData.document_number}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleRegenerateGrn(gdnData.document_number)}
                                            className="flex gap-2 bg-gray-200 p-2 rounded-xl text-black hover:bg-gray-300 font-bold items-center justify-center"
                                        >
                                            <span className="font-bold">Export</span> <FaDownload className="" />
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className="flex gap-2 bg-gray-200 p-2 rounded-xl text-black hover:bg-gray-300 font-bold items-center justify-center"
                                            onClick={handleCreateShipment}
                                        >
                                            Create Shipment from GDN{' '}
                                            {createShipmentResponse.isLoading && <Spinner size={20} color={'yellow'} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <span className="flex items-center">
                                <HiOutlineCalendar className="text-lg" />
                                <span className="ltr:ml-1 rtl:mr-1">{moment(gdnData.document_date).format('MM/DD/YYYY hh:mm:ss a')}</span>
                            </span>
                        </div>
                        <div className="flex-1 bg-white rounded-lg shadow-md p-4 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
                            <div className="text-gray-600">
                                <p className="mb-2">
                                    <span className="font-medium text-gray-800">Original Address:</span> {gdnData?.origin_address || 'N/A'}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-800">Delivery Address:</span>{' '}
                                    {gdnData?.delivery_address || 'N/A'}
                                </p>
                            </div>
                        </div>
                        <GdnInfo data={gdnData} />

                        <div className="mt-5 flex flex-col">
                            <div className="flex gap-10 items-center justify-end mt-5 text-xl mr-7">
                                <div className="flex gap-2 items-center">
                                    <div>
                                        <Select
                                            size="sm"
                                            isClearable
                                            isSearchable={false}
                                            options={options}
                                            onChange={(e) => setSelectValue(e?.value)}
                                        />
                                    </div>

                                    <Button
                                        variant="gray"
                                        size="sm"
                                        icon={<FaDownload />}
                                        onClick={() => handleRegenerateGrn(gdnData.document_number)}
                                    >
                                        Export
                                    </Button>
                                </div>

                                <Button
                                    icon={<FaSync />}
                                    variant="accept"
                                    size="sm"
                                    loading={syncResponse.isLoading}
                                    disabled={syncResponse.isLoading}
                                    onClick={() => handleSyncClick()}
                                >
                                    SYNC GDN
                                </Button>
                            </div>
                            <br />

                            <GDNdetailTable />
                        </div>
                        {showSyncModal && (
                            <Modal
                                title=""
                                okText="SYNC"
                                okButtonProps={{
                                    style: {
                                        backgroundColor: 'green',
                                        borderColor: 'green',
                                        fontWeight: 'bold',
                                    },
                                }}
                                open={showSyncModal}
                                onOk={syncGRN}
                                onCancel={handleCloseModal}
                            >
                                <div className="italic text-lg font-semibold">Are you sure you want to sync this GDN?</div>
                            </Modal>
                        )}
                    </>
                )}
            </Loading>
            {!gdnApiData.isLoading && isEmpty(gdnData) && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage src="/img/others/img-2.png" darkModeSrc="/img/others/img-2-dark.png" alt="No GRN found!" />
                    <h3 className="mt-8">No GRN found!</h3>
                </div>
            )}
        </Container>
    )
}

export default GdnDetails
