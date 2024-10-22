import React, { useEffect, useState, useMemo } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { FaEdit } from 'react-icons/fa'
import EasyTable from '@/common/EasyTable'
import { Option, pageSizeOptions, Product } from './sellerCommon'

const Seller = () => {
    const [data, setData] = useState<Product[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')

    const fetchData = async (page: number, pageSize: number) => {
        try {
            const filterValue = globalFilter ? `&name=${globalFilter}` : ''
            const response = await axiosInstance.get(`merchant/company?p=${page}&page_size=${pageSize}${filterValue}`)
            const data = response.data.data.results
            const total = response.data.data.count
            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData(page, pageSize)
    }, [page, pageSize, globalFilter])

    const handleActionClick = (id: number) => {
        navigate(`/app/sellers/${id}`)
    }

    const columns = useMemo<ColumnDef<Product>[]>(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Seller Code',
                accessorKey: 'code',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Registered Name',
                accessorKey: 'registered_name',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Alternate Contact Number',
                accessorKey: 'alternate_contact_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'GSTIN',
                accessorKey: 'gstin',
                cell: (info) => info.getValue(),
            },
            {
                header: 'POC',
                accessorKey: 'poc',
                cell: (info) => info.getValue(),
            },
            {
                header: 'POC Email',
                accessorKey: 'poc_email',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Contact Number',
                accessorKey: 'contact_number',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Address',
                accessorKey: 'address',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },

            {
                header: 'Is Active',
                accessorKey: 'is_active',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },

            {
                header: 'Segment',
                accessorKey: 'segment',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },

            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button onClick={() => handleActionClick(row.original.id)} className="border-none bg-none">
                        <FaEdit className="text-xl text-blue-600" />
                    </button>
                ),
            },
        ],
        [],
    )

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }
    const navigate = useNavigate()

    const handleSeller = () => {
        navigate('/app/sellers/addnew')
    }

    return (
        <div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border rounded"
                    />
                </div>
                <div className="flex items-end justify-end mb-4 order-first xl:order-1">
                    <button className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700" onClick={handleSeller}>
                        ADD NEW SELLER
                    </button>{' '}
                </div>
            </div>
            <EasyTable mainData={data} columns={columns} page={page} pageSize={pageSize} />
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={onPaginationChange} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default Seller
