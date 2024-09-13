/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react'
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
    setCurrentSelectedPage,
    setSearchInput,
    setPageSize,
    setPage,
    setFrom,
    setTo,
    setDeliveryType,
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
import { RiEBike2Fill } from 'react-icons/ri'
import { CiFilter } from 'react-icons/ci'
import FilterDialogOrder from '@/views/category-management/orderlist/filterDialog/FilterDialog'
import FilterForwardDelivery from './filter/FilterForwardDelivery'
import { DELEIVERYOPTIONS } from '@/views/category-management/orderlist/Orderlist'

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

const SEARCHOPTIONS = [
    { label: 'INVOICE', value: 'invoice' },
    { label: 'MOBILE', value: 'mobile' },
    { label: 'AWB', value: 'awb' },
]

const DeliveryOrders = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {
        orders,
        orderCount,
        page,
        pageSize,
        searchInput,
        deliveryType,
        from,
        currentSelectedPage,
        to,
        dropdownStatus,
    } = useAppSelector<OrderState>((state) => state.order)

    useEffect(() => {
        dispatch(fetchOrders())
    }, [
        dispatch,
        page,
        pageSize,
        from,
        to,
        dropdownStatus,
        searchInput,
        deliveryType,
    ])
    // useEffect(() => {
    //     dispatch(fetchOrders())
    // }, [dispatch, page, pageSize, from, to, dropdownStatus, mobileFilter])

    const [showFilter, setShowFilter] = useState(false)

    const [partner, setPartner] = useState<{
        [key: string]: { value: string; label: string }
    }>({})
    console.log(
        'Data for Table',
        orders?.map((item) => item),
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
        { header: 'Mobile Number', accessorKey: 'user.mobile' },
        {
            header: 'Tracking Url',
            accessorKey: 'logistic.tracking_url',
            cell: ({ getValue, row }) => {
                const { partner } = row.original?.logistic || {}
                const { awb_code } = row.original || {}
                const { delivery_type } = row.original || {}

                let trackingUrl

                if (partner === 'shadowfax' && delivery_type === 'STANDARD') {
                    trackingUrl = `https://tracker.shadowfax.in/#/awb/${awb_code}`
                } else if (
                    partner === 'shiprocket' &&
                    delivery_type === 'EXPRESS'
                ) {
                    trackingUrl = `https://shiprocket.co/tracking/${awb_code}`
                } else {
                    trackingUrl = getValue()
                }

                return (
                    <a href={trackingUrl} target="_blank" rel="noreferrer">
                        <div className="flex justify-center">
                            <RiEBike2Fill className="text-xl" />
                        </div>
                    </a>
                )
            },
        },

        { header: 'Delivery Type', accessorKey: 'delivery_type' },
        { header: 'STATUS', accessorKey: 'status' },
        { header: 'Runner Name', accessorKey: 'logistic.runner_name' },
        {
            header: 'Runner Number',
            accessorKey: 'logistic.runner_phone_number',
        },

        {
            header: 'Pickup Time',
            accessorKey: 'log',
            cell: ({ row }: any) => {
                const deliveryCreatedLog = row.original.log.find(
                    (logEntry: any) => logEntry.status === 'DELIVERY_CREATED',
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
            accessorKey: 'log',
            cell: ({ row }: any) => {
                const deliveryCreatedLog = row.original.log.find(
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
        { header: 'AWB Code', accessorKey: 'logistic.awb_code' },
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
        {
            header: 'Cancel Task',
            accessorKey: 'id',
            cell: ({ row, getValue }: any) => (
                <Button
                    size="sm"
                    onClick={() => handleCancelTask(row.original.invoice_id)}
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
        pageCount: Math.ceil(orderCount / pageSize),
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

    const handleSelect = (value: any) => {
        const selected = SEARCHOPTIONS.find((item) => item.value === value)
        if (selected) {
            dispatch(setCurrentSelectedPage(selected))
        }
    }
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchInput(e.target.value))
    }

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

    const handleDeliverySelect = (selectedValue: any) => {
        const selectedOption = DELEIVERYOPTIONS.find(
            (option) => option.value === selectedValue,
        )

        if (selectedOption) {
            dispatch(setDeliveryType(selectedOption))
        }
    }

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
    const handleShowFilter = useCallback(() => {
        setShowFilter(true)
    }, [setShowFilter])

    const handleFilterClose = useCallback(() => {
        setShowFilter(false)
    }, [setShowFilter])

    return (
        <div className="overflow-x-auto">
            <div className="flex flex-row justify-between lg:flex-row lg:justify-between mb-10 items-center gap-4 md:flex-col">
                <div className="flex gap-2">
                    <div className="flex justify-start ">
                        <input
                            type="search"
                            name="search"
                            id=""
                            placeholder="search SKU for product"
                            value={searchInput}
                            className="xl:w-[250px] rounded-[10px] w-[130px]"
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="bg-gray-100   xl:text-md text-sm w-auto rounded-md ">
                        <Dropdown
                            className=" text-xl text-black bg-gray-200 font-bold "
                            title={
                                currentSelectedPage?.value
                                    ? currentSelectedPage.label
                                    : 'SELECT'
                            }
                            onSelect={handleSelect}
                        >
                            {SEARCHOPTIONS?.map((item, key) => {
                                return (
                                    <DropdownItem
                                        key={key}
                                        eventKey={item.value}
                                    >
                                        <span>{item.label}</span>
                                    </DropdownItem>
                                )
                            })}
                        </Dropdown>
                    </div>
                </div>

                <div>
                    <Button
                        variant="new"
                        size="sm"
                        onClick={handleShowFilter}
                        className="hidden xl:flex gap-2"
                    >
                        <CiFilter className="text-xl font-extrabold" /> Filter
                    </Button>

                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleShowFilter}
                        className="flex xl:hidden"
                    >
                        <CiFilter className="text-xl font-extrabold" />
                    </Button>
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
            {showFilter && (
                <FilterForwardDelivery
                    showFilter={showFilter}
                    handleFilterClose={handleFilterClose}
                    dropdownStatus={dropdownStatus}
                    handleDropdownSelect={handleDropdownSelect}
                    handleFromChange={handleFromChange}
                    handleToChange={handleToChange}
                    from={from}
                    to={to}
                    deliveryType={deliveryType}
                    handleDeliverySelect={handleDeliverySelect}
                />
            )}
        </div>
    )
}

export default DeliveryOrders

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta(itemRank)
    return itemRank.passed
}
