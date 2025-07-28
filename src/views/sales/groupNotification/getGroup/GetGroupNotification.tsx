/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Pagination, Select } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { pageSizeOptions } from './groupComnmon'
import EasyTable from '@/common/EasyTable'
import AccessDenied from '@/views/pages/AccessDenied'
import { handleDownloadCsv } from '@/common/allTypesCommon'
import { useGroupColumns } from './groupUtils/useGroupColumns'
import { notification } from 'antd'
import { AxiosError } from 'axios'

const GetGroupNotification = () => {
    const [groupData, setGroupData] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number | undefined>(10)
    const [accessDenied, setAccessDenied] = useState(false)
    const [downloadSpinner, setDownloadSpinner] = useState(false)

    const navigate = useNavigate()

    const fetchGroupNotification = async () => {
        try {
            const response = await axioisInstance.get(`/notification/groups?p=${page}&page_size=${pageSize}`)
            const data = response?.data?.data
            setGroupData(data?.results)
            setTotalCount(data?.count)
        } catch (error: any) {
            if (error?.response && error?.response?.status === 403) {
                setAccessDenied(true)
            }
            console.log(error)
        }
    }

    useEffect(() => {
        fetchGroupNotification()
    }, [page, pageSize])

    const convertToCSV = (data: any[], columns: any[]) => {
        const header = columns.map((col) => col.header).join(',')
        const rows = data
            .map((row) => {
                return columns
                    .map((col) => {
                        if (col.accessorKey === 'first_name') {
                            return `${row?.first_name}`
                        } else if (col.accessorKey === 'checked_in_status') {
                            return row?.checked_in_status ? 'Yes' : 'No'
                        } else if (col.accessorKey === 'email') {
                            return row?.email
                        } else if (col.accessorKey === 'latitude') {
                            return row?.latitude || ''
                        } else if (col.accessorKey === 'longitude') {
                            return row?.longitude || ''
                        } else if (col.accessorKey === 'mobile') {
                            return row?.mobile
                        } else {
                            return ''
                        }
                    })
                    .join(',')
            })
            .join('\n')
        return `${header}\n${rows}`
    }

    const columnsForCsv = [
        { header: 'First Name', accessorKey: 'first_name' },
        { header: 'Mobile', accessorKey: 'mobile' },
        { header: 'Checked In', accessorKey: 'checked_in_status' },
        { header: 'Email', accessorKey: 'email' },
        { header: 'Latitude', accessorKey: 'latitude' },
        { header: 'Longitude', accessorKey: 'longitude' },
    ]

    const handleDownloadUserCsv = async (groupId: number) => {
        let userData = []
        try {
            setDownloadSpinner(true)
            const response = await axioisInstance.get(`/notification/groups/${groupId}`)
            const data = response?.data?.data
            userData = data?.group_users
            handleDownloadCsv(userData, columnsForCsv, convertToCSV, 'group_users.csv')
            notification.success({ message: 'Download complete' })
        } catch (error) {
            console.error(error)
            if (error instanceof AxiosError) {
                notification.error({
                    message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to download',
                })
            }
        } finally {
            setDownloadSpinner(false)
        }
    }

    const handleEditClick = async (groupId: number) => {
        navigate(`/app/appsCommuncication/editGroups/${groupId}`)
    }

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const handleAddVariant = () => {
        navigate(`/app/appsCommuncication/addGroups`)
    }

    const columns = useGroupColumns({ handleEditClick, handleDownloadUserCsv, downloadSpinner })

    if (accessDenied) {
        return <AccessDenied />
    }
    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-end">
                {' '}
                <Button variant="new" onClick={handleAddVariant}>
                    Add Groups
                </Button>
            </div>
            <EasyTable mainData={groupData} columns={columns} />
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalCount} onChange={onPaginationChange} />
                <div className="w-full sm:w-auto min-w-[130px]">
                    <Select
                        size="sm"
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => setPageSize(option?.value)}
                        className="w-full flex justify-end"
                    />
                </div>
            </div>
        </div>
    )
}

export default GetGroupNotification
