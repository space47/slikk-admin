/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { NotificationData } from '@/store/types/notification.types'
import moment from 'moment'
import { Button, Pagination, Select } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import EasyTable from '@/common/EasyTable'
import { pageSizeOptions } from '@/views/org-management/sellers/sellerCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { FaEdit } from 'react-icons/fa'
import AccessDenied from '@/views/pages/AccessDenied'

const NotificationTable = () => {
    const navigate = useNavigate()
    const [notificationData, setNotificationData] = useState<NotificationData[]>([])
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [totalCount, setTotalCount] = useState<number>(0)
    const [globalFilter, setGlobalFilter] = useState<string>()
    const [accessDenied, setAccessDenied] = useState(false)

    const fetchNotificationData = async () => {
        try {
            let filterData = ''
            if (globalFilter) {
                filterData = `&event_name=${globalFilter}`
            }
            const response = await axioisInstance.get(`/notifications/config?p=${page}&page_size=${pageSize}${filterData}`)
            const data = response?.data?.data
            setNotificationData(data?.results)
            setTotalCount(data?.count)
        } catch (error: any) {
            if (error?.response && error?.response?.status === 403) {
                setAccessDenied(true)
            }
            console.error(error)
        }
    }

    useEffect(() => {
        fetchNotificationData()
    }, [page, pageSize, globalFilter])

    const columns = useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ getValue }: any) => (
                    <span className="">
                        <button onClick={() => hanldeEditNotification(getValue())}>
                            <FaEdit className="text-xl text-blue-700" />
                        </button>
                    </span>
                ),
            },
            { header: 'Title', accessorKey: 'title' },
            { header: 'Event Name', accessorKey: 'event_name' },
            { header: 'Type', accessorKey: 'notification_type' },
            { header: 'Message', accessorKey: 'message' },
            { header: 'Mobile', accessorKey: 'mobile' },
            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }: any) => <span className="">{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Update Date',
                accessorKey: 'update_date',
                cell: ({ getValue }: any) => <span className="">{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Image',
                accessorKey: 'config_data.image_url',
                cell: ({ getValue }) => {
                    console.log('IMAGE DATA', getValue())
                    return <img src={getValue()} alt="product" width="50" />
                },
            },
            {
                header: 'target_page',
                accessorKey: 'config_data.target_page',
            },
            {
                header: 'page_title',
                accessorKey: 'config_data.page_title',
            },
            {
                header: 'notification_title',
                accessorKey: 'config_data.notification_title',
            },
            {
                header: 'body',
                accessorKey: 'config_data.body',
            },
        ],
        [],
    )

    const hanldeEditNotification = (id: number) => {
        navigate(`/app/appsCommuncication/${id}`)
    }

    const handleAddNotification = () => {
        navigate('/app/appSettings/addNotification')
    }

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div className="flex flex-col gap-5">
            {' '}
            <div>
                <div>
                    <input
                        value={globalFilter}
                        placeholder="Search Here.."
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="rounded-md"
                    />
                </div>
                <div className="flex justify-end">
                    <Button variant="new" onClick={handleAddNotification}>
                        Add Config
                    </Button>
                </div>
            </div>
            <EasyTable mainData={notificationData} columns={columns} page={page} pageSize={pageSize} />
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={page}
                    total={totalCount}
                    onChange={onPaginationChange}
                    className="mb-4 md:mb-0"
                />
                <div className="w-full sm:w-auto min-w-[130px]">
                    <Select
                        size="sm"
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => setPageSize(option?.value)}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    )
}

export default NotificationTable
