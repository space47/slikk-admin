/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { FaEdit } from 'react-icons/fa'

interface DataItem {
    id: number
    name: string
    description: string
    image: string
    footer: string
    quick_filter_tags: string
    seo_tags: string
    position: number
    is_active: boolean
    create_date: string
    update_date: string
    last_updated_by: string
}

type Option = {
    value: number
    label: string
}

const { Tr, Th, Td, THead, TBody } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' }
]

const DivisionTable = () => {
    const [data, setData] = useState<DataItem[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('division')
            const data = response.data.data
            const total = data.length
            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // Apply global filter
    const filteredData = data.filter((item) =>
        Object.values(item).some((val) =>
            val
                ? val
                      .toString()
                      .toLowerCase()
                      .includes(globalFilter.toLowerCase())
                : false
        )
    )

    const navigate = useNavigate()

    const handleActionClick = (id: any) => {
        navigate(`/app/category/division/${id}`)
    }

    const handleSeller = () => {
        navigate('/app/category/division/addNew')
    }

    // Paginate filtered data
    const paginatedData = filteredData.slice(
        (page - 1) * pageSize,
        page * pageSize
    )
    const totalPages = Math.ceil(filteredData.length / pageSize)

    const columns = [
        { header: 'Name', accessor: 'name' },
        {
            header: 'Create Date',
            accessor: 'create_date',
            format: (value) => moment(value).format('YYYY-MM-DD')
        },
        { header: 'Title', accessor: 'title' },
        { header: 'Description', accessor: 'description' },
        {
            header: 'Image',
            accessor: 'image',
            format: (value) => {
                console.log('ValueData', value)
                return <img src={value} alt="product" width="50" />
            }
        },
        { header: 'Footer', accessor: 'footer' },
        { header: 'Quick Filter Tags', accessor: 'quick_filter_tags' },
        { header: 'Position', accessor: 'position' },
        { header: 'Gender', accessor: 'gender' },
        {
            header: 'Active',
            accessor: 'is_active',
            format: (value) => (value ? 'Yes' : 'No')
        },
        {
            header: 'Update Date',
            accessor: 'update_date',
            format: (value) => moment(value).format('YYYY-MM-DD')
        },
        {
            header: 'Try and Buy',
            accessor: 'is_try_and_buy',
            format: (value) => (value ? 'Yes' : 'No')
        },
        { header: 'Last Updated By', accessor: 'last_updated_by' },
        {
            header: 'Action',
            accessor: 'id',
            format: (value) => (
                <button
                    onClick={() => handleActionClick(value)}
                    className="border-none bg-none"
                >
                    <FaEdit className="text-xl" />
                </button>
            )
        }
    ]

    return (
        <div>
            {/* <div className="flex items-end justify-end mb-2">
                <button
                    className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                    onClick={handleSeller}
                >
                    ADD NEW DISISION
                </button>{' '}
                <br />
                <br />
            </div> */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search here"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="p-2 border rounded"
                />
            </div>
            <Table>
                <THead>
                    <Tr>
                        {columns.map((col) => (
                            <Th key={col.header}>{col.header}</Th>
                        ))}
                    </Tr>
                </THead>
                <TBody>
                    {paginatedData.map((row) => (
                        <Tr key={row.id}>
                            {columns.map((col) => (
                                <Td key={col.accessor}>
                                    {col.format
                                        ? col.format(row[col.accessor])
                                        : row[col.accessor]}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    currentPage={page}
                    total={totalPages}
                    onChange={(page) => setPage(page)}
                />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find(
                            (option) => option.value === pageSize
                        )}
                        options={pageSizeOptions}
                        onChange={(option) =>
                            setPageSize(Number(option?.value))
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default DivisionTable
