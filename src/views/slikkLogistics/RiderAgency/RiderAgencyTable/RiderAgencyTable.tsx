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
import RiderAgencyAction from '../RiderAgencyUtils/RiderAgencyAction'

const RiderAgencyTable = () => {
    const [search, setSearch] = useState('')
    const [agencies, setAgencies] = useState<DeliveryAgency[]>([])
    const [isActive, setIsActive] = useState<'true' | 'false'>('true')
    const [agencyAction, setAgencyAction] = useState<'add' | 'edit' | null>(null)
    const [agencyId, setAgencyId] = useState<number | null>(null)

    const debouncedResults = useMemo(
        () =>
            debounce((value: string) => {
                setSearch(value)
            }, 500),
        [],
    )

    useEffect(() => {
        return () => {
            debouncedResults.cancel()
        }
    }, [debouncedResults])

    const riderAgencyCall = deliveryAgency.useGetDeliveryAgencyQuery({ name: search ?? '', is_active: isActive })

    useEffect(() => {
        if (riderAgencyCall.isSuccess) setAgencies(riderAgencyCall.data.data)
        if (riderAgencyCall.isError) {
            notification.error({ message: (riderAgencyCall.error as any)?.data?.message || 'Something went wrong' })
        }
    }, [riderAgencyCall.isSuccess, riderAgencyCall.isError, riderAgencyCall.data?.data])

    const columns = useRiderAgencyColumn({ setAgencyAction, setStoreId: setAgencyId })

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <TbTruckDelivery className="text-3xl text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Rider Agencies</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage, monitor and control delivery partners</p>
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Input
                    type="search"
                    placeholder="Search agency by name..."
                    className="max-w-xs"
                    onChange={(e) => debouncedResults(e.target.value)}
                />

                <Button variant="new" size="sm" icon={<FaPlus />} onClick={() => setAgencyAction('add')}>
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
                <EasyTable mainData={agencies} columns={columns} />
            </div>
            {agencyAction === 'add' && <RiderAgencyAction isOpen={!!agencyAction} setIsOpen={() => setAgencyAction(null)} />}
            {agencyAction === 'edit' && agencyId && (
                <RiderAgencyAction isEdit agencyId={agencyId} isOpen={!!agencyAction} setIsOpen={() => setAgencyAction(null)} />
            )}
        </div>
    )
}

export default RiderAgencyTable
