/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import Container from '@/components/shared/Container'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import { HiOutlineCalendar } from 'react-icons/hi'
import isEmpty from 'lodash/isEmpty'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useParams, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { Modal, notification } from 'antd'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { FaDownload, FaSync } from 'react-icons/fa'
import CustomerInfo from '@/views/inventory-management/inward/inwardDetails/components/CustomerInfo'
import { Select } from '@/components/ui'
import GDNdetailTable from './GDNdetailTable'
import { AxiosError } from 'axios'
// import { string } from 'yup'

const options = [
    { label: 'PDF', value: 'pdf' },
    { label: 'CSV', value: 'csv' },
]

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
    const [selectValue, setSelectValue] = useState<string | undefined>('')

    console.log(grnNumber)

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
            company: id,
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

    const handleCreateShipment = async () => {
        try {
            const res = await axioisInstance.get(`/goods/dispatch/shipment/create/${data?.id}`)
            notification.success({ message: res?.data?.message || 'Shipment created successfully from GDN' })
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to create shipment from GDN',
                })
            }
        }
    }

    const handleRegenerateGrn = async (doc_number: string) => {
        try {
            let responseData = `/goods/dispatch/${id}/detail?download=true&regenerate=true&document_number=${doc_number}`
            if (selectValue === 'csv') {
                responseData += `&download_type=csv`
            }

            const response = await axioisInstance.get(responseData)

            if (selectValue === 'csv') {
                // Handle CSV response directly as raw text data
                const csvText = response?.data // Assuming the response contains raw CSV data
                const blob = new Blob([csvText], { type: 'text/csv' })

                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `${data.gdn_number}-${moment().format('YYYY-MM-DD_HH-mm-ss')}.csv`

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
                link.download = `${data.gdn_number}-${moment().format('YYYY-MM-DD_HH-mm-ss')}.pdf`

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
            <Loading loading={loading}>
                {!isEmpty(data) && (
                    <>
                        <div className="mb-6">
                            <div className="flex flex-col  mb-2">
                                <div className="flex gap-4">
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
                                        </div>
                                    </div>

                                    {/*  */}
                                    <div>
                                        <button
                                            onClick={() => handleRegenerateGrn(data.document_number)}
                                            className="flex gap-2 bg-gray-200 p-2 rounded-xl text-black hover:bg-gray-300 font-bold items-center justify-center"
                                        >
                                            <span className="font-bold">Export</span> <FaDownload className="" />
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            onClick={handleCreateShipment}
                                            className="flex gap-2 bg-gray-200 p-2 rounded-xl text-black hover:bg-gray-300 font-bold items-center justify-center"
                                        >
                                            Create Shipment from GDN
                                        </button>
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

                                    <div className="p-2 rounded-lg bg-gray-200">
                                        <button
                                            onClick={() => handleRegenerateGrn(data.document_number)}
                                            className="border-none bg-none flex gap-5"
                                        >
                                            {' '}
                                            <div className="flex gap-2 font-bold text-gray-600">
                                                Export <FaDownload className="text-2xl" />
                                            </div>{' '}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={() => handleSyncClick(data.grn_number)} className="border-none bg-none flex gap-5">
                                        {' '}
                                        <div className="flex gap-2 font-bold text-green-600">
                                            SYNC GDN <FaSync className="text-2xl" />
                                        </div>{' '}
                                    </button>
                                </div>
                            </div>
                            <br />
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
                                <div className="italic text-lg font-semibold">Are you sure you want to sync this GDN?</div>
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
