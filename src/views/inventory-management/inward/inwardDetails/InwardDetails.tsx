/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
// import classNames from 'classnames'
// import Tag from '@/components/ui/Tag'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
// import OrderProducts from './components/OrderProducts'
import PaymentSummary from './components/PaymentSummary'
import ShippingInfo from './components/ShippingInfo'
// import Activity from './components/Activity'
import CustomerInfo from './components/CustomerInfo'
import { HiOutlineCalendar } from 'react-icons/hi'
// import { apiGetSalesOrderDetails } from '@/services/SalesService'
// import { useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import QCtable from './components/QCtable'

import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
// import { ordercommon } from '@/views/category-management/orderlist/commontypes'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { Modal, notification } from 'antd'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { FaDownload, FaSync } from 'react-icons/fa'
import { inwardDetailsResponse } from './inwardCommon'
import QcTabs from './components/QcTabs'
// import { string } from 'yup'

const InwardDetails = () => {
    // const location = useLocation()

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<inwardDetailsResponse>()
    const { document_number } = useParams()
    const [showSyncModal, setShowSyncModal] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)
    const [grnNumber, setGrnNumber] = useState('')
    const [companyId, setCompanyId] = useState<number>()
    const navigate = useNavigate()
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axioisInstance.get(`goods/received?grn_number=${document_number}`)

                const ordersData = response.data?.data || []
                setLoading(false)

                setData(ordersData)
                setCompanyId(ordersData?.company?.id)
            } catch (error) {
                console.log(error)
            }
        }

        fetchOrders()
    }, [document_number])

    const handleSyncClick = (grn_number: string) => {
        setShowSyncModal(true)
        setGrnNumber(grn_number)
    }

    const syncGRN = async () => {
        const body = {
            company: selectedCompany.id,
            grn_number: grnNumber,
        }
        setShowSyncModal(false)
        setIsSyncing(true)

        try {
            await axioisInstance.post(`goods/synctoinventory`, body)
            notification.success({
                message: 'Success',
                description: 'GRN synced successfully',
            })
        } catch (error) {
            console.error(error)
            notification.error({
                message: 'FAILURE',
                description: 'GRN sync Failed',
            })
        } finally {
            setIsSyncing(false)
            navigate(-1)
        }
    }

    const handleCloseModal = () => {
        setShowSyncModal(false)
    }

    const handleUrl = async (document_url: string) => {
        try {
            const response = await axioisInstance.get(`file/presign?file_url=${document_url}`)
            const val = response.data?.data
            window.open(val)
        } catch (error) {
            console.error(error)
        }
    }

    const handleRegenerateGrn = async (doc_number: string) => {
        try {
            const response = await axioisInstance.get(
                `/goods/received/${companyId}/detail?download=true&regenerate=true&document_number=${doc_number}`,
            )
            const preSignedUrl = response?.data?.data

            if (preSignedUrl) {
                const fileResponse = await fetch(preSignedUrl)
                if (!fileResponse.ok) {
                    throw new Error(`Failed to fetch the file: ${fileResponse.statusText}`)
                }
                const blob = await fileResponse.blob()
                const blobUrl = window.URL.createObjectURL(blob)

                const link = document.createElement('a')
                link.href = blobUrl
                link.download = 'GRN_Document.pdf'
                document.body.appendChild(link)
                link.click()

                window.URL.revokeObjectURL(blobUrl)
                document.body.removeChild(link)
            } else {
                console.error('Failed to retrieve the pre-signed URL from the response.')
            }
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to Regenerate',
            })
            console.error('Error while regenerating the GRN:', error)
        }
    }

    return (
        <Container className="h-full">
            <Loading loading={loading}>
                {!isEmpty(data) && (
                    <>
                        <div className="mb-6">
                            <div className="flex flex-col  mb-2">
                                <div>
                                    <div className="flex gap-5">
                                        <div>
                                            <span className="font-bold text-xl">GRN:</span>
                                            <span className="ltr:ml-2 rtl:mr-2 ont-bold text-xl">#{data.grn_number}</span>
                                        </div>

                                        <div
                                            className="flex p-2 bg-gray-200 gap-2 rounded-lg cursor-pointer"
                                            onClick={() => handleRegenerateGrn(data.document_number)}
                                        >
                                            <span className="font-bold">Export</span> <FaDownload className="text-xl" />
                                        </div>
                                    </div>
                                    <div className="docs flex flex-col">
                                        {data.document_number}
                                        <div className="cursor-pointer" onClick={() => handleUrl(data.document_url)}>
                                            <p className=" underline">Document Url</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="flex items-center">
                                <HiOutlineCalendar className="text-lg" />
                                <span className="ltr:ml-1 rtl:mr-1">{moment(data.document_date).format('MM/DD/YYYY hh:mm:ss a')}</span>
                            </span>
                        </div>
                        <div className="xl:flex gap-4">
                            <div className="w-full">
                                <div className="xl:grid grid-cols-2 gap-4">
                                    <ShippingInfo company={data.company} origin_address={data.origin_address} />
                                    <PaymentSummary received_address={data.received_address} received_by={data.received_by} />
                                </div>
                            </div>
                            <div className="xl:max-w-[360px] w-full">
                                <CustomerInfo
                                    last_updated_by={data.last_updated_by}
                                    total_sku={data.total_sku}
                                    total_quantity={data.total_quantity}
                                />
                            </div>
                            <hr className="" />
                        </div>
                        {/* From Here */}
                        <br />
                        <QcTabs
                            data={data}
                            handleSyncClick={handleSyncClick}
                            showSyncModal={showSyncModal}
                            syncGRN={syncGRN}
                            handleCloseModal={handleCloseModal}
                            isSyncing={isSyncing}
                        />

                        {/* To here */}
                    </>
                )}
            </Loading>
            {!loading && isEmpty(data) && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage src="/img/others/img-2.png" darkModeSrc="/img/others/img-2-dark.png" alt="No GRN found!" />
                    <h3 className="mt-8">No GRN found!</h3>
                </div>
            )}
        </Container>
    )
}

export default InwardDetails
