/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { Button, Card, FormItem, Input } from '@/components/ui'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { purchaseOrderService } from '@/store/services/purchaseOrderService'
import { PurchaseOrderItem, PurchaseOrderTable } from '@/store/types/po.types'
import { notification, Spin } from 'antd'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useOrderItemColumns } from '../poUtils/useOrderItemColumns'
import PageCommon from '@/common/PageCommon'
import LoadingSpinner from '@/common/LoadingSpinner'
import { usePoDetailUi } from './usePoDetailUi'
import DialogConfirm from '@/common/DialogConfirm'
import { FaDownload } from 'react-icons/fa'
import { usePoDetailFunction } from './usePoDetailFunction'
import { IndianStateCodes } from '../poUtils/poFormCommon'
import { FiClock, FiFileText, FiMail } from 'react-icons/fi'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { isValidEmail } from '@/common/allTypesCommon'

const trimmedValue = (value: string) => {
    return value
        .split(',')
        .map((email) => email)
        .filter(Boolean)
        .join(',')
}

const PoDetail = () => {
    const { purchase_id } = useParams()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [count, setCount] = useState(0)
    const [purchaseDetail, setPurchaseDetail] = useState<PurchaseOrderTable>()
    const [lineItems, setLineItems] = useState<PurchaseOrderItem[]>([])
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((state) => state.company.currCompany)
    const { data, isSuccess, isError, isLoading, error } = purchaseOrderService.usePurchaseSingleOrdersListQuery({
        order_id: purchase_id,
        company_id: selectedCompany?.id,
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

    const [isDownloading, setIsDownloading] = useState(false)
    const StateFromId = useMemo(
        () => IndianStateCodes?.find((item) => item.value?.toString() === purchaseDetail?.state_code)?.label,
        [purchaseDetail],
    )
    const [isApproveConfirm, setIsConfirmApprove] = useState(false)
    const [verifyPo, verifyResponse] = purchaseOrderService.useVerifyPoMutation()
    const [emailValues, setEmailValues] = useState('')

    const { handleDownloadPo } = usePoDetailFunction({ id: Number(purchase_id), setIsDownloading })

    useEffect(() => {
        if (isSuccess) setPurchaseDetail((data?.data as any)?.results[0])
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

    useEffect(() => {
        if (verifyResponse.isSuccess) {
            notification.success({ message: verifyResponse?.data?.message || 'Successfully Approved' })
            setIsConfirmApprove(false)
        }
        if (verifyResponse.isError) {
            const message = getApiErrorMessage(verifyResponse.error) || 'Failed to Approve'
            notification.error({ message })
        }
    }, [verifyResponse.isSuccess, verifyResponse.isError])

    const { WarehouseData, ButtonUI, OrderInformation, statusConfig } = usePoDetailUi({
        purchaseDetail: purchaseDetail as PurchaseOrderTable,
        handleApprove,
    })

    const columns = useOrderItemColumns({})

    function handleApprove() {
        setIsConfirmApprove(true)
    }

    function handleApproveConfirm() {
        if (emailValues && !isValidEmail(emailValues)) {
            notification.error({ message: 'please enter a valid email address' })
            return
        }

        const body = { id: Number(purchase_id), status: 'APPROVED', ...(emailValues && { emails: trimmedValue(emailValues) }) }
        verifyPo(body)
    }

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="mt-5 flex flex-col gap-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:justify-between">
                <div className="bg-white border rounded-xl shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100">
                                <FiFileText className="text-lg" />
                                <span className="font-semibold tracking-wide">PO-{purchaseDetail?.id}</span>
                            </div>
                            <div
                                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full border ${statusConfig.style}`}
                            >
                                {statusConfig.icon}
                                {purchaseDetail?.status}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-5">
                        <FiClock />
                        <span>
                            Created on{' '}
                            <span className="font-medium text-gray-700">
                                {moment(purchaseDetail?.created_at).format('DD MMM YYYY, hh:mm A')}
                            </span>
                        </span>
                    </div>
                    {StateFromId && <div className="mt-1 border-t pt-4 text-sm text-gray-700">{StateFromId}</div>}
                </div>

                {WaitStatus && <div>{ButtonUI()}</div>}
            </div>
            <div>{WarehouseData()}</div>
            <div className="flex xl:flex-row md:flex-row flex-col  gap-4 w-full items-stretch">
                <div className="flex-1">{OrderInformation()}</div>
            </div>
            <Card className="p-2 shadow-xl">
                {lineItems?.length && !isLoading ? (
                    <Spin spinning={itemsLoading || itemsFetching}>
                        <div className="mt-2 mb-5 flex justify-between">
                            <h4>Line Items</h4>
                            <Button variant="blue" size="sm" icon={<FaDownload />} onClick={handleDownloadPo} loading={isDownloading}>
                                Download
                            </Button>
                        </div>
                        <EasyTable overflow columns={columns} mainData={lineItems} page={page} pageSize={pageSize} />
                        <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
                    </Spin>
                ) : (
                    <>
                        <NotFoundData />
                    </>
                )}
                {isApproveConfirm && (
                    <DialogConfirm
                        IsConfirm
                        IsOpen={isApproveConfirm}
                        headingName={`Approve purchase order: PO-${purchase_id}`}
                        label="this action to approve the purchase Order"
                        closeDialog={() => setIsConfirmApprove(false)}
                        onDialogOk={handleApproveConfirm}
                    >
                        <div className="w-full max-w-md">
                            <FormItem label="Email Recipients">
                                <div className="mt-4">
                                    {/* Info Card */}
                                    <div className="flex items-start gap-3 p-4 mb-3 rounded-2xl bg-blue-50 border border-blue-100">
                                        <FiMail className=" text-2xl" />

                                        <p className="text-sm text-blue-900 leading-relaxed">
                                            By default, emails will be sent to the <span className="font-medium">Head</span> and
                                            <span className="font-medium"> POC contact</span>. You can add additional recipients below if
                                            required.
                                        </p>
                                    </div>

                                    {/* Email Input */}
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                                            <FiMail className="h-5 w-5" />
                                        </span>

                                        <Input
                                            value={emailValues}
                                            placeholder="Enter additional email (comma separated)"
                                            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 bg-white shadow-sm 
                       focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                       transition-all duration-200"
                                            onChange={(e) => setEmailValues(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 mt-1">Add multiple emails separated by commas.</p>
                            </FormItem>
                        </div>
                    </DialogConfirm>
                )}
            </Card>
        </div>
    )
}

export default PoDetail
