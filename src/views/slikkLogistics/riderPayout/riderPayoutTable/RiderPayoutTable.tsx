/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonPageHeader from '@/common/CommonPageHeader'
import EasyTable from '@/common/EasyTable'
import { Button, Input, Tabs } from '@/components/ui'
import { riderPayoutService } from '@/store/services/riderPayoutService'
import { RiderPayout } from '@/store/types/riderPayout.types'
import { Spin, Empty } from 'antd'
import React, { useEffect, useState } from 'react'
import { FaMoneyBillWave, FaPlus, FaProjectDiagram, FaTasks } from 'react-icons/fa'
import { RiderPayoutColumns } from '../utils/RiderPayoutColumns'
import PageCommon from '@/common/PageCommon'
import { useLocation, useNavigate } from 'react-router-dom'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import RiderPayoutAgencyTable from '../payoutAgency/RiderPayoutAgencyTable'

const RiderPayoutTable = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { payout_search } = location.state || {}
    const [payoutData, setPayoutData] = useState<RiderPayout[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalCount, setTotalCount] = useState(0)
    const [searchInput, setSearchInput] = useState('')
    const [type, setType] = useState<'payout' | 'mapping' | string>('payout')

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

    useEffect(() => {
        if (payout_search) {
            setSearchInput(payout_search)
            setType('payout')
            setPage(1)
            navigate(location.pathname, { replace: true, state: {} })
        }
    }, [location])

    const columns = RiderPayoutColumns()

    return (
        <div className="p-4 space-y-4">
            <CommonPageHeader
                label="Rider Payout"
                icon={FaTasks}
                desc="Manage and configure rider payout"
                iconClassName="text-2xl text-green-500"
            />

            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                <Tabs value={type} onChange={(val) => setType(val)}>
                    <TabList className="flex gap-3">
                        {/* Payout Tab */}
                        <TabNav
                            value="payout"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                text-gray-600 dark:text-gray-300
                hover:bg-emerald-50 hover:text-emerald-600
                dark:hover:bg-emerald-950 dark:hover:text-emerald-400
                data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm
                dark:data-[state=active]:bg-emerald-900 dark:data-[state=active]:text-emerald-300"
                        >
                            <FaMoneyBillWave className="text-base" />
                            Payout Table
                        </TabNav>

                        {/* Mapping Tab */}
                        <TabNav
                            value="mapping"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                text-gray-600 dark:text-gray-300
                hover:bg-rose-50 hover:text-rose-600
                dark:hover:bg-rose-950 dark:hover:text-rose-400
                data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 data-[state=active]:shadow-sm
                dark:data-[state=active]:bg-rose-900 dark:data-[state=active]:text-rose-300"
                        >
                            <FaProjectDiagram className="text-base" />
                            Agency Payout Mapping
                        </TabNav>
                    </TabList>
                </Tabs>
            </div>

            {type === 'payout' && (
                <>
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
                            <Button variant="new" size="sm" icon={<FaPlus />} onClick={() => navigate(`/app/riderPayout/add`)}>
                                Add Payout
                            </Button>
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
                            <PageCommon
                                page={page}
                                pageSize={pageSize}
                                setPage={setPage}
                                setPageSize={setPageSize}
                                totalData={totalCount}
                            />
                        </div>
                    )}
                </>
            )}
            {type === 'mapping' && <RiderPayoutAgencyTable />}
        </div>
    )
}

export default RiderPayoutTable
