import React, { useEffect, useState } from 'react'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { Modal } from 'antd'
import { IoWarningOutline } from 'react-icons/io5'

type Product = {
    id: number
    name: string
    sub_category_name: string
    title: string
    description: string
    image: string
    footer: string | null
    quick_filter_tags: string
    position: number
    gender: string
    is_active: boolean
    create_date: string
    update_date: string
    is_try_and_buy: boolean
    sub_category: number
    last_updated_by: string | null
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
    { value: 100, label: '100 / page' },
]

const ProductType = () => {
    const [data, setData] = useState<Product[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [deleteModal, setDeleteModal] = useState(false)
    const [idStoreForDelete, setIdStoreForDelete] = useState()

    const fetchData = async () => {
        try {
            const filtervalue = globalFilter ? `&q=${globalFilter}` : ''
            const response = await axiosInstance.get(`product-type?dashboard=true${filtervalue}`)
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
    }, [globalFilter])

    // Apply global filter
    const filteredData = data.filter((item) =>
        Object.values(item).some((val) => (val ? val.toString().toLowerCase().includes(globalFilter.toLowerCase()) : false)),
    )

    // Paginate filtered data
    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize)
    const totalPages = Math.ceil(filteredData.length / pageSize)

    const columns = [
        {
            header: 'Edit',
            accessor: 'id',
            format: (value) => (
                <button className="border-none bg-none">
                    <a href={`/app/category/productType/${value}`}>
                        {' '}
                        <FaEdit className="text-xl text-blue-600" />
                    </a>
                </button>
            ),
        },
        { header: 'Name', accessor: 'name' },
        {
            header: 'Create Date',
            accessor: 'create_date',
            format: (value: moment.MomentInput) => moment(value).format('YYYY-MM-DD'),
        },
        { header: 'Title', accessor: 'title' },
        { header: 'Description', accessor: 'description' },
        {
            header: 'Image',
            accessor: 'image',
            format: (value: string | undefined) => <img src={value} alt="product" width="50" />,
        },
        {
            header: 'Footer',
            accessorKey: 'footer',
            cell: (info) => {
                return (
                    <div className="w-[200px] h-[70px] overflow-hidden">
                        <div
                            className="text-ellipsis whitespace-wrap line-clamp-3 overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: info.getValue() as string }}
                        />
                    </div>
                )
            },
        },
        { header: 'Quick Filter Tags', accessor: 'quick_filter_tags' },
        { header: 'Position', accessor: 'position' },
        { header: 'Gender', accessor: 'gender' },
        {
            header: 'Active',
            accessor: 'is_active',
            format: (value: any) => (value ? 'Yes' : 'No'),
        },
        {
            header: 'Update Date',
            accessor: 'update_date',
            format: (value: moment.MomentInput) => moment(value).format('YYYY-MM-DD'),
        },
        {
            header: 'Try and Buy',
            accessor: 'is_try_and_buy',
            format: (value: any) => (value ? 'Yes' : 'No'),
        },
        { header: 'Last Updated By', accessor: 'last_updated_by' },

        {
            header: 'Delete',
            accessor: 'id',
            format: (value) => (
                <button onClick={() => handleDeleteClick(value)} className="border-none bg-none">
                    <FaTrash className="text-xl text-red-600" />
                </button>
            ),
        },
    ]

    const navigate = useNavigate()

    // const handleActionClick = (id: any) => {
    //     navigate(`/app/category/productType/${id}`)
    // }

    const handleSeller = () => {
        navigate('/app/category/productType/addNew')
    }

    const handleDeleteClick = (id: any) => {
        console.log('DELETE', id)
        setDeleteModal(true)
        setIdStoreForDelete(id)
    }

    const deleteUser = async () => {
        try {
            const body = {
                id: idStoreForDelete,
            }
            await axiosInstance.delete(`product-type`, {
                data: body,
            })
            setDeleteModal(false)
            navigate(0)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCloseModal = () => {
        setDeleteModal(false)
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
                        ADD NEW PRODUCT_TYPE
                    </button>{' '}
                </div>
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
                                <Td key={col.accessor}>{col.format ? col.format(row[col.accessor]) : row[col.accessor]}</Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    currentPage={page}
                    // totalPages={totalPages}
                    onChange={(page) => setPage(page)}
                    total={totalPages}
                />
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
            {deleteModal && (
                <Modal
                    title=""
                    open={deleteModal}
                    onOk={deleteUser}
                    onCancel={handleCloseModal}
                    okText="DELETE"
                    okButtonProps={{
                        style: { backgroundColor: 'red', borderColor: 'red' },
                    }}
                >
                    <div className="italic text-lg flex flex-row items-center justify-start gap-5">
                        <IoWarningOutline className="text-red-600 text-4xl" /> ARE YOU SURE YOU WANT TO DELETE !!
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default ProductType
