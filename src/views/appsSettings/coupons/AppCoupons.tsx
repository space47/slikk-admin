import React, { useEffect, useState } from 'react'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { fetchCoupons } from '@/store/slices/couponSlice/couponSlice'
import { useAppDispatch, useAppSelector } from '@/store'
import { COUPON_STATE, COUPONDATA } from '@/store/types/coupons.types'
import Spinner from '@/components/ui/Spinner'
import { ImSpinner9 } from 'react-icons/im'
import { FaEdit } from 'react-icons/fa'
import AccessDenied from '@/views/pages/AccessDenied'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import EasyTable from '@/common/EasyTable'

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

const AppCoupons = () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [loading, setLoading] = useState(false)
    const [accessDenied, setAccessDenied] = useState(false)
    const [couponsData, setCouponsData] = useState<COUPONDATA>([])
    const [totalPages, setTotalPages] = useState(0)
    const navigate = useNavigate()

    const fetchCouponsData = async () => {
        try {
            let couponCode = ''
            if (globalFilter) {
                couponCode = `&coupon_code=${globalFilter}`
            }

            setLoading(true)
            const response = await axioisInstance.get(`/merchant/coupon?p=${page}&page_size=${pageSize}${couponCode}`)
            const data = response?.data?.data
            setTotalPages(data?.count)
            if (globalFilter) {
                setCouponsData([data])
            } else {
                setCouponsData(data?.results)
            }
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCouponsData()
    }, [page, pageSize, globalFilter])

    const columns = [
        { header: 'Code', accessorKey: 'code' },
        {
            header: 'Image',
            accessorKey: 'image',
            cell: ({ getValue }) => (getValue() ? <img src={getValue()} alt="coupon" width="50" /> : 'N/A'),
        },
        { header: 'Type', accessorKey: 'type' },
        { header: 'Value', accessorKey: 'value' },
        { header: 'Min Cart Value', accessorKey: 'min_cart_value' },
        { header: 'Max Count', accessorKey: 'max_count' },
        { header: 'Maximum Price', accessorKey: 'maximum_price' },
        {
            header: 'Valid From',
            accessorKey: 'valid_from',
            cell: ({ getValue }) => moment(getValue()).format('YYYY-MM-DD'),
        },
        {
            header: 'Valid To',
            accessorKey: 'valid_to',
            cell: ({ getValue }) => moment(getValue()).format('YYYY-MM-DD'),
        },
        {
            header: 'Description',
            accessorKey: 'description',
            cell: ({ getValue }) => {
                return (
                    <div className="w-[200px] h-[70px] overflow-hidden">
                        <div className="text-ellipsis whitespace-normal line-clamp-3" dangerouslySetInnerHTML={{ __html: getValue() }} />
                    </div>
                )
            },
        },
        { header: 'Max Count Per User', accessorKey: 'max_count_per_user' },
        { header: 'Coupon Used Count', accessorKey: 'coupon_used_count' },
        { header: 'Frequency', accessorKey: 'frequency' },

        { header: 'Coupon Discount Type', accessorKey: 'coupon_discount_type' },

        {
            header: 'Edit',
            accessorKey: 'code',
            cell: ({ getValue }) => {
                console.log('Row data:', getValue()) // Check if row.original contains 'code'
                return (
                    <Button onClick={() => handleActionClick(getValue())} className="bg-none border-none">
                        <FaEdit className="text-xl text-blue-600 items-center flex justify-center" />
                    </Button>
                )
            },
        },
    ].filter((column) => column.header && column.accessorKey)

    const handleActionClick = (coupon_code: string) => {
        console.log('clicked', coupon_code)
        navigate(`/app/appSettings/coupons/${coupon_code}`)
    }

    const handleCoupons = () => {
        navigate(`/app/appSettings/coupons/addNew`)
    }

    if (accessDenied === true) {
        return <AccessDenied />
    }

    return (
        <div>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <Spinner size={40} indicator={ImSpinner9} />
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center mb-10">
                        <input
                            type="text"
                            placeholder="Search here"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="p-2 border rounded"
                        />
                        <button
                            className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700 order-first xl:order-none font-bold"
                            onClick={handleCoupons}
                        >
                            Add Coupons
                        </button>
                    </div>

                    <EasyTable mainData={couponsData} columns={columns} page={page} pageSize={pageSize} />

                    <div className="flex items-center justify-between mt-4">
                        {/* <Pagination currentPage={pageS} total={totalPages} onChange={(page) => setPage(page)} /> */}
                        <Pagination pageSize={pageSize} currentPage={page} total={totalPages} onChange={(page) => setPage(page)} />
                        <div className="min-w-[130px]">
                            <Select<Option>
                                size="sm"
                                isSearchable={false}
                                value={pageSizeOptions.find((option) => option.value === pageSize)}
                                options={pageSizeOptions}
                                onChange={(option) => setPageSize(Number(option?.value))}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default AppCoupons
