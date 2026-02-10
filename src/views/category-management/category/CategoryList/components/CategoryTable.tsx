import { useEffect, useMemo, useRef, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import ReactHtmlParser from 'html-react-parser'
import { getProducts, setTableData, setSelectedProduct, toggleDeleteConfirmation, useAppDispatch, useAppSelector } from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import ProductDeleteConfirmation from './ProductDeleteConfirmation'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import type { DataTableResetHandle, OnSortParam, ColumnDef } from '@/components/shared/DataTable'
import { apiGetAllCategory } from '@/services/SalesService'

type Product = {
    id: string
    name: string
    description: string
    is_active: boolean
    footer: string
}

const inventoryStatusColor: Record<
    number,
    {
        label: string
        dotClass: string
        textClass: string
    }
> = {
    0: {
        label: 'In Stock',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-500',
    },
    1: {
        label: 'Limited',
        dotClass: 'bg-amber-500',
        textClass: 'text-amber-500',
    },
    2: {
        label: 'Out of Stock',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500',
    },
}

const ActionColumn = ({ row }: { row: Product }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onEdit = () => {
        navigate(`/app/category/division-/${row.id}`)
    }

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedProduct(row.id))
    }

    return (
        <div className="flex justify-end text-lg">
            <span className={`cursor-pointer p-2 hover:${textTheme}`} onClick={onEdit}>
                <HiOutlinePencil />
            </span>
            <span className="cursor-pointer p-2 hover:text-red-500" onClick={onDelete}>
                <HiOutlineTrash />
            </span>
        </div>
    )
}

const ProductColumn = ({ row }: { row: Product }) => {
    const avatar = row.img ? <Avatar src={row.img} /> : <Avatar icon={<FiPackage />} />

    return (
        <div className="flex items-center">
            <span className={`ml-2 rtl:mr-2 font-semibold`}>{row.name}</span>
        </div>
    )
}

const CategoryTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const [gridData, setGridData] = useState([])
    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, sort, query, total } = useAppSelector((state) => state.salesProductList.data.tableData)

    const filterData = useAppSelector((state) => state.salesProductList.data.filterData)

    const loading = useAppSelector((state) => state.salesProductList.data.loading)

    // const data = useAppSelector(
    //     (state) => state.salesProductList.data.productList
    // )

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sort])

    useEffect(() => {
        if (tableRef) {
            tableRef.current?.resetSorting()
        }
    }, [filterData])

    const tableData = useMemo(() => ({ pageIndex, pageSize, sort, query, total }), [pageIndex, pageSize, sort, query, total])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        var { data } = await apiGetAllCategory()
        setGridData(data.data)
        //dispatch(getProducts({ pageIndex, pageSize, sort, query, filterData }))
    }

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <ProductColumn row={row} />
                },
            },
            {
                header: 'Footer',
                accessorKey: 'footer',
                cell: (props) => {
                    const { footer } = props.row.original
                    return footer
                },
            },
            {
                header: 'Status',
                accessorKey: 'is_active',
                cell: (props) => {
                    const { is_active } = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <Badge className={is_active ? 'bg-amber-500' : 'bg-emerald-500'} />
                            <span className={`capitalize font-semibold text-amber-500`}>{is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                    )
                },
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: (props) => {
                    const { description } = props.row.original
                    return ReactHtmlParser(description)
                },
            },
            {
                header: 'Division',
                accessorKey: 'division',
                cell: (props) => {
                    const { division } = props.row.original
                    return division
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        [],
    )

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={gridData}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={loading}
                pagingData={{
                    total: tableData.total as number,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
            <ProductDeleteConfirmation />
        </>
    )
}

export default CategoryTable
