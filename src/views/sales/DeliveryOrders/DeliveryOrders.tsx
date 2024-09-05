/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import moment from 'moment'
import Button from '@/components/ui/Button'
import {
    Table,
    Pagination,
    Select,
    DatePicker,
    Dropdown,
} from '@/components/ui'
import {
    fetchOrders,
    setDropdownStatus,
    setGlobalFilter,
    setPageSize,
    setPage,
    setFrom,
    setTo,
} from '@/store/slices/orderList/OrderList'
import { OrderState } from '@/store/types/orderList.types'
import { ORDER_STATUS } from '@/views/category-management/orderlist/commontypes'
import type { FilterFn } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import { TbCalendarStats } from 'react-icons/tb'
import { HiOutlineCalendar } from 'react-icons/hi'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useAppDispatch, useAppSelector } from '@/store'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const LOGISTIC_PARTNER = [
    { value: 'porter', label: 'PORTER' },
    { value: 'shiprocket', label: 'SHIPROCKET' },
    { value: 'shadowfax', label: 'SHADOWFAX' },
    { value: 'slikk', label: 'SLIKK' },
]

const OrderList = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {
        orders,
        orderCount,
        page,
        pageSize,
        globalFilter,
        from,
        to,
        dropdownStatus,
    } = useAppSelector<OrderState>((state) => state.order)

    useEffect(() => {
        dispatch(fetchOrders())
    }, [dispatch, page, pageSize, from, to, dropdownStatus, globalFilter])

    const [partner, setPartner] = useState<{
        [key: string]: { value: string; label: string }
    }>({})
    console.log(
        'Data for Table',
        orders.map((item) => item),
    )

    const columns = [
        {
            header: 'Order Invoice Id',
            accessorKey: 'invoice_id',
            cell: ({ row }: any) => {
                const referenceId = row.original?.invoice_id

                return referenceId ? (
                    <div
                        className="text-white bg-red-600 flex items-center justify-center py-1 rounded-[7px] font-semibold cursor-pointer"
                        onClick={() => handleInvoiceClick(referenceId)}
                    >
                        {referenceId}
                    </div>
                ) : (
                    ''
                )
            },
        },
        // {
        //     header: 'Return Invoide Id',
        //     accessorKey: 'return_order',
        //     cell: ({ row }: any) => {
        //         const returnOrderArray = row.original?.return_order
        //         const returnOrder = returnOrderArray?.find((item: any) => item)
        //         console.log('ReturnOrder', returnOrder)
        //         const returnOrderId = returnOrder?.return_order_id

        //         return returnOrderId ? (
        //             <div
        //                 className="text-white bg-red-600 flex items-center justify-center py-1 rounded-[7px] font-semibold cursor-pointer"
        //                 onClick={() => handleRemove(returnOrderId)}
        //             >
        //                 {returnOrderId}
        //             </div>
        //         ) : (
        //             ''
        //         )
        //     },
        // },
        { header: 'Store', accessorKey: 'store.address' },
        { header: 'Customer Name', accessorKey: 'user.name' },
        { header: 'Mobile Number', accessorKey: 'user.mobile' },
        { header: 'Runner Name', accessorKey: 'logistic.runner_name' },
        {
            header: 'Runner Number',
            accessorKey: 'logistic.runner_phone_number',
        },
        { header: 'Pickup Time', accessorKey: 'logistic.pickup_time' },
        { header: 'Drop Time', accessorKey: 'logistic.drop_time' },
        { header: 'AWB Code', accessorKey: 'logistic.awb_code' },
        {
            header: 'Eta Pickup',
            accessorKey: 'logistic.eta_pickup',
            cell: ({ getValue }: any) => (
                <span>
                    {getValue()
                        ? moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')
                        : ''}
                </span>
            ),
        },
        { header: 'Eta drop_off', accessorKey: 'logistic.eta_dropoff' },
        {
            header: 'Partner',
            accessorKey: 'logistic.partner',
            cell: ({ row }: any) => {
                const selectedPartner =
                    partner[row.id]?.label || row.original?.logistic?.partner

                return (
                    <Dropdown
                        className="w-full px-4 py-2 text-xl text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                        title={selectedPartner || 'SELECT'}
                        onSelect={(value) => handlePartnerSelect(value, row)}
                    >
                        <div className="max-h-60 overflow-y-auto">
                            {LOGISTIC_PARTNER.map((item, key) => (
                                <DropdownItem
                                    key={key}
                                    eventKey={item.value}
                                    className="px-2 py-2 text-black hover:bg-gray-100 cursor-pointer"
                                >
                                    <span>{item.label}</span>
                                </DropdownItem>
                            ))}
                        </div>
                    </Dropdown>
                )
            },
        },
        {
            header: 'Assigned Logistic',
            accessorKey: 'logistic.partner',
            cell: ({ row, getValue }: any) => (
                <Button
                    size="sm"
                    onClick={() =>
                        handleCreateTask(
                            partner[row.id],
                            getValue(),
                            row.original.invoice_id,
                        )
                    }
                >
                    Create Task
                </Button>
            ),
        },
    ]

    const table = useReactTable({
        data: orders,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(orderCount / pageSize),
        globalFilterFn: fuzzyFilter,
    })

    const handleInvoiceClick = (invoiceId: string) => {
        navigate(`/app/orders/${invoiceId}`)
    }

    const handleRemove = (return_id: any) => {
        navigate(`/app/returnOrders/${return_id}`)
    }

    const onPaginationChange = (page: number) => {
        dispatch(setPage(page))
    }

    const handleFromChange = (date: Date | null) => {
        dispatch(
            setFrom(
                date
                    ? moment(date).format('YYYY-MM-DD')
                    : moment().format('YYYY-MM-DD'),
            ),
        )
    }

    const handleToChange = (date: Date | null) => {
        dispatch(
            setTo(
                date
                    ? moment(date).format('YYYY-MM-DD')
                    : moment().format('YYYY-MM-DD'),
            ),
        )
    }

    const handlePartnerSelect = (selectedValue: any, row: any) => {
        console.log('VALUE', selectedValue, row)
        const selectedLabel =
            LOGISTIC_PARTNER.find((item) => item.value === selectedValue)
                ?.label || ''

        setPartner((prev) => ({
            ...prev,
            [row.id]: { value: selectedValue, label: selectedLabel },
        }))
    }

    const handleDropdownSelect = (a: any) => {
        console.log('Values', a)
        dispatch(
            setDropdownStatus({
                value: a,
                name: ORDER_STATUS.find((item) => item.value == a)?.name || '',
            }),
        )
    }

    console.log('PPPPPPPPPP', partner)

    const handleCreateTask = async (
        partner: any,
        logistic_partner: any,
        order_id: any,
    ) => {
        console.log('TASK', partner?.label, order_id, logistic_partner)

        try {
            const body = {
                action: 'PACKED',
                delivery_partner: partner?.value
                    ? partner?.value
                    : logistic_partner,
            }
            const response = await axioisInstance.patch(
                `/merchant/order/${order_id}`,
                body,
            )

            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Created Task Successfully',
            })
        } catch (error) {
            console.error(error)
            notification.error({
                message: 'Failure',
                description: 'Failed to create Task',
            })
        }
    }

    console.log('ssssssswddwdwdw', dropdownStatus)
    return (
        <div className="overflow-x-auto">
            <div className="flex flex-col lg:flex-row lg:justify-between mb-10 items-center gap-4">
                <div className="w-full lg:w-auto mb-4 lg:mb-0">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        onChange={(e) =>
                            dispatch(setGlobalFilter(e.target.value))
                        }
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 items-center justify-between w-full lg:w-auto">
                    <div className="relative w-full lg:w-auto bg-gray-100 flex justify-center">
                        <Dropdown
                            className="w-full lg:w-50 px-4 py-2 text-base lg:text-xl text-black bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                            title={dropdownStatus.name}
                            onSelect={handleDropdownSelect}
                        >
                            <div className="max-h-60 overflow-y-auto">
                                {ORDER_STATUS?.map((item, key) => (
                                    <DropdownItem
                                        key={key}
                                        eventKey={item.value}
                                        className="px-2 py-2 text-black hover:bg-gray-100 cursor-pointer"
                                    >
                                        <span>{item.name}</span>
                                    </DropdownItem>
                                ))}
                            </div>
                        </Dropdown>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 lg:gap-5">
                        <div>
                            <div className="mb-1 font-semibold text-sm text-center sm:text-left">
                                FROM DATE:
                            </div>
                            <DatePicker
                                inputPrefix={
                                    <HiOutlineCalendar className="text-lg" />
                                }
                                defaultValue={new Date()}
                                value={new Date(from)}
                                onChange={handleFromChange}
                            />
                        </div>
                        <div>
                            <div className="mb-1 font-semibold text-sm text-center sm:text-left">
                                TO DATE:
                            </div>
                            <DatePicker
                                inputSuffix={
                                    <TbCalendarStats className="text-xl" />
                                }
                                defaultValue={new Date()}
                                value={moment(to).subtract(1, 'days').toDate()}
                                onChange={handleToChange}
                                minDate={moment(from).toDate()}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            className={
                                                header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : ''
                                            }
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            <Sorter
                                                sort={header.column.getIsSorted()}
                                            />
                                        </div>
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    total={orderCount}
                    onChange={onPaginationChange}
                />
                <div className="w-full sm:w-auto min-w-[130px]">
                    <Select
                        size="sm"
                        value={pageSizeOptions.find(
                            (option) => option.value === pageSize,
                        )}
                        options={pageSizeOptions}
                        onChange={(option) =>
                            dispatch(setPageSize(option?.value))
                        }
                        className="w-full flex justify-end"
                    />
                </div>
            </div>
        </div>
    )
}

export default OrderList

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta(itemRank)
    return itemRank.passed
}
