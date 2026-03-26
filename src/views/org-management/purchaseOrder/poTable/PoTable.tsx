import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { useAppDispatch, useAppSelector } from '@/store'
import { purchaseOrderService } from '@/store/services/purchaseOrderService'
import {
    PURCHASE_STATE,
    setPoList,
    setCount,
    setPage,
    setPageSize,
    setPoStatus,
    setPoSummary,
    setPoFilter,
} from '@/store/slices/purchaseOrderSlice/purchaseOrder.slice'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { notification } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { usePoListColumns } from '../poUtils/usePoListColumns'
import EasyTable from '@/common/EasyTable'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import PageCommon from '@/common/PageCommon'
import { Button, Card, Input, Select, Spinner } from '@/components/ui'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import { PoStatusArray } from '../poUtils/poCommon'
import { useNavigate } from 'react-router-dom'
import { MdOutlineFormatListNumbered } from 'react-icons/md'
import { FaCheck, FaRupeeSign } from 'react-icons/fa'
import { CgLock } from 'react-icons/cg'
import { PurchaseOrderTable } from '@/store/types/po.types'
import PoDownloadModal from '../poUtils/PoDownloadModal'

const PoTable = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [currentData, setCurrentData] = useState<PurchaseOrderTable | null>(null)
    const [showDownloadModal, setShowDownloadModal] = useState(false)
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const { count, page, pageSize, poList, poStatus, poSummary, poFilter } = useAppSelector<PURCHASE_STATE>((state) => state.purchaseOrder)
    const { debounceFilter } = useDebounceInput({ globalFilter: poFilter, delay: 500 })

    const queryParams = useMemo(() => {
        return {
            page,
            pageSize,
            company_id: selectedCompany?.id,
            order_id: debounceFilter?.split('-')?.at(-1),
            ...(poStatus && poStatus !== 'All Status' && { status: poStatus }),
        }
    }, [page, pageSize, selectedCompany, debounceFilter, poStatus])

    const { data, isSuccess, isFetching, isLoading, isError, error } = purchaseOrderService.usePurchaseOrdersListQuery(queryParams, {
        skip: !selectedCompany?.id,
    })

    useEffect(() => {
        if (isSuccess && data?.data) {
            dispatch(setPoList(data.data.results ?? []))
            dispatch(setPoSummary(data?.data?.summary))
            dispatch(setCount(data.data.count ?? 0))
        }

        if (isError) {
            const message = getApiErrorMessage(error)
            notification.error({
                message: message || 'Failed to load purchase orders.',
            })
        }
    }, [poFilter, isSuccess, isError, data, error, dispatch])

    const InputUi = () => {
        return (
            <div className="sticky top-0 bg-white z-10 pb-4 mb-6 border-b border-gray-200">
                <div className="flex gap-2 items-center">
                    <div className="flex flex-col w-full xl:w-[70%] md:w-[70%]">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Search </label>
                        <Input
                            value={poFilter}
                            type="search"
                            placeholder="Search by PO Number"
                            className="rounded-lg"
                            onChange={(e) => dispatch(setPoFilter(e.target.value))}
                        />
                    </div>
                    <div className="flex flex-col w-full xl:w-[50%] md:w-[50%]">
                        <label className="text-sm font-semibold text-gray-700 mb-1">Purchase Order Status</label>
                        <Select
                            isClearable
                            options={PoStatusArray}
                            value={poStatus !== 'All Status' && poStatus ? PoStatusArray.find((item) => item.value === poStatus) : null}
                            placeholder="All Status"
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value?.toString()}
                            className="rounded-lg"
                            onChange={(selected) => {
                                dispatch(setPoStatus(selected?.value || 'All Status'))
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }

    const SummaryUi = () => {
        const SummaryArray = [
            {
                label: 'Total PO',
                value: count || 0,
                icon: <MdOutlineFormatListNumbered className="w-6 h-6 text-blue-600" />,
                bg: 'bg-blue-50',
            },
            {
                label: 'Total Amount',
                value: poSummary?.total_amount || 0,
                icon: <FaRupeeSign className="w-6 h-6 text-blue-600" />,
                bg: 'bg-blue-50',
            },
            {
                label: 'Waiting Approval',
                value: poSummary?.total_waiting || 0,
                icon: <CgLock className="w-6 h-6 text-yellow-600" />,
                bg: 'bg-yellow-50',
            },
            {
                label: 'Approved',
                value: poSummary?.total_approved || 0,
                icon: <FaCheck className="w-6 h-6 text-green-600" />,
                bg: 'bg-green-50',
            },
        ]

        return (
            <div className="w-full flex justify-around mb-6">
                {SummaryArray.map((item, index) => (
                    <Card key={index} className="shadow-sm hover:shadow-md transition-all cursor-pointer">
                        <div className="py-3 px-6 flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${item.bg}`}>{item.icon}</div>
                            <div>
                                <p className="text-sm text-gray-500 font-bold">{item.label}</p>
                                <h2 className="text-xl font-bold text-gray-800">{item.value}</h2>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        )
    }

    const handleDownloadPdf = async (x: PurchaseOrderTable) => {
        setCurrentData(x)
        setShowDownloadModal(true)
    }

    const columns = usePoListColumns({ handleDownloadPdf })

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="h-12 w-12 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
                <p className="mt-4 text-gray-600">Loading Purchase Orders...</p>
            </div>
        )
    }

    return (
        <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-semibold text-gray-800">Purchase Order Dashboard</h4>
                <Button variant="reject" size="sm" onClick={() => navigate(`/app/po/addNew`)}>
                    + Create New
                </Button>
            </div>
            <div>{poSummary && SummaryUi()}</div>
            {InputUi()}
            {isFetching && (
                <div className="flex items-center justify-center my-4">
                    <Spinner size={30} />
                </div>
            )}
            {poList?.length ? (
                <>
                    <EasyTable overflow columns={columns} mainData={poList} page={page} pageSize={pageSize} />
                    <PageCommon
                        dispatch={dispatch}
                        page={page}
                        pageSize={pageSize}
                        setPage={setPage}
                        setPageSize={setPageSize}
                        totalData={count}
                    />
                </>
            ) : (
                <div className="mt-6">
                    <NotFoundData />
                </div>
            )}
            {showDownloadModal && (
                <PoDownloadModal data={currentData as PurchaseOrderTable} isOpen={showDownloadModal} setIsOpen={setShowDownloadModal} />
            )}
        </div>
    )
}

export default PoTable
