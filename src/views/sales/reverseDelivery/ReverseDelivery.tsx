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
    ORDER_STATUS,
    RETURN_ORDERS,
} from '@/views/category-management/orderlist/commontypes'
import type { FilterFn } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import { TbCalendarStats } from 'react-icons/tb'
import { HiOutlineCalendar } from 'react-icons/hi'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { RiEBike2Fill } from 'react-icons/ri'
import { ReturnOrder } from '../returnOrders/ReturnOrders'

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

const ReverseDelivery = () => {
    const [orders, setOrders] = useState<ReturnOrder[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const [page, setPage] = useState(1)
    const navigate = useNavigate()
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [orderCount, setOrderCount] = useState()
    const [dropdownStatus, setDropdownStatus] = useState<
        Record<string, string>
    >(RETURN_ORDERS[0])

    const fetchOrders = async (
        page: number,
        pageSize: number,
        from: string,
        to: string,
    ) => {
        try {
            const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
            const status =
                dropdownStatus?.value === 'ALL'
                    ? ''
                    : `&status=${dropdownStatus?.value}`

            let response
            if (globalFilter) {
                response = await axioisInstance.get(
                    `/merchant/return_orders?return_order_id=${globalFilter}${status}`,
                )
            } else {
                response = await axioisInstance.get(
                    `/merchant/return_orders?p=${page}&page_size=${pageSize}&from=${from}&to=${To_Date}${status}`,
                )
            }

            const ordersData = response?.data?.data.results
            const orderCount = response?.data?.data.count

            setOrders(ordersData)
            setOrderCount(orderCount)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchOrders(page, pageSize, from, to)
    }, [page, pageSize, from, to, dropdownStatus, globalFilter])

    const [partner, setPartner] = useState<{
        [key: string]: { value: string; label: string }
    }>({})
    console.log(
        'Data for Table',
        orders?.map((item) => item),
    )

    console.log('FILTERS', globalFilter)

    const columns = [
        {
            header: 'Return Order Id',
            accessorKey: 'return_order_id',
            cell: ({ row }: { row: { original: ReturnOrder } }) => {
                const referenceId = row.original.return_order_id

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
        { header: 'Mobile Number', accessorKey: 'user.mobile' },
        {
            header: 'Tracking Url',
            accessorKey: 'return_order_delivery[0].tracking_url', // Adjust if you need to access tracking_url from an array
            cell: ({ getValue }: { getValue: () => string }) => {
                const url = getValue()
                return url ? (
                    <a href={url} target="_blank" rel="noreferrer">
                        <div className="flex justify-center">
                            <RiEBike2Fill className="text-xl" />
                        </div>
                    </a>
                ) : null
            },
        },
        { header: 'Delivery Type', accessorKey: 'return_type' },
        { header: 'STATUS', accessorKey: 'status' },
        {
            header: 'Runner Name',
            accessorKey: 'return_order_delivery',
            cell: ({ row }: { row: { original: ReturnOrder } }) => (
                <span>
                    {row.original.return_order_delivery[0]?.runner_name || ''}
                </span>
            ),
        },
        {
            header: 'Runner Number',
            accessorKey: 'return_order_delivery',
            cell: ({ row }: { row: { original: ReturnOrder } }) => (
                <span>
                    {row.original.return_order_delivery[0]
                        ?.runner_phone_number || ''}
                </span>
            ),
        },
        {
            header: 'Pickup Time',
            accessorKey: 'return_order_delivery',
            cell: ({ row }: { row: { original: ReturnOrder } }) => {
                const deliveryCreatedLog =
                    row.original.return_order_delivery[0]?.log?.find(
                        (logEntry: any) =>
                            logEntry.status === 'DELIVERY_CREATED',
                    )

                return deliveryCreatedLog ? (
                    <div>
                        {moment(deliveryCreatedLog.timestamp).format(
                            'YYYY-MM-DD hh:mm:ss a',
                        )}
                    </div>
                ) : null
            },
        },
        {
            header: 'Drop Time',
            accessorKey: 'return_order_delivery',
            cell: ({ row }: { row: { original: ReturnOrder } }) => {
                const deliveryCreatedLog =
                    row.original.return_order_delivery[0]?.log?.find(
                        (logEntry: any) => logEntry.status === 'DELIVERED',
                    )

                return deliveryCreatedLog ? (
                    <div>
                        {moment(deliveryCreatedLog.timestamp).format(
                            'YYYY-MM-DD hh:mm:ss a',
                        )}
                    </div>
                ) : null
            },
        },
        {
            header: 'AWB Code',
            accessorKey: 'return_order_delivery',
            cell: ({ row }: { row: { original: ReturnOrder } }) => (
                <span>
                    {row.original.return_order_delivery[0]?.awb_code || ''}
                </span>
            ),
        },
        {
            header: 'Partner',
            accessorKey: 'return_order_delivery[0].partner',
            cell: ({ row }: { row: { original: ReturnOrder } }) => {
                const selectedPartner =
                    partner[row.id]?.label ||
                    row.original.return_order_delivery[0]?.partner

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
            accessorKey: 'return_order_delivery[0].partner',
            cell: ({
                row,
                getValue,
            }: {
                row: { original: ReturnOrder }
                getValue: () => string
            }) => (
                <Button
                    size="sm"
                    onClick={() =>
                        handleCreateTask(
                            partner[row.id],
                            getValue(),
                            row.original.order,
                        )
                    }
                >
                    Create Task
                </Button>
            ),
        },
        {
            header: 'Cancel Task',
            accessorKey: 'order',
            cell: ({ row }: { row: { original: ReturnOrder } }) => (
                <Button
                    size="sm"
                    onClick={() => handleCancelTask(row.original.order)}
                >
                    Cancel Task
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
        pageCount: Math.ceil(orderCount ?? 0 / pageSize),
        globalFilterFn: fuzzyFilter,
    })

    const handleCancelTask = async (invoce_id: any) => {
        console.log('Id', invoce_id)

        try {
            await axioisInstance.patch(`logistic/cancel/order/${invoce_id}`)
            notification.success({
                message: 'success',
                description: 'Order successfully cancelled',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failure',
                description: 'Failed to cancel order',
            })
        }
    }

    const handleInvoiceClick = (invoiceId: string) => {
        navigate(`/app/orders/${invoiceId}`)
    }

    // const handleRemove = (return_id: any) => {
    //     navigate(`/app/returnOrders/${return_id}`)
    // }

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const handleFromChange = (date: Date | null) => {
        setFrom(
            date
                ? moment(date).format('YYYY-MM-DD')
                : moment().format('YYYY-MM-DD'),
        )
    }

    const handleToChange = (date: Date | null) => {
        setTo(
            date
                ? moment(date).format('YYYY-MM-DD')
                : moment().format('YYYY-MM-DD'),
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
        setDropdownStatus({
            value: a,
            name: RETURN_ORDERS.find((item) => item.value == a)?.name || '',
        })
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
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="mb-4 lg:mb-0">
                        <div className="text-sm md:text-base">
                            SEARCH BY INVOICE_ID
                        </div>
                        <input
                            type="text"
                            placeholder="Search here"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="p-2 border rounded mt-1 w-full"
                        />
                    </div>

                    {/* <div className="mb-4 lg:mb-0">
                        <div className="text-sm md:text-base">
                            SEARCH BY MOBILE
                        </div>
                        <input
                            type="text"
                            placeholder="Search through mobile"
                            value={mobileFilter}
                            onChange={(e) =>
                                dispatch(setMobileFilter(e.target.value))
                            }
                            className="p-2 border rounded mt-1 w-full"
                        />
                    </div> */}
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
                        onChange={(option) => setPageSize(option?.value)}
                        className="w-full flex justify-end"
                    />
                </div>
            </div>
        </div>
    )
}

export default ReverseDelivery

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta(itemRank)
    return itemRank.passed
}
