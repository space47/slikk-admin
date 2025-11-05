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
import { FaSync } from 'react-icons/fa'
import TransferDetailsTable from './TransferDetailsTable'
import { Button, Spinner } from '@/components/ui'
import { AxiosError } from 'axios'

const TransferDetails = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>([])
    const { document_number } = useParams()
    const [showSyncModal, setShowSyncModal] = useState(false)
    const [isSyncing, setIsSyncing] = useState<string>('')
    const [grnNumber, setGrnNumber] = useState('')
    console.log(grnNumber)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axioisInstance.get(`/internal/inventory-transfer/detail?document_number=${document_number}`)

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
            document_number: document_number,
        }
        setShowSyncModal(false)
        setIsSyncing('sync')

        try {
            await axioisInstance.post(`/internal/inventory-transfer/sync`, body)
            notification.success({
                message: 'Success',
                description: 'Transfer synced successfully',
            })
        } catch (error) {
            console.error(error)
            notification.error({
                message: 'FAILURE',
                description: 'Transfer sync Failed',
            })
        } finally {
            setIsSyncing('')
            navigate(-1)
        }
    }

    const handleCreateGrn = async () => {
        const body = {
            inventory_transfer_id: data?.id,
            force_create: true,
        }
        setIsSyncing('create')

        try {
            await axioisInstance.post(`/internal/inventory-transfer/grn/creation`, body)
            notification.success({
                message: 'Success',
                description: 'GRN created successfully',
            })
            navigate(-1)
        } catch (error) {
            console.error(error)
            if (error instanceof AxiosError) {
                notification.error({
                    message: 'FAILURE',
                    description: error.response?.data?.message || 'GRN creation Failed',
                })
            }
        } finally {
            setIsSyncing('')
        }
    }

    const handleCloseModal = () => {
        setShowSyncModal(false)
    }

    return (
        <Container className="h-full">
            <Loading loading={loading}>
                {!isEmpty(data) && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <div className="mb-6">
                                <div className="flex flex-col  mb-2">
                                    <div>
                                        <h3>
                                            <span>Transfer Details:</span>
                                            {/* <span className="ltr:ml-2 rtl:mr-2">#{data.gdn_number}</span> */}
                                        </h3>
                                        <div className="docs flex flex-col">
                                            <div className="flex gap-2">
                                                {' '}
                                                Document Number : <span className="font-bold">{data.document_number}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span className="flex items-center">
                                    <HiOutlineCalendar className="text-lg" />
                                    <span className="ltr:ml-1 rtl:mr-1">{moment(data.created_at).format('MM/DD/YYYY hh:mm:ss a')}</span>
                                </span>
                            </div>
                            <div>
                                <Button variant="solid" size="sm" onClick={handleCreateGrn} disabled={isSyncing === 'create'}>
                                    <span>Create GRN</span>
                                    <span>{isSyncing === 'create' && <Spinner size={24} color="white" />}</span>
                                </Button>
                            </div>
                        </div>
                        <div className="xl:flex gap-6 p-6 bg-gray-50 rounded-lg shadow-lg">
                            {/* Address Card Section */}
                            <div className="flex-1 bg-white rounded-lg shadow-md p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Store Details</h3>
                                <div className="text-gray-600">
                                    <p className="mb-2">
                                        <span className="font-medium text-gray-800">Store Name:</span> {data?.store?.name || 'N/A'}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800">Contact Number:</span>{' '}
                                        {data?.store?.contactNumber || 'N/A'}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800">POC:</span> {data?.store?.poc || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            {/* ssssssssssssss */}

                            <div className="flex-1 bg-white rounded-lg shadow-md p-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Details</h3>
                                <div className="text-gray-600">
                                    <p className="">
                                        <span className="font-medium text-gray-800">Total Sku Count:</span> {data?.total_sku_count || 'N/A'}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800">Destination Store:</span>{' '}
                                        {data?.destination_store || 'N/A'}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800">Requested By:</span> {data?.requested_by || 'N/A'}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800">Approved By:</span> {data?.approved_by || 'N/A'}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800">Transfer Type:</span> {data?.transfer_type || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-col">
                            {/* TABLE..................................................... */}

                            {isSyncing === 'sync' ? (
                                <>
                                    <Spinner size={30} />
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-end mt-5 text-xl mr-7">
                                        <button
                                            onClick={() => handleSyncClick(data.document_number)}
                                            className="border-none bg-none flex gap-5"
                                        >
                                            {' '}
                                            <div className="flex gap-2 font-bold text-green-600">
                                                SYNC Transfers <FaSync className="text-2xl" />
                                            </div>{' '}
                                        </button>
                                    </div>
                                </>
                            )}
                            {/* <QCtable data={data.grn_quality_check} totalData={data.grn_quality_check.length} /> */}
                            {data?.gdn_products?.length === 0 ? (
                                <>
                                    <div className="flex justify-center items-center text-xl font-bold text-red-700">NO GDN PRODUCTS</div>
                                </>
                            ) : (
                                <TransferDetailsTable />
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
                                <div className="italic text-lg font-semibold">SYNC YOUR Transfer</div>
                            </Modal>
                        )}
                    </>
                )}
            </Loading>
            {!loading && isEmpty(data) && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage src="/img/others/img-2.png" darkModeSrc="/img/others/img-2-dark.png" alt="No GRN found!" />
                    <h3 className="mt-8">No Transfer found!</h3>
                </div>
            )}
        </Container>
    )
}

export default TransferDetails
