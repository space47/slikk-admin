/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { ReportQueryData } from './reportCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import { Button, Pagination, Select } from '@/components/ui'
import EasyTable from '@/common/EasyTable'
import { pageSizeOptions } from '@/views/slikkLogistics/taskTracking/TaskCommonType'
import { useNavigate } from 'react-router-dom'
import { FaEdit, FaPlus } from 'react-icons/fa'
import AccessDenied from '@/views/pages/AccessDenied'
import { MdAnalytics } from 'react-icons/md'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'

const GetReportConfiguratiions = () => {
    const [reportQueryData, setReportQueryData] = useState<ReportQueryData[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [accessDenied, setAccessDenied] = useState(false)
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const { debounceFilter } = useDebounceInput({ globalFilter, delay: 500 })
    const navigate = useNavigate()

    useEffect(() => {
        fetchReportApi()
    }, [page, pageSize, debounceFilter])

    const columns = useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ getValue }) => (
                    <button className="border-none bg-none" onClick={() => handleEditQuery(getValue())}>
                        <FaEdit className="text-xl text-blue-600" />
                    </button>
                ),
            },
            { header: 'Name', accessorKey: 'name' },
            { header: 'Display Name', accessorKey: 'display_name' },
            {
                header: 'Value',
                accessorKey: 'value',
                cell: ({ getValue }) => {
                    return (
                        <div className="flex flex-col gap-2 overflow-scroll  h-[120px]">
                            {getValue().map((item, index) => {
                                console.log('items', item.name)
                                return (
                                    <div key={index}>
                                        <p>
                                            <span className="font-bold">Name:</span> {item.name}
                                        </p>
                                        <p>
                                            <span className="font-bold">Query:</span>{' '}
                                            <span className="w-[300px] h-[60px] flex-wrap break-words line-clamp-3">{item.query}</span>
                                        </p>
                                        <p>
                                            <span className="font-bold">Position:</span> {item.position}
                                        </p>
                                        <p>
                                            <span className="font-bold">Display Name:</span> {item.display_name}
                                        </p>
                                        <hr />
                                        <hr />
                                    </div>
                                )
                            })}
                        </div>
                    )
                },
            },
            {
                header: 'Required Fields',
                accessorKey: 'required_fields',
                cell: ({ getValue }) =>
                    Object.entries(getValue()).map(([key, value], index) => {
                        return (
                            <div key={index} className="flex flex-col gap-2">
                                {`${key} :  ${value}`}
                            </div>
                        )
                    }),
            },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }: any) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: ({ getValue }: any) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            { header: 'Last Updated By', accessorKey: 'last_updated_by' },
        ],
        [],
    )

    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
                        <MdAnalytics className="text-2xl text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Report Configurations
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">View, Configure and customize your reports</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mb-4">
                <div>
                    <input
                        type="search"
                        value={globalFilter}
                        className="w-full"
                        placeholder="Search by name"
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>
                <div className="flex ">
                    <Button variant="new" size="sm" icon={<FaPlus />} onClick={handleNewQuery}>
                        Add New Query
                    </Button>
                </div>
            </div>
            <EasyTable mainData={reportQueryData} page={page} pageSize={pageSize} columns={columns} />

            <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    total={totalCount}
                    onChange={onPaginationChange}
                    className="mb-4 md:mb-0"
                />

                <div className="min-w-[130px] flex gap-5">
                    <Select
                        size="sm"
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    )

    async function fetchReportApi() {
        try {
            let searchFilter = ''
            if (debounceFilter) {
                searchFilter = `&name=${debounceFilter}`
            }
            const response = await axioisInstance.get(`/query/config?p=${page}&page_size=${pageSize}${searchFilter}`)
            const data = response?.data?.data
            setReportQueryData(data?.results)
            setTotalCount(data?.count)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
            console.log(error)
        }
    }

    function onSelectChange(value = 0) {
        setPageSize(Number(value))
    }
    function onPaginationChange(page: number) {
        setPage(page)
    }

    function handleNewQuery() {
        navigate(`/app/reportConfigurations/addNew`)
    }
    function handleEditQuery(id: string) {
        navigate(`/app/reportConfigurations/${id}`)
    }
}

export default GetReportConfiguratiions
