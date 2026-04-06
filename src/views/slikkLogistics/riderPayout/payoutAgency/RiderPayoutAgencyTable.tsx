import EasyTable from '@/common/EasyTable'
import PageCommon from '@/common/PageCommon'
import { Button, Input } from '@/components/ui'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { riderPayoutService } from '@/store/services/riderPayoutService'
import { PayoutCommercialResponse } from '@/store/types/riderPayout.types'
import { Empty, notification, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { PayoutCommercialColumns } from './payoutAgencyUtils/PayoutCommercialColumns'
import { FaPlus } from 'react-icons/fa'
import PayoutMappingModal from './payoutAgencyUtils/PayoutMappingModal'

const RiderPayoutAgencyTable = () => {
    const [payoutCommercial, setPayoutCommercial] = useState<PayoutCommercialResponse[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchInput, setSearchInput] = useState('')
    const [payoutMapping, setPayoutMapping] = useState(false)

    const commercialCall = riderPayoutService.useGetPayoutCommercialQuery({ page, pageSize, name: searchInput || '' })

    useEffect(() => {
        if (commercialCall.isSuccess && commercialCall.data?.data) {
            setPayoutCommercial(commercialCall?.data?.data?.results)
            setTotalCount(commercialCall?.data?.data?.count)
        }
        if (commercialCall.isError) {
            const errorMessage = getApiErrorMessage(commercialCall.error)
            notification.error({ message: errorMessage })
        }
    }, [commercialCall.isSuccess, commercialCall.isError, commercialCall.data?.data, commercialCall.error])

    const columns = PayoutCommercialColumns()

    return (
        <div className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="w-full md:w-80">
                    <Input
                        value={searchInput}
                        placeholder="🔍 Search by rider name..."
                        onChange={(e) => {
                            setSearchInput(e.target.value)
                            setPage(1)
                        }}
                    />
                </div>
                <div>
                    <Button variant="new" size="sm" icon={<FaPlus />} onClick={() => setPayoutMapping(true)}>
                        Add Payout Mapping
                    </Button>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-4 min-h-[300px]">
                <Spin spinning={commercialCall.isLoading || commercialCall.isFetching}>
                    {commercialCall.isError ? (
                        <div className="flex justify-center items-center h-60 text-red-500">
                            Failed to load payout data. Please try again later.
                        </div>
                    ) : payoutCommercial.length === 0 ? (
                        <div className="flex justify-center items-center h-60">
                            <Empty description="No payout data found" />
                        </div>
                    ) : (
                        <EasyTable overflow mainData={payoutCommercial} page={page} pageSize={pageSize} columns={columns} />
                    )}
                </Spin>
            </div>

            {totalCount > 0 && (
                <>
                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalCount} />
                </>
            )}
            <PayoutMappingModal isOpen={payoutMapping} setIsOpen={setPayoutMapping} refetch={commercialCall.refetch} />
        </div>
    )
}

export default RiderPayoutAgencyTable
