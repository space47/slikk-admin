import { useState, useEffect } from 'react'
// import classNames from 'classnames'
// import Tag from '@/components/ui/Tag'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import OrderProducts from './components/OrderProducts'
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
import { FaSync } from 'react-icons/fa'
// import { string } from 'yup'

type GRN_QUALITY_CHECK = {
    batch_number: string
    create_date: string
    grn: number
    id: number
    images: string
    last_updated_by: {
        email: string
        mobile: string
        name: string
    }
    qc_done_by: {
        email: string
        mobile: string
        name: string
    }
    qc_failed: number
    qc_passed: number
    quantity_received: number
    quantity_sent: number
    sent_to_inventory: boolean
    sku: string
    update_date: Date
}

type inwardDetailsResponse = {
    company: number
    document_number: string
    grn_number: string
    last_updated_by: {
        name: string
        email: string
        mobile: string
    }

    total_sku: number
    origin_address: string
    received_address: string
    received_by: {
        email: string
        mobile: string
        name: string
    }
    document_date: string
    document_url: string
    total_quantity: number
    grn_quality_check: GRN_QUALITY_CHECK[]
}

const InwardDetails = () => {
    // const location = useLocation()

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<inwardDetailsResponse>()
    const { document_number } = useParams()
    const [showSyncModal, setShowSyncModal] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)
    const [grnNumber, setGrnNumber] = useState('')
    const navigate = useNavigate()
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>(
        (store) => store.company.currCompany
    )

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axioisInstance.get(
                    `goods/received?grn_number=${document_number}`
                )

                const ordersData = response.data?.data || []
                setLoading(false)

                setData(ordersData)
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
            grn_number: grnNumber
        }
        setIsSyncing(true)

        try {
            await axioisInstance.post(`goods/synctoinventory`, body)
            notification.success({
                message: 'Success',
                description: 'GRN synced successfully'
            })
            setShowSyncModal(false)
        } catch (error) {
            console.log('sssssssss', error)
            notification.error({
                message: 'FAILURE',
                description: 'GRN sync Failed'
            })
        } finally {
            setIsSyncing(false)
            navigate(`/app/goods/received`)
        }
    }

    const handleCloseModal = () => {
        setShowSyncModal(false)
    }

    const handleUrl = async (document_url: any) => {
        try {
            const response = await axioisInstance.get(
                `file/presign?file_url=${document_url}`
            )
            console.log('dooooocs', document_url)
            const val = response.data?.data
            window.open(val)
        } catch (error) {
            console.error(error)
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
                                    <h3>
                                        <span>GRN:</span>
                                        <span className="ltr:ml-2 rtl:mr-2">
                                            #{data.grn_number}
                                        </span>
                                    </h3>
                                    <div className="docs flex flex-col">
                                        {data.document_number}
                                        <div
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleUrl(data.document_url)
                                            }
                                        >
                                            <p className=" underline">
                                                Document Url
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="flex items-center">
                                <HiOutlineCalendar className="text-lg" />
                                <span className="ltr:ml-1 rtl:mr-1">
                                    {moment(data.document_date).format(
                                        'MM/DD/YYYY hh:mm:ss a'
                                    )}
                                </span>
                            </span>
                        </div>
                        <div className="xl:flex gap-4">
                            <div className="w-full">
                                <div className="xl:grid grid-cols-2 gap-4">
                                    <ShippingInfo
                                        company={data.company}
                                        origin_address={data.origin_address}
                                    />
                                    <PaymentSummary
                                        received_address={data.received_address}
                                        received_by={data.received_by}
                                    />
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
                        <div className="mt-5 flex flex-col">
                            {/* TABLE..................................................... */}

                            <QCtable
                                data={data.grn_quality_check}
                                totalData={data.grn_quality_check.length}
                            />

                            <div className="flex justify-end mt-5 text-xl mr-7">
                                <button
                                    onClick={() =>
                                        handleSyncClick(data.grn_number)
                                    }
                                    className="border-none bg-none flex gap-5"
                                >
                                    {' '}
                                    <div>SYNC GRN:</div>{' '}
                                    <FaSync className="text-4xl" />
                                </button>
                            </div>
                        </div>
                        {showSyncModal && (
                            <Modal
                                title=""
                                okText="SYNC"
                                okButtonProps={{
                                    style: {
                                        backgroundColor: 'green',
                                        borderColor: 'green',
                                        fontWeight: 'bold'
                                    }
                                }}
                                open={showSyncModal}
                                onOk={syncGRN}
                                onCancel={handleCloseModal}
                            >
                                <div className="italic text-lg font-semibold">
                                    SYNC YOUR GRN NUMBER
                                </div>
                            </Modal>
                        )}
                        {isSyncing && <Loading />}
                    </>
                )}
            </Loading>
            {!loading && isEmpty(data) && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No GRN found!"
                    />
                    <h3 className="mt-8">No GRN found!</h3>
                </div>
            )}
        </Container>
    )
}

export default InwardDetails
