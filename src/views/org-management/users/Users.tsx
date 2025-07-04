/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Dropdown, Input } from '@/components/ui'
import { HiSearch } from 'react-icons/hi'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'

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

const SEARCHOPTIONS = [
    { value: 'mobile', label: 'Mobile' },
    { value: 'name', label: 'Name' },
]

const Seller = () => {
    const navigate = useNavigate()
    const [data, setData] = useState<User[]>([])
    const [totalData, setTotalData] = useState()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [accessDenied, setAccessDenied] = useState(false)
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [searchOnEnter, setSearchOnEnter] = useState('')

    useEffect(() => {
        const abortController = new AbortController()
        const fetchData = async () => {
            try {
                let filterParam = ''
                if (globalFilter) {
                    currentSelectedPage?.value === 'name'
                        ? (filterParam = `name=${globalFilter}`)
                        : currentSelectedPage?.value === 'mobile'
                          ? (filterParam = `mobile=${globalFilter}`)
                          : ''
                }

                const response = await axiosInstance.get(`company/${selectedCompany.id}/users?${filterParam}`)
                const data = response.data.data
                const total = response.data.data.length
                if (globalFilter && currentSelectedPage?.value === 'mobile') {
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

        return () => {
            abortController.abort()
        }
    }, [page, pageSize, selectedCompany.id, searchOnEnter, currentSelectedPage])

    const paginatedData = data?.slice((page - 1) * pageSize, page * pageSize)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>, setSearchOnEnter: any) => {
        setSearchOnEnter(e.target.value)
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
                    <Button onClick={() => navigate(`/app/users/edit/${row?.original?.mobile}`)} className="bg-none border-none">
                        <FaEdit className="text-xl text-blue-600" />
                    </Button>
                ),
            },
        ],
        [],
    )

    return (
        <div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-md mb-7">
                    <Input
                        type="search"
                        name="search"
                        placeholder="Search here..."
                        value={globalFilter}
                        className="w-[150px] xl:w-[250px] rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 focus:outline-none focus:ring focus:ring-blue-500"
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                handleSearch(e, setSearchOnEnter)
                            }
                        }}
                    />
                    <div className="bg-blue-500 hover:bg-blue-400 p-2 rounded-xl cursor-pointer">
                        <HiSearch
                            className="text-white  dark:text-gray-400 text-xl"
                            onClick={() => {
                                setSearchOnEnter(globalFilter)
                            }}
                        />
                    </div>
                    <div className="flex justify-center xl:justify-normal">
                        <div className="bg-gray-100 flex justify-center font-bold items-center xl:mt-1  xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white">
                            <Dropdown
                                className=" text-xl text-black bg-gray-200 font-bold  "
                                title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                onSelect={(e) => {
                                    const selected = SEARCHOPTIONS.find((item) => item.value === e)
                                    if (selected) {
                                        setCurrentSelectedPage(selected)
                                    }
                                }}
                            >
                                {SEARCHOPTIONS?.map((item, key) => {
                                    return (
                                        <DropdownItem key={key} eventKey={item.value}>
                                            <span>{item.label}</span>
                                        </DropdownItem>
                                    )
                                })}
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="flex items-end justify-end mb-4 order-first xl:order-none">
                    <button
                        className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
                        onClick={() => navigate('/app/users/addNew')}
                    >
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
                        <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={(page) => setPage(page)} />
                        <div style={{ minWidth: 130 }}>
                            <Select<Option>
                                size="sm"
                                isSearchable={false}
                                value={pageSizeOptions.find((option) => option.value === pageSize)}
                                options={pageSizeOptions}
                                onChange={(option) => {
                                    setPage(1)
                                    setPageSize(Number(option?.value))
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Seller
