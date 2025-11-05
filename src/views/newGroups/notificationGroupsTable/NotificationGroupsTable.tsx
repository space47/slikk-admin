/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Pagination, Select, Tabs } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { pageSizeOptions } from '@/constants/pageUtils.constants'
import EasyTable from '@/common/EasyTable'
import AccessDenied from '@/views/pages/AccessDenied'
import { handleDownloadCsv } from '@/common/allTypesCommon'
import { useGroupColumns } from '@/views/sales/groupNotification/getGroup/groupUtils/useGroupColumns'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import ActiveInactiveModal from '@/views/appsSettings/careers/careerDetails/ActiveInactiveModal'

const GetGroupNotification = () => {
    const navigate = useNavigate()
    const [groupData, setGroupData] = useState<any[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number | undefined>(10)
    const [accessDenied, setAccessDenied] = useState(false)
    const [downloadSpinner, setDownloadSpinner] = useState(false)
    const [isActive, setIsActive] = useState('true')
    const [showModalForActive, setShowModalForActive] = useState(false)
    const [checkActive, setCheckActive] = useState(false)
    const [forActive, setForActive] = useState('')

    const fetchGroupNotification = async () => {
        try {
            const response = await axioisInstance.get(`/notification/groups?p=${page}&page_size=${pageSize}&is_active=${isActive}`)
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
    }, [page, pageSize, isActive])

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
        let userData = groupData?.find((item) => item.id === groupId)?.user || []

        try {
            setDownloadSpinner(true)
            const response = await axioisInstance.get(`/notification/groups/${groupId}`)
            const data = response?.data?.data || {}
            userData = [...userData, ...data.group_users]
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
        navigate(`/app/appsCommuncication/cohorts/add`)
    }

    const handleActiveCareer = (id: number | string, e: React.MouseEvent, checked: boolean) => {
        setForActive(id as string)
        setShowModalForActive(true)
        setCheckActive(checked)
    }

    const tableData = groupData.filter((item: any) => item.is_active.toString() === isActive)

    const columns = useGroupColumns({ handleEditClick, handleDownloadUserCsv, downloadSpinner, handleActiveCareer })

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

            <Tabs defaultValue="true" onChange={(e: string) => setIsActive(e)}>
                <TabList className="flex items-center justify-start gap-4 bg-gray-50 dark:bg-slate-900 dark:rounded-xl  shadow-md p-3 mb-10">
                    <TabNav
                        value="true"
                        className="relative px-4 py-2 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-500 rounded-xl transition-all duration-300 hover:text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        Active
                    </TabNav>
                    <TabNav
                        value="false"
                        className="relative px-4 py-2 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-500 rounded-xl transition-all duration-300 hover:text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        InActive
                    </TabNav>
                </TabList>
            </Tabs>

            <EasyTable mainData={tableData} columns={columns} />
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
            {showModalForActive && (
                <ActiveInactiveModal
                    dialogIsOpen={showModalForActive}
                    setIsOpen={setShowModalForActive}
                    idForUpdate={forActive}
                    isActive={checkActive}
                    url={`/notification/groups/${forActive}`}
                    label="Group"
                />
            )}
        </div>
    )
}

export default GetGroupNotification
