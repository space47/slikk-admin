/* eslint-disable @typescript-eslint/no-explicit-any */
import AdaptableCard from '@/components/shared/AdaptableCard'
import { createColumnHelper } from '@tanstack/react-table'
import { NumericFormat } from 'react-number-format'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'
import EasyTable from '@/common/EasyTable'
import ReturnCancelOrder from './ReturnCancelOrder'
import { useState } from 'react'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import RescheduleModal from './RescheduleModal'
import { Button } from '@/components/ui'
import QcDetailsModal from './QcDetailsModal'

const columnHelper = createColumnHelper<any>()

const ProductColumn = ({ row }: { row: any }) => {
    return (
        <div className="flex gap-8 justify-center flex-col xl:flex-row">
            <img src={row.product.image.split(',')[0]} className=" xl:mt-3 w-[100px] h-[120px]" />
            <div className="ltr:ml-2 rtl:mr-2">
                <div className="mb-2 text-[18px] font-bold ">
                    Brand Name:
                    <h4 className="font-light text-[16px] flex-wrap">{row.product.brand}</h4>
                </div>
                <div className="mb-2 text-[18px] font-bold ">
                    Product Name:
                    <h4 className="font-light text-[16px] flex-wrap">{row.product.name}</h4>
                </div>
                <h4 className="font-light text-[14px]">SKU: {row.product.sku}</h4>
            </div>
        </div>
    )
}

const PriceAmount = ({ amount }: { amount: number }) => {
    return <NumericFormat displayType="text" value={(Math.round(amount * 100) / 100).toFixed(2)} prefix={'Rs.'} thousandSeparator={true} />
}

interface props {
    task_id: any
}

const ReturnProductsDetails = ({ task_id }: props) => {
    const returnOrder = useAppSelector<ReturnOrderState>((state) => state.returnOrders)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const returnOrderId = returnOrder?.returnOrders?.return_order_id
    const returnProducts = returnOrder?.returnOrders?.return_order_items.map((item) => item) || []
    const [isReschedule, setIsReschedule] = useState(false)
    const [isQcDetails, setIsQcDetails] = useState(false)
    const navigate = useNavigate()

    const columns = [
        columnHelper.accessor('order_item', {
            header: 'Order Item',
            cell: (props) => {
                const row = props.row.original
                return <ProductColumn row={row} />
            },
        }),
        columnHelper.accessor('quantity', {
            header: 'Quantity',
        }),
        columnHelper.accessor('location', {
            header: 'Location',
        }),

        columnHelper.accessor('return_amount', {
            header: 'Return Amount',
            cell: (props) => {
                const row = props.row.original
                return <PriceAmount amount={row.return_amount} />
            },
        }),
        columnHelper.accessor('return_reason', {
            header: 'Return Reason',
            cell: (props) => {
                const row = props.row.original
                return <div>{row.return_reason}</div>
            },
        }),
        columnHelper.accessor('', {
            header: 'Qc Details',
            cell: () => {
                return (
                    <div onClick={() => setIsQcDetails(true)}>
                        {task_id ? <Button variant="accept">Qc Details</Button> : 'No Task Id Created'}
                    </div>
                )
            },
        }),
    ]

    const handleCancelOrder = () => {
        setShowCancelModal(true)
    }
    const handleCloseModal = () => {
        setShowCancelModal(false)
    }

    const handleCancelReturn = async () => {
        const body = {
            action: 'cancel_return_order',
        }
        try {
            const response = await axioisInstance.patch(`/merchant/return_order/${returnOrderId}`, body)
            notification.success({
                message: response?.data?.data?.message || 'Successfully Cancelled',
            })
            navigate(0)
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to cancel Return Order',
            })
        } finally {
            setShowCancelModal(false)
        }
    }

    return (
        <AdaptableCard className="mb-4 py-3">
            <EasyTable noPage overflow mainData={returnProducts} columns={columns} />

            {returnProducts?.length > 0 ? (
                <div className="flex justify-end mr-7 ">
                    <div className="flex gap-3">
                        <div>
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 w-1/2 md:w-auto"
                                onClick={handleCancelOrder}
                            >
                                CANCEL
                            </button>
                        </div>
                        <div>
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 w-1/2 md:w-auto"
                                onClick={() => setIsReschedule(true)}
                            >
                                Reschedule
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                ''
            )}

            {showCancelModal && (
                <>
                    <ReturnCancelOrder
                        showCancelModal={showCancelModal}
                        handleCancelReturn={handleCancelReturn}
                        handleCloseModal={handleCloseModal}
                    />
                </>
            )}
            {isReschedule && <RescheduleModal isReschedule={isReschedule} setIsReschedule={setIsReschedule} />}
            {isQcDetails && <QcDetailsModal dialogIsOpen={isQcDetails} setIsOpen={setIsQcDetails} task_id={task_id} />}
        </AdaptableCard>
    )
}

export default ReturnProductsDetails
