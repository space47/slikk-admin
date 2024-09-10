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
import { COUPON_STATE } from '@/store/types/coupons.types'
import Spinner from '@/components/ui/Spinner'
import { ImSpinner9 } from 'react-icons/im'

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
    const [loading, setLoading] = useState(true)

    const { coupons } = useAppSelector<COUPON_STATE>((state) => state.coupon)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchCoupons())
        setLoading(false)
    }, [dispatch])

    const filteredData = coupons.filter((item) =>
        Object.values(item).some((val) =>
            val
                ? val
                      .toString()
                      .toLowerCase()
                      .includes(globalFilter.toLowerCase())
                : false,
        ),
    )

    const navigate = useNavigate()

    // Paginate filtered data
    const paginatedData = filteredData.slice(
        (page - 1) * pageSize,
        page * pageSize,
    )
    const totalPages = Math.ceil(filteredData.length / pageSize)

    const columns = [
        { header: 'Code', accessor: 'code' },
        {
            header: 'Image',
            accessor: 'image',
            format: (value) =>
                value ? <img src={value} alt="coupon" width="50" /> : 'N/A',
        },
        { header: 'Type', accessor: 'type' },
        { header: 'Value', accessor: 'value' },
        { header: 'Min Cart Value', accessor: 'min_cart_value' },
        { header: 'Max Count', accessor: 'max_count' },
        { header: 'Maximum Price', accessor: 'maximum_price' },
        {
            header: 'Valid From',
            accessor: 'valid_from',
            format: (value) => moment(value).format('YYYY-MM-DD'),
        },
        {
            header: 'Valid To',
            accessor: 'valid_to',
            format: (value) => moment(value).format('YYYY-MM-DD'),
        },
        { header: 'Description', accessor: 'description' },
        { header: 'Max Count Per User', accessor: 'max_count_per_user' },
        { header: 'Coupon Used Count', accessor: 'coupon_used_count' },
        { header: 'Frequency', accessor: 'frequency' },
        // { header: 'Frequency Config', accessor: 'freq_config' },
        { header: 'Coupon Discount Type', accessor: 'coupon_discount_type' },
        { header: 'User', accessor: 'user' },
        {
            header: 'Edit',
            accessor: 'coupon_discount_type',
            format: (value, row) => (
                <Button onClick={() => handleActionClick(value)}>EDIT</Button>
            ),
        },
    ]

    const handleActionClick = (coupon_type: string) => {
        console.log('clicked', coupon_type)
        navigate(`/app/appSettings/coupons/${coupon_type}`)
    }

    const handleCoupons = () => {
        navigate(`/app/appSettings/coupons/addNew`)
    }

    return (
        <div>
            {loading ? (
                <div>
                    <Spinner size={40} indicator={ImSpinner9} />
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <input
                            type="text"
                            placeholder="Search here"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="p-2 border rounded"
                        />
                        <button
                            className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                            onClick={handleCoupons}
                        >
                            Add Coupons
                        </button>
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
                                <Tr key={row.code}>
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
                        <div className="min-w-[130px]">
                            <Select<Option>
                                size="sm"
                                isSearchable={false}
                                value={pageSizeOptions.find(
                                    (option) => option.value === pageSize,
                                )}
                                options={pageSizeOptions}
                                onChange={(option) =>
                                    setPageSize(Number(option?.value))
                                }
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default AppCoupons
