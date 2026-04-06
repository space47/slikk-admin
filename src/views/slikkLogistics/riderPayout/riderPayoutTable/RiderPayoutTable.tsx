/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonPageHeader from '@/common/CommonPageHeader'
import EasyTable from '@/common/EasyTable'
import { Input } from '@/components/ui'
import { riderPayoutService } from '@/store/services/riderPayoutService'
import { RiderPayout } from '@/store/types/riderPayout.types'
import { Spin, Empty } from 'antd'
import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { RiderPayoutColumns } from '../utils/RiderPayoutColumns'
import PageCommon from '@/common/PageCommon'

const RiderPayoutTable = () => {
    const [payoutData, setPayoutData] = useState<RiderPayout[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchInput, setSearchInput] = useState('')

    const payoutCall = riderPayoutService.usePayoutListQuery({
        page,
        pageSize,
        name: searchInput || '',
    })

    useEffect(() => {
        if (payoutCall.isSuccess) {
            const results = payoutCall?.data?.data?.results || []
            const count = payoutCall?.data?.data?.count || 0

            setPayoutData(results)
            setTotalCount(count)
        }
    }, [payoutCall.isSuccess, payoutCall.data])

    const columns = RiderPayoutColumns()

    return (
        <div className="p-4 space-y-4">
            <CommonPageHeader
                label="Rider Payout"
                icon={FaPlus}
                desc="Manage and configure rider payout"
                iconClassName="text-2xl text-green-500"
            />
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
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-4 min-h-[300px]">
                <Spin spinning={payoutCall.isLoading || payoutCall.isFetching}>
                    {payoutCall.isError ? (
                        <div className="flex justify-center items-center h-60 text-red-500">
                            Failed to load payout data. Please try again.
                        </div>
                    ) : payoutData.length === 0 ? (
                        <div className="flex justify-center items-center h-60">
                            <Empty description="No payout data found" />
                        </div>
                    ) : (
                        <EasyTable overflow mainData={payoutData} page={page} pageSize={pageSize} columns={columns} />
                    )}
                </Spin>
            </div>

            {totalCount > 0 && (
                <div className="flex justify-end">
                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalCount} />
                </div>
            )}
        </div>
    )
}

export default RiderPayoutTable
