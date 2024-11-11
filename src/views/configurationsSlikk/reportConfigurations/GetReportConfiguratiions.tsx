/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { ReportQueryData } from './reportCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import { Button, Pagination, Select } from '@/components/ui'
import EasyTable from '@/common/EasyTable'
import { pageSizeOptions } from '@/views/slikkLogistics/taskTracking/TaskCommonType'
import { useNavigate } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import AccessDenied from '@/views/pages/AccessDenied'

const GetReportConfiguratiions = () => {
    const [reportQueryData, setReportQueryData] = useState<ReportQueryData[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [accessDenied, setAccessDenied] = useState(false)
    const navigate = useNavigate()

    const fetchReportApi = async () => {
        try {
            const response = await axioisInstance.get(`/query/config?p=${page}&page_size=${pageSize}`)
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

    useEffect(() => {
        fetchReportApi()
    }, [page, pageSize])

    const handleEditQuery = (id: string) => {
        navigate(`/app/reportConfigurations/${id}`)
    }

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

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }
    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const handleNewQuery = () => {
        navigate(`/app/reportConfigurations/addNew`)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <Button variant="new" onClick={handleNewQuery}>
                    Add New Query
                </Button>
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
            {accessDenied && (
                <>
                    <AccessDenied />
                </>
            )}
        </div>
    )
}

export default GetReportConfiguratiions
