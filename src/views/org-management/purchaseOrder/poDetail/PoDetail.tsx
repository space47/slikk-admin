import EasyTable from '@/common/EasyTable'
import { Button, Card, Spinner } from '@/components/ui'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { purchaseOrderService } from '@/store/services/purchaseOrderService'
import { PurchaseOrderItem, PurchaseOrderTable } from '@/store/types/po.types'
import { notification } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useOrderItemColumns } from '../poUtils/useOrderItemColumns'
import PageCommon from '@/common/PageCommon'
import LoadingSpinner from '@/common/LoadingSpinner'
import { usePoDetailUi } from './usePoDetailUi'

const PoDetail = () => {
    const { purchase_id } = useParams()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [count, setCount] = useState(0)
    const [purchaseDetail, setPurchaseDetail] = useState<PurchaseOrderTable>()
    const [lineItems, setLineItems] = useState<PurchaseOrderItem[]>([])
    const { data, isSuccess, isError, isLoading, error } = purchaseOrderService.usePurchaseSingleOrdersListQuery({
        order_id: purchase_id,
    })
    const WaitStatus = purchaseDetail?.status?.toLowerCase() === 'created' || purchaseDetail?.status?.toLowerCase() === 'waiting_approval'
    const {
        data: itemsData,
        isSuccess: itemSuccess,
        isError: itemIsError,
        error: itemError,
        isFetching: itemsFetching,
        isLoading: itemsLoading,
    } = purchaseOrderService.useOrderItemsQuery({ purchase_order_id: purchase_id as string, page, pageSize }, { skip: !purchase_id })

    useEffect(() => {
        if (isSuccess) setPurchaseDetail(data?.data)
        if (isError) {
            const message = getApiErrorMessage(error)
            notification.error({ message })
        }
    }, [isSuccess, isError, error, data?.data])

    useEffect(() => {
        if (itemSuccess) {
            setLineItems(itemsData?.data?.results)
            setCount(itemsData?.data?.count)
        }
        if (itemIsError) {
            const message = getApiErrorMessage(itemError) || 'Failed to load'
            notification.error({ message })
        }
    }, [itemSuccess, itemIsError])

    const { ActivityBar, ButtonUI, OrderInformation, VendorInformation } = usePoDetailUi({
        purchaseDetail: purchaseDetail as PurchaseOrderTable,
    })

    const columns = useOrderItemColumns({})

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="mt-5 flex flex-col gap-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:justify-between">
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2 items-center">
                        <h5>PO-{purchaseDetail?.id}</h5>
                        <span className="bg-gray-100 p-2 rounded-xl">{purchaseDetail?.status}</span>
                    </div>
                    <p>Created on {moment(purchaseDetail?.created_at).format('YYYY-MM-DD HH:mm:ss a')}</p>
                </div>
                {WaitStatus && <div>{ButtonUI()}</div>}
                <div>
                    <Button variant="twoTone" color="yellow">
                        Export Pdf
                    </Button>
                </div>
            </div>
            <div>{ActivityBar()}</div>
            <div className="flex xl:flex-row md:flex-row flex-col  gap-4 w-full items-stretch">
                <div className="flex-1">
                    <VendorInformation />
                </div>
                <div className="flex-1">
                    <OrderInformation />
                </div>
            </div>
            <Card className="p-2 shadow-xl">
                <div className="mt-2 mb-5">
                    <h4>Line Items</h4>
                </div>
                {itemsLoading ||
                    (itemsFetching && (
                        <div className="flex items-center justify-between">
                            <Spinner size={30} />
                        </div>
                    ))}
                <EasyTable overflow columns={columns} mainData={lineItems} page={page} pageSize={pageSize} />
                <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
            </Card>
        </div>
    )
}

export default PoDetail
