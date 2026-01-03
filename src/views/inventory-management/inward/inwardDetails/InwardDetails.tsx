/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import PaymentSummary from './components/PaymentSummary'
import ShippingInfo from './components/ShippingInfo'
import CustomerInfo from './components/CustomerInfo'
import { HiOutlineCalendar } from 'react-icons/hi'
import isEmpty from 'lodash/isEmpty'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { notification } from 'antd'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { FaDownload } from 'react-icons/fa'
import QcTabs from './components/QcTabs'
import { Button } from '@/components/ui'
import { inwardService } from '@/store/services/inwardService'
import { GRNDetails } from '@/store/types/inward.types'

const InwardDetails = () => {
    const [data, setData] = useState<GRNDetails>()
    const { document_number } = useParams()
    const [showSyncModal, setShowSyncModal] = useState(false)
    const [companyId, setCompanyId] = useState<number>()
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [selectValue, setSelectValue] = useState<string>('')
    const inwardSingleApiCall = inwardService.useInwardSingleDetailsQuery({ grn_number: document_number })
    const [syncGrn, syncResponse] = inwardService.useSyncGrnMutation()
    const [presignUrl, presignResponse] = inwardService.useLazyPreSignUrlQuery()

    useEffect(() => {
        if (inwardSingleApiCall.isSuccess) {
            setData(inwardSingleApiCall?.data?.data)
            setCompanyId(inwardSingleApiCall?.data?.data?.company)
        }
        if (inwardSingleApiCall.isError) {
            notification.error({ message: (inwardSingleApiCall.error as any).data.message })
        }
    }, [inwardSingleApiCall.isSuccess, inwardSingleApiCall.isError, inwardSingleApiCall?.data?.data, inwardSingleApiCall.error])

    const handleSyncClick = () => {
        setShowSyncModal(true)
    }

    useEffect(() => {
        if (syncResponse.isSuccess) {
            notification.success({ message: 'GRN synced successfully' })
            setShowSyncModal(false)
        }
        if (syncResponse.isError) notification.error({ message: (syncResponse.error as any)?.data?.message || 'Failed to Sync Grn' })
    }, [syncResponse.isError, syncResponse.isSuccess])

    useEffect(() => {
        if (presignResponse.isSuccess) {
            const val = presignResponse.data?.data
            if (val) {
                const link = document.createElement('a')
                link.href = val
                link.download = `${presignResponse.originalArgs?.file_url}`
                link.target = '_blank'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } else {
                console.error('No file URL returned from API')
            }
        }
        if (presignResponse.isError) notification.error({ message: (presignResponse.error as any)?.data?.message || 'Failed to Sync Grn' })
    }, [presignResponse.isError, presignResponse.isSuccess])

    const syncGRN = async () => {
        const body = { company: selectedCompany.id, grn_number: document_number }
        syncGrn(body)
    }

    const handleCloseModal = () => {
        setShowSyncModal(false)
    }

    const handleUrl = async (document_url: string) => {
        presignUrl({ file_url: document_url })
    }

    const handleRegenerateGrn = async (doc_number: string) => {
        try {
            let responseData = `/goods/received/${companyId}/detail?download=true&regenerate=true&document_number=${encodeURIComponent(doc_number)}`
            if (selectValue === 'csv') {
                responseData = `/goods/received/${companyId}/detail?download=true&regenerate=true&document_number=${encodeURIComponent(doc_number)}&download_type=csv`
            }

            const response = await axioisInstance.get(responseData)

            if (selectValue === 'csv') {
                const csvText = response?.data
                const blob = new Blob([csvText], { type: 'text/csv' })

                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `${data?.document_number}-${moment().format('YYYY-MM-DD_HH-mm-ss')}.csv`

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
                const blobUrl = window.URL.createObjectURL(blob)

                const link = document.createElement('a')
                link.href = blobUrl
                link.download = `${data?.document_number}-${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`

                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(blobUrl)
                console.log('PDF file downloaded.')
            }
        } catch (error: any) {
            console.error('Error while regenerating the GRN:', error)
            notification.error({
                message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to Regenerate',
            })
        }
    }

    return (
        <Container className="">
            <Loading loading={inwardSingleApiCall.isLoading}>
                {!isEmpty(data) && (
                    <>
                        <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                            <span className="font-semibold text-sm">GRN</span>
                                        </div>
                                        <h1 className="text-2xl font-bold text-gray-800">#{data.grn_number}</h1>
                                        <Button
                                            variant="blue"
                                            size="sm"
                                            icon={<FaDownload />}
                                            onClick={() => handleRegenerateGrn(data.document_number)}
                                        ></Button>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <HiOutlineCalendar className="text-lg mr-2" />
                                        <span className="font-medium">{moment(data.document_date).format('MMM DD, YYYY hh:mm A')}</span>
                                    </div>
                                </div>
                            </div>

                            {data?.document_url ? (
                                <>
                                    <div className="docs flex flex-col">
                                        {data.document_url?.split(',')?.map((item, key) => {
                                            return (
                                                <div className="cursor-pointer" onClick={() => handleUrl(item)} key={key}>
                                                    <p className="cursor-pointer p-2 rounded-xl bg-blue-600 text-white">
                                                        {data?.grn_number}_{key + 1}
                                                    </p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </>
                            ) : (
                                <>No document url</>
                            )}
                        </div>
                        <div className="mb-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-xl border border-gray-200 shadow-xl p-5 h-full">
                                        <ShippingInfo company={data.company} origin_address={data.origin_address} />
                                    </div>
                                </div>

                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-xl border border-gray-200 shadow-xl p-5 h-full">
                                        <PaymentSummary received_address={data.received_address} received_by={data.received_by} />
                                    </div>
                                </div>

                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-xl border border-gray-200 shadow-xl p-5 h-full">
                                        <CustomerInfo data={data} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm ">
                            <QcTabs
                                data={data}
                                handleSyncClick={handleSyncClick}
                                showSyncModal={showSyncModal}
                                syncGRN={syncGRN}
                                handleCloseModal={handleCloseModal}
                                isSyncing={syncResponse.isLoading}
                                setSelectValue={setSelectValue}
                                handleRegenerateGrn={handleRegenerateGrn}
                            />
                        </div>
                    </>
                )}
            </Loading>

            {!inwardSingleApiCall.isLoading && isEmpty(data) && (
                <div className=" flex flex-col items-center justify-center p-8">
                    <div className="mb-6">
                        <DoubleSidedImage
                            src="/img/others/img-2.png"
                            darkModeSrc="/img/others/img-2-dark.png"
                            alt="No GRN found!"
                            className="w-64 h-64"
                        />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">No GRN found!</h3>
                    <p className="text-gray-500 text-center max-w-md">
                        The requested Goods Received Note could not be found. Please check the GRN number and try again.
                    </p>
                </div>
            )}
        </Container>
    )
}

export default InwardDetails
