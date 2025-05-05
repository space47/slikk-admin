import React, { useEffect, useState, useMemo } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import type { ColumnDef } from '@tanstack/react-table'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { FaEdit } from 'react-icons/fa'
import AccessDenied from '@/views/pages/AccessDenied'
import EasyTable from '@/common/EasyTable'
import { pageSizeOptions } from '../sellers/sellerCommon'
import { AxiosError } from 'axios'

interface User {
    first_name: string
    last_name: string
    email: string
    mobile: string
    country_code: string
    dob: string
    gender: string
    image: string
    date_joined: string
}

type Option = {
    value: number
    label: string
}

const Seller = () => {
    const [data, setData] = useState<User[]>([])
    const [totalData, setTotalData] = useState()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [accessDenied, setAccessDenied] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                let filterParam = ''
                if (globalFilter) {
                    filterParam = `?mobile=${globalFilter}`
                }

                const response = await axiosInstance.get(`company/${selectedCompany.id}/users${filterParam}`)
                const data = response.data.data
                const total = response.data.data.length
                if (globalFilter) {
                    setData([data])
                } else {
                    setData(data)
                }
                setTotalData(total)
                setAccessDenied(false)
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    if (globalFilter.length > 9 && (error?.response?.status === 403 || error?.response?.status === 401)) {
                        setAccessDenied(true)
                    }
                } else {
                    console.error(error)
                }
            }
        }
        fetchData()
    }, [page, pageSize, selectedCompany.id, globalFilter])
    const paginatedData = data?.slice((page - 1) * pageSize, page * pageSize)

    const navigate = useNavigate()

    const handleActionClick = (mobile: string) => {
        navigate(`/app/users/edit/${mobile}`)
    }

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                header: 'Name',
                accessorFn: (row) => `${row.first_name} ${row.last_name}`,
                cell: (info) => info.getValue(),
            },
            {
                header: 'Mobile',
                accessorKey: 'mobile',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ getValue }) => <img src={getValue() as string} alt="User" className="w-12 h-12 object-cover" />,
            },
            {
                header: 'Date Joined',
                accessorKey: 'date_joined',
                cell: ({ getValue }) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
            },
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <Button onClick={() => handleActionClick(row.original.mobile)} className="bg-none border-none">
                        <FaEdit className="text-xl text-blue-600" />
                    </Button>
                ),
            },
        ],
        [],
    )

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPage(1)
        setPageSize(Number(value))
    }

    const handleSeller = () => {
        navigate('/app/users/addNew')
    }
    return (
        <div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="mb-4">
                    <input
                        type="search"
                        placeholder="Search here"
                        value={globalFilter}
                        className="p-2 border rounded"
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>
                <div className="flex items-end justify-end mb-4 order-first xl:order-none">
                    <button className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700" onClick={handleSeller}>
                        ADD NEW USERS
                    </button>{' '}
                </div>
            </div>
            {accessDenied ? (
                <AccessDenied />
            ) : (
                <>
                    <EasyTable mainData={paginatedData} columns={columns} page={page} pageSize={pageSize} />
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
                </>
            )}
        </div>
    )
}

export default Seller
