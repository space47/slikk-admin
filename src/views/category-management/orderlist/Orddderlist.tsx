import { useEffect, useMemo, useRef } from 'react'
import Badge from '@/components/ui/Badge'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'

import {
    setSelectedRows,
    addRowItem,
    removeRowItem,
    setDeleteMode,
    setSelectedRow,
    getOrders,
    setTableData,
    useAppDispatch,
    useAppSelector,
} from '@/views/sales/OrderList/store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import dayjs from 'dayjs'
import type {
    DataTableResetHandle,
    //     OnSortParam,
    ColumnDef,
    //     Row,
} from '@/components/shared/DataTable'

type Orderlisting = {
    invoiceId: string
    orderDate: string
    mobileNumber: string
    customerName: string
    storeCode: string
    rating: number
    paymentMode: string
    totalItems: number
    orderTotal: number
    status: string
    lastUpdate: string
}

// const orderStatusColor: Record<
//     number,
//     {
//         label: string
//         dotClass: string
//         textClass: string
//     }
// > = {
//     0: {
//         label: 'Paid',
//         dotClass: 'bg-emerald-500',
//         textClass: 'text-emerald-500',
//     },
//     1: {
//         label: 'Pending',
//         dotClass: 'bg-amber-500',
//         textClass: 'text-amber-500',
//     },
//     2: { label: 'Failed', dotClass: 'bg-red-500', textClass: 'text-red-500' },
// }

const InvoiceIdCol = ({ row }: { row: Orderlisting }) => {
    const navigate = useNavigate()
    const onView = () => {
        navigate(`/app/sales/order-details/${row.invoiceId}`)
    }

    return (
        <span
            className={`cursor-pointer select-none font-semibold `}
            onClick={onView}
        >
            #{row.invoiceId}
        </span>
    )
}

const Orddderlist = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const data = useAppSelector((state) => state.salesOrderList.data.orderList)
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.salesOrderList.data.tableData,
    )

    useEffect(() => {
        if (tableRef) {
            tableRef.current?.resetSelected()
        }
    }, [data])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total],
    )

    // columns..............................................................

    const columns: ColumnDef<Orderlisting>[] = [
        {
            header: 'Invoice Id',
            accessorKey: 'invoiceId',
            cell: (props) => {
                const row = props.row.original
                ;<InvoiceIdCol row={row} />
            },
        },
        {
            header: 'Order Date',
            accessorKey: 'orderDate',
        },
        {
            header: 'Mobile Number',
            accessorKey: 'mobileNumber',
        },
        {
            header: 'Customer Name',
            accessorKey: 'customerName',
        },
        {
            header: 'Store Code',
            accessorKey: 'storeCode',
        },
        {
            header: 'Rating',
            accessorKey: 'rating',
        },
        {
            header: 'Payment Mode',
            accessorKey: 'paymentMode',
        },
        {
            header: 'Total Items',
            accessorKey: 'totalItems',
        },
    ]

    const onPaginationChange = () => {}

    const onSelectChange = () => {}

    const onSort = () => {}

    const onRowSelect = () => {}

    const onAllRowSelect = () => {}

    return (
        <div>
            Orddderlist
            {/* Datatable */}
            <DataTable
                ref={tableRef}
                columns={columns}
                data={data}
                pagingData={{
                    total: tableData.total as number,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
                onCheckBoxChange={onRowSelect}
                onIndeterminateCheckBoxChange={onAllRowSelect}
            />
        </div>
    )
}

export default Orddderlist
