import EasyTable from '@/common/EasyTable'
import { Button, Pagination, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchLoyalty, setPage, setPageSize } from '@/store/slices/slikkLoyalty/loyalty.slice'
import { LoyaltyType } from '@/store/types/slikkLoyalty'
import { pageSizeOptions } from '@/views/slikkLogistics/taskTracking/TaskCommonType'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type Option = {
    value: number
    label: string
}

const columns = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Tier Condition Type', accessorKey: 'tier_upgrade_condition.type' },
    { header: 'Tier Condition Value', accessorKey: 'tier_upgrade_condition.value' },
    { header: 'Tier Condition Duration', accessorKey: 'tier_upgrade_condition.duration' },
    { header: 'Max Discount', accessorKey: 'max_discount' },
    { header: 'Max Yearly Discount', accessorKey: 'max_yearly_discount' },
    {
        header: 'Tier Upgrade Type',
        accessorKey: 'tier_upgrade_offer',
        cell: ({ getValue }) => {
            const value = getValue()
            return <div>{value?.map((item, key) => <div key={key}>{item.type}</div>)}</div>
        },
    },
    {
        header: 'Tier Upgrade Value',
        accessorKey: 'tier_upgrade_offer',
        cell: ({ getValue }) => {
            const value = getValue()
            return <div>{value?.map((item, key) => <div key={key}>{item.value}</div>)}</div>
        },
    },
    {
        header: 'Tier Condition Discount',
        accessorKey: 'tier_upgrade_offer',
        cell: ({ getValue }) => {
            const value = getValue()
            return <div>{value?.map((item, key) => <div key={key}>{item.max_discount}</div>)}</div>
        },
    },
    {
        header: 'Tier Condition Max Order',
        accessorKey: 'tier_upgrade_offer',
        cell: ({ getValue }) => {
            const value = getValue()
            return <div>{value?.map((item, key) => <div key={key}>{item.max_order_value}</div>)}</div>
        },
    },
    {
        header: 'Tier Condition Min Order',
        accessorKey: 'tier_upgrade_offer',
        cell: ({ getValue }) => {
            const value = getValue()
            return <div>{value?.map((item, key) => <div key={key}>{item.min_order_value}</div>)}</div>
        },
    },
    { header: 'Level', accessorKey: 'level' },
]

const LoyaltyTable = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { loyalty, page, pageSize } = useAppSelector<LoyaltyType>((state) => state.loyalty)
    const totalPages = loyalty.length

    useEffect(() => {
        dispatch(fetchLoyalty())
    }, [dispatch])

    return (
        <div>
            <div className="flex justify-end mb-6">
                <Button variant="new" size="sm" onClick={handleLoyaltyAdd}>
                    ADD LOYALITY
                </Button>
            </div>
            <EasyTable noPage mainData={loyalty} columns={columns} />
            <div className="flex items-center justify-between mt-4">
                <Pagination currentPage={page} total={totalPages} onChange={(page) => setPage(page)} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => setPageSize(Number(option?.value))}
                    />
                </div>
            </div>
        </div>
    )

    function handleLoyaltyAdd() {
        navigate(`/app/loyality/addNew`)
    }
}

export default LoyaltyTable
