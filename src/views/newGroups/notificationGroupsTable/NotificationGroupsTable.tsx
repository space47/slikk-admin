/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Tabs } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EasyTable from '@/common/EasyTable'
import AccessDenied from '@/views/pages/AccessDenied'
import { handleDownloadCsv } from '@/common/allTypesCommon'
import { useGroupColumns } from '@/views/sales/groupNotification/getGroup/groupUtils/useGroupColumns'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import ActiveInactiveModal from '@/views/appsSettings/careers/careerDetails/ActiveInactiveModal'
import { MdGroups2 } from 'react-icons/md'
import { FaPlus } from 'react-icons/fa'
import PageCommon from '@/common/PageCommon'
import { useFetchApi } from '@/commonHooks/useFetchApi'

const GetGroupNotification = () => {
    const navigate = useNavigate()
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [downloadSpinner, setDownloadSpinner] = useState(false)
    const [isActive, setIsActive] = useState('true')
    const [showModalForActive, setShowModalForActive] = useState(false)
    const [checkActive, setCheckActive] = useState(false)
    const [forActive, setForActive] = useState('')

    const query = useMemo(() => {
        return `/notification/groups?p=${page}&page_size=${pageSize}&is_active=${isActive}`
    }, [page, pageSize, isActive])

    const { data: groupData, totalData: totalCount, refetch, responseStatus, loading } = useFetchApi<any>({ url: query, initialData: [] })

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

    if (responseStatus === 403) {
        return <AccessDenied />
    }

    return (
        <div className="flex flex-col gap-8 p-4 md:p-6">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl shadow-lg">
                            <MdGroups2 className="text-2xl text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">User Cohorts</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">
                                Create, track, and analyze user segments with powerful cohort insights
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end items-center">
                    <Button variant="new" icon={<FaPlus />} onClick={handleAddVariant}>
                        Create New Cohort
                    </Button>
                </div>
            </div>
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 ">
                <Tabs defaultValue="true" onChange={(e: string) => setIsActive(e)}>
                    <TabList className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-slate-900">
                        <TabNav
                            value="true"
                            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md data-[state=active]:bg-white data-[state=active]:dark:bg-slate-800 data-[state=active]:text-blue-600 data-[state=active]:dark:text-blue-400 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:dark:border-gray-700"
                        >
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            Active
                        </TabNav>
                        <TabNav
                            value="false"
                            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md data-[state=active]:bg-white data-[state=active]:dark:bg-slate-800 data-[state=active]:text-rose-600 data-[state=active]:dark:text-rose-400 data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:dark:border-gray-700"
                        >
                            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                            Inactive
                        </TabNav>
                    </TabList>
                </Tabs>
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600">Loading inventory data...</p>
                    </div>
                )}
                <div className="p-6">
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <EasyTable mainData={tableData} columns={columns} />
                    </div>

                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalCount} />
                </div>
            </div>
            {showModalForActive && (
                <ActiveInactiveModal
                    refetch={refetch}
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
