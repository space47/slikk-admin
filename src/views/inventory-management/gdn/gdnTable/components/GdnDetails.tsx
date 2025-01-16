import { useState, useEffect } from 'react'
// import classNames from 'classnames'
// import Tag from '@/components/ui/Tag'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
// import Activity from './components/Activity'

import { HiOutlineCalendar } from 'react-icons/hi'
// import { apiGetSalesOrderDetails } from '@/services/SalesService'
// import { useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'

import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
// import { ordercommon } from '@/views/category-management/orderlist/commontypes'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { Modal, notification } from 'antd'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { FaSync } from 'react-icons/fa'
import PaymentSummary from '@/views/inventory-management/inward/inwardDetails/components/PaymentSummary'
import CustomerInfo from '@/views/inventory-management/inward/inwardDetails/components/CustomerInfo'
import ShippingInfo from '@/views/inventory-management/inward/inwardDetails/components/ShippingInfo'
import { Card } from '@/components/ui'
import GDNdetailTable from './GDNdetailTable'
// import { string } from 'yup'

const GdnDetails = () => {
    // const location = useLocation()

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>([])
    const { document_number, id } = useParams()
    const [showSyncModal, setShowSyncModal] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)
    const [grnNumber, setGrnNumber] = useState('')
    const navigate = useNavigate()
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)

    console.log('Decoded uri component', id)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axioisInstance.get(`/goods/dispatch/${id}/detail?document_number=${document_number}`)

                const ordersData = response.data?.data || []
                setLoading(false)

                setData(ordersData)
            } catch (error) {
                console.log(error)
            }
        }

        fetchOrders()
    }, [document_number, selectedCompany])

    const handleSyncClick = (grn_number: string) => {
        setShowSyncModal(true)
        setGrnNumber(grn_number)
    }

    const syncGRN = async () => {
        const body = {
            company: selectedCompany.id,
            document_number: document_number,
        }
        setShowSyncModal(false)
        setIsSyncing(true)

        try {
            await axioisInstance.post(`/goods/dispatch-synctoinventory`, body)
            notification.success({
                message: 'Success',
                description: 'GDN synced successfully',
            })
        } catch (error) {
            console.error(error)
            notification.error({
                message: 'FAILURE',
                description: 'GDN sync Failed',
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

    return (
        <Container className="h-full">
            <Loading loading={loading}>
                {!isEmpty(data) && (
                    <>
                        <div className="mb-6">
                            <div className="flex flex-col  mb-2">
                                <div>
                                    <h3>
                                        <span>GDN:</span>
                                        <span className="ltr:ml-2 rtl:mr-2">#{data.gdn_number}</span>
                                    </h3>
                                    <div className="docs flex flex-col">
                                        <div className="flex gap-2">
                                            {' '}
                                            Document Number : <span className="font-bold">{data.document_number}</span>
                                        </div>
                                        {/* <div className="cursor-pointer" onClick={() => handleUrl(data.document_url)}>
                                            <p className=" underline">Document Url</p>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            <span className="flex items-center">
                                <HiOutlineCalendar className="text-lg" />
                                <span className="ltr:ml-1 rtl:mr-1">{moment(data.document_date).format('MM/DD/YYYY hh:mm:ss a')}</span>
                            </span>
                        </div>
                        <div className="xl:flex gap-6 p-6 bg-gray-50 rounded-lg shadow-lg">
                            {/* Address Card Section */}
                            <div className="flex-1 bg-white rounded-lg shadow-md p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
                                <div className="text-gray-600">
                                    <p className="mb-2">
                                        <span className="font-medium text-gray-800">Original Address:</span> {data?.origin_address || 'N/A'}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800">Delivery Address:</span>{' '}
                                        {data?.delivery_address || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Customer Info Section */}
                            <div className="xl:max-w-[360px] w-full bg-white rounded-lg shadow-md p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                                <CustomerInfo
                                    last_updated_by={data?.last_updated_by || 'Unknown'}
                                    total_sku={data?.total_sku || 0}
                                    total_quantity={data?.total_quantity || 0}
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex flex-col">
                            {/* TABLE..................................................... */}

                            <div className="flex justify-end mt-5 text-xl mr-7">
                                <button onClick={() => handleSyncClick(data.grn_number)} className="border-none bg-none flex gap-5">
                                    {' '}
                                    <div className="flex gap-2 font-bold text-green-600">
                                        SYNC GDN <FaSync className="text-2xl" />
                                    </div>{' '}
                                </button>
                            </div>
                            {/* <QCtable data={data.grn_quality_check} totalData={data.grn_quality_check.length} /> */}
                            {data?.gdn_products?.length === 0 ? (
                                <>
                                    <div className="flex justify-center items-center text-xl font-bold text-red-700">NO GDN PRODUCTS</div>
                                </>
                            ) : (
                                <GDNdetailTable data={data?.gdn_products || []} />
                            )}
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
                                <div className="italic text-lg font-semibold">SYNC YOUR GRN NUMBER</div>
                            </Modal>
                        )}
                        {isSyncing && <Loading loading={isSyncing} />}
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

export default GdnDetails
