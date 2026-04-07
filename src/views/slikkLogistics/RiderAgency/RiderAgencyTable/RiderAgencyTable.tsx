/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { TbTruckDelivery } from 'react-icons/tb'
import { notification } from 'antd'
import EasyTable from '@/common/EasyTable'
import { Button, Input, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import debounce from 'lodash/debounce'
import { deliveryAgency } from '@/store/services/deliveryAgencyService'
import { DeliveryAgency } from '@/store/types/deliveryAgencyTypes'
import { useRiderAgencyColumn } from '../RiderAgencyUtils/useRiderAgencyColumn'
import PageCommon from '@/common/PageCommon'
import { useLocation, useNavigate } from 'react-router-dom'
import CommonPageHeader from '@/common/CommonPageHeader'

const RiderAgencyTable = () => {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const location = useLocation()
    const { agency_search } = location.state || {}
    const [agencies, setAgencies] = useState<DeliveryAgency[]>([])
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [isActive, setIsActive] = useState<'true' | 'false'>('true')

    const debouncedResults = useMemo(
        () =>
            debounce((value: string) => {
                setSearch(value)
            }, 500),
        [],
    )

    useEffect(() => {
        if (agency_search) {
            setSearch(agency_search)
        }
    }, [agency_search])

    useEffect(() => {
        return () => {
            debouncedResults.cancel()
        }
    }, [debouncedResults])

    const riderAgencyCall = deliveryAgency.useGetDeliveryAgencyQuery({ name: search ?? '', is_active: isActive, page, page_size: pageSize })

    useEffect(() => {
        if (riderAgencyCall.isSuccess) {
            setAgencies(riderAgencyCall.data.data?.results)
            setCount(riderAgencyCall.data.data.count)
        }
        if (riderAgencyCall.isError) {
            notification.error({ message: (riderAgencyCall.error as any)?.data?.message || 'Something went wrong' })
        }
    }, [riderAgencyCall.isSuccess, riderAgencyCall.isError, riderAgencyCall.data?.data])

    const columns = useRiderAgencyColumn()

    return (
        <div className="space-y-6">
            <CommonPageHeader
                desc="Manage, monitor and control delivery partners"
                icon={TbTruckDelivery}
                label="Rider Agencies"
                iconClassName="text-3xl text-white"
            />
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Input
                    value={search}
                    type="search"
                    placeholder="Search agency by name..."
                    className="max-w-xs"
                    onChange={(e) => debouncedResults(e.target.value)}
                />

                <Button variant="new" size="sm" icon={<FaPlus />} onClick={() => navigate(`/app/riderAgency/add`)}>
                    Add New Agency
                </Button>
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-3">
                <Tabs value={isActive} onChange={(val: string) => setIsActive(val as 'true' | 'false')}>
                    <TabList className="flex gap-2">
                        <TabNav
                            value="true"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                            data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600
                            dark:data-[state=active]:bg-emerald-950 dark:data-[state=active]:text-emerald-400"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Active
                        </TabNav>

                        <TabNav
                            value="false"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                            data-[state=active]:bg-rose-50 data-[state=active]:text-rose-600
                            dark:data-[state=active]:bg-rose-950 dark:data-[state=active]:text-rose-400"
                        >
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            Inactive
                        </TabNav>
                    </TabList>
                </Tabs>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-4">
                <EasyTable overflow mainData={agencies} columns={columns} page={page} pageSize={pageSize} />
            </div>
            <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
        </div>
    )
}

export default RiderAgencyTable
