/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react'
import Table from '@/components/ui/Table'
import TrackModal from './TrackModal'
import { SEARCHOPTIONS, STATUSARRAY, TaskDetails } from './TaskCommonType'
import { useNavigate } from 'react-router-dom'
import AccessDenied from '@/views/pages/AccessDenied'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import moment from 'moment'
import { Button } from '@/components/ui'
import FilterByRunner from './FilterByRunner'
import { TaskTrackingColumns } from './taskUtils/TaskTrakingColumns'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { AxiosError } from 'axios'
import { errorMessage } from '@/utils/responseMessages'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { commonDownload } from '@/common/commonDownload'
import { notification } from 'antd'
import PageCommon from '@/common/PageCommon'
import { FaDownload, FaFilter } from 'react-icons/fa'
import DropDownCommon from '@/common/DropDownCommon'

const { Tr, Th, Td, THead, TBody } = Table

const TaskTracking = () => {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [showAssignModal, setShowAssignModal] = useState(false)
    const [storeTaskId, setStoreTaskId] = useState<TaskDetails>()
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [currentStatus, setCurrentStatus] = useState<any>()
    const [showFilterByRunner, SetShowFilterByRunner] = useState(false)
    const [particularMobileOfRunner, SetParticularMobileOfRunner] = useState<string>('')
    const [statusName, setStatusName] = useState('')

    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')

    const queryUrl = useMemo(() => {
        let searchData = ''
        let deliveryType = ''
        const runnerFilter = particularMobileOfRunner ? `&runner_mobile=${particularMobileOfRunner}` : ''

        if (currentSelectedPage.value === 'client_order_id' && globalFilter) {
            searchData = `&client_order_id=${globalFilter}`
        } else if (currentSelectedPage.value === 'mobile' && globalFilter) {
            searchData = `&runner_mobile=${globalFilter}`
        }

        let statusFilter = ''
        if (statusName) {
            statusFilter =
                statusName === 'cash_recon'
                    ? `&data_type=${statusName}`
                    : statusName === 'cash_only'
                      ? `&cash_only=true`
                      : `&status=${statusName}`
        }

        if (!globalFilter) deliveryType = `task_type=REVERSE`

        return `logistic/slikk/task?${deliveryType}&p=${page}&page_size=${pageSize}${searchData}${runnerFilter}${statusFilter}&from=${from}&to=${To_Date}`
    }, [from, particularMobileOfRunner, globalFilter, currentStatus, page, pageSize, currentSelectedPage, To_Date])

    const { data, totalData, responseStatus } = useFetchApi<TaskDetails>({
        url: queryUrl,
        initialData: [],
    })

    const totalPages = Math.ceil(totalData / pageSize)
    const handleAssignClick = (task: TaskDetails) => {
        setShowAssignModal(true)
        setStoreTaskId(task)
    }

    const handleReAssignClick = (task: TaskDetails) => {
        setShowAssignModal(true)
        setStoreTaskId(task)
    }

    const handleTaskDetailOpen = (task_id: string | number) => {
        navigate(`/app/tryAndBuy/taskTracking/${task_id}`)
    }

    const handleSelect = (value: string) => {
        const selected = SEARCHOPTIONS.find((item) => item.value === value)
        if (selected) setCurrentSelectedPage(selected)
    }

    const handleSelectStatus = (value: string) => {
        const selected = STATUSARRAY.find((item) => item.value === value)
        if (selected) {
            setCurrentStatus(selected)
            setStatusName(selected?.value)
        }
    }

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates?.[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
        }
    }

    const handleDownloadCsv = async () => {
        notification.info({ message: 'Download in process' })
        try {
            const response = await axioisInstance.get(`${queryUrl}&download=true`, { responseType: 'blob' })
            commonDownload(response, 'Forward-Task.csv')
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        }
    }

    const columns = TaskTrackingColumns({
        handleAssignClick,
        handleReAssignClick,
        handleTaskDetailopen: handleTaskDetailOpen,
        handleRiderProfile: (mobile: string | number) => navigate(`/app/riderProfile/${mobile}`),
    })
    if (responseStatus === '403') return <AccessDenied />
    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl transition-all duration-300">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={globalFilter}
                        className="w-full sm:w-72 p-3 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 
                        focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <DropDownCommon Options={SEARCHOPTIONS} currentSelectedPage={currentSelectedPage} handleSelect={handleSelect} />
                        <DropDownCommon Options={STATUSARRAY} currentSelectedPage={currentStatus} handleSelect={handleSelectStatus} />
                    </div>
                </div>
                <div className="flex flex-col xl:flex-row gap-3 items-center">
                    <Button variant="blue" size="sm" icon={<FaFilter />} onClick={() => SetShowFilterByRunner(true)}>
                        Filter by Runner
                    </Button>
                    <Button variant="solid" size="sm" icon={<FaDownload />} onClick={handleDownloadCsv}>
                        Download CSV
                    </Button>

                    <UltimateDatePicker
                        customClass="border w-auto rounded-md h-auto font-bold  bg-black text-white flex justify-center"
                        from={from}
                        to={to}
                        setFrom={setFrom}
                        setTo={setTo}
                        handleDateChange={handleDateChange}
                    />
                </div>
            </div>
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                <Table>
                    <THead className="bg-gray-100 dark:bg-gray-800">
                        <Tr>
                            {columns.map((col, i) => (
                                <Th key={i} className="py-3 px-4 font-semibold">
                                    {col.header}
                                </Th>
                            ))}
                        </Tr>
                    </THead>

                    <TBody>
                        {data.map((row: any) => (
                            <Tr key={row.task_id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                {columns.map((col, i) => (
                                    <Td key={i} className="py-2.5 px-4">
                                        {col.format ? col.format(row[col.accessor], row) : row[col.accessor] || ''}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </div>
            <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalPages} />
            <TrackModal
                showTaskModal={showAssignModal}
                handleCloseModal={() => setShowAssignModal(false)}
                storeData={storeTaskId!}
                setShowAssignModal={setShowAssignModal}
            />
            <FilterByRunner
                showTaskModal={showFilterByRunner}
                handleCloseModal={() => SetShowFilterByRunner(false)}
                storeTaskId={storeTaskId?.task_id ?? 0}
                particularMobileOfRunner={particularMobileOfRunner}
                SetParticularMobileOfRunner={SetParticularMobileOfRunner}
            />
        </div>
    )
}

export default TaskTracking
