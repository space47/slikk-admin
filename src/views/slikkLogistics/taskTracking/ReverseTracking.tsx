/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import TrackModal from './TrackModal'
import { Option, pageSizeOptions, SEARCHOPTIONS, STATUSARRAY, TaskDetails } from './TaskCommonType'
import { useNavigate } from 'react-router-dom'
import AccessDenied from '@/views/pages/AccessDenied'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import moment from 'moment'
import { Button, Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import FilterByRunner from './FilterByRunner'
import { TaskTrackingColumns } from './taskUtils/TaskTrakingColumns'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { AxiosError } from 'axios'
import { errorMessage } from '@/utils/responseMessages'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { commonDownload } from '@/common/commonDownload'
import { notification } from 'antd'

const { Tr, Th, Td, THead, TBody } = Table

const TaskTracking = () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [showAssignModal, setShowAssignModal] = useState(false)
    const [storeTaskId, setStoreTaskId] = useState<TaskDetails>()
    const navigate = useNavigate()
    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [currentStatus, setCurrentStatus] = useState<any>()
    const [showFilterByRunner, SetShowFilterByRunner] = useState(false)
    const [particularMobileOfRunner, SetParticularMobileOfRunner] = useState<string>('')
    const [statusName, setStatusName] = useState('')

    const queryUrl = useMemo(() => {
        let searchData = ''
        let deliveryType = ''
        let fromDate = ''

        const filterRunnerName = particularMobileOfRunner ? `&runner_mobile=${particularMobileOfRunner}` : ''

        if (currentSelectedPage.value === 'client_order_id' && globalFilter) {
            searchData = `&client_order_id=${globalFilter}`
        } else if (currentSelectedPage.value === 'mobile' && globalFilter) {
            searchData = `&runner_mobile=${globalFilter}`
        }

        let currentStatusName = ''
        if (statusName) {
            if (statusName === 'cash_recon') {
                currentStatusName = `&data_type=${statusName}`
            } else {
                currentStatusName = `&status=${statusName}`
            }
        }

        if (!globalFilter) {
            deliveryType = `task_type=REVERSE`
        }
        if (from && to && !globalFilter && !particularMobileOfRunner) {
            fromDate = `&from=${from}&to=${To_Date}`
        }

        return `logistic/slikk/task?${deliveryType}&p=${page}&page_size=${pageSize}${fromDate}${searchData}${filterRunnerName}${currentStatusName}`
    }, [from, to, particularMobileOfRunner, globalFilter, currentStatus, page, pageSize])

    const { data, totalData, responseStatus } = useFetchApi<TaskDetails>({ url: queryUrl, initialData: [] })

    const totalPages = Math.ceil(totalData / pageSize)

    const handleAssignClick = (task_id: TaskDetails) => {
        setShowAssignModal(true)
        setStoreTaskId(task_id)
    }
    const handleReAssignClick = (task_id: TaskDetails) => {
        setShowAssignModal(true)
        setStoreTaskId(task_id)
    }

    const handleCloseModal = () => {
        setShowAssignModal(false)
    }
    const handleCloseFilterModal = () => {
        SetShowFilterByRunner(false)
    }

    const handleTaskDetailopen = (task_id: string | number) => {
        navigate(`/app/tryAndBuy/taskTracking/${task_id}`)
    }
    const handleSelect = (value: any) => {
        const selected = SEARCHOPTIONS.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    const handleSelectStatus = (value: any) => {
        const selected = STATUSARRAY.find((item) => item.value === value)
        if (selected) {
            setCurrentStatus(selected)
            setStatusName(selected?.value)
        }
    }

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
        }
    }

    const handleFilterRunner = () => {
        SetShowFilterByRunner(true)
    }

    const handleRiderProfile = (mobile: string | number) => {
        navigate(`/app/riderProfile/${mobile}`)
    }

    const columns = TaskTrackingColumns({
        handleAssignClick,
        handleReAssignClick,
        handleTaskDetailopen,
        handleRiderProfile,
    })

    const handleDownloadCsv = async () => {
        notification.info({ message: 'Download in process' })
        try {
            const downloadUrl = `${queryUrl}&download=true`
            const response = await axioisInstance.get(downloadUrl, { responseType: 'blob' })
            commonDownload(response, 'Forward-Task.csv')
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    if (responseStatus === '403') {
        return <AccessDenied />
    }
    return (
        <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto xl:mt-8">
                    <div className="w-full sm:w-72">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 rounded-lg shadow-sm 
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                   dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="w-full sm:w-auto">
                            <Dropdown
                                className="w-full sm:w-auto  bg-gray-100 dark:bg-gray-800 
                                         dark:text-gray-100 rounded-lg px-4 py-2 
                                       hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-blue-500 font-bold"
                                title={currentSelectedPage?.value ? currentSelectedPage.label : 'Select Page'}
                                onSelect={handleSelect}
                            >
                                {SEARCHOPTIONS?.map((item, key) => (
                                    <DropdownItem key={key} eventKey={item.value}>
                                        <span className="">{item.label}</span>
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>
                        <div className="w-full sm:w-auto">
                            <Dropdown
                                className="w-full sm:w-auto font-semibold bg-gray-100 dark:bg-gray-800 
                                       text-gray-800 dark:text-gray-100 rounded-lg px-4 py-2 
                                       hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                title={currentStatus?.value ? currentStatus.label : 'Select Filter'}
                                onSelect={handleSelectStatus}
                            >
                                {STATUSARRAY?.map((item, key) => (
                                    <DropdownItem key={key} eventKey={item.value}>
                                        <span>{item.label}</span>
                                    </DropdownItem>
                                ))}
                                <div
                                    className="flex justify-center items-center text-red-500 font-semibold 
                                           cursor-pointer hover:bg-red-50 dark:hover:bg-gray-700 p-2 rounded"
                                    onClick={() => {
                                        setCurrentStatus({ label: 'ALL', value: 'ALL' })
                                        setStatusName('')
                                    }}
                                >
                                    Remove Filter
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col xl:flex-row gap-3 items-center ">
                    <Button
                        variant="new"
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-all xl:mt-8"
                        onClick={handleFilterRunner}
                    >
                        Filter by Runner
                    </Button>

                    <Button
                        variant="new"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-all xl:mt-8"
                        onClick={handleDownloadCsv}
                    >
                        Download CSV
                    </Button>

                    <UltimateDatePicker from={from} setFrom={setFrom} to={to} setTo={setTo} handleDateChange={handleDateChange} />
                </div>
            </div>

            {/* ===== Table Section ===== */}
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                <Table>
                    <THead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200">
                        <Tr>
                            {columns.map((column, index) => (
                                <Th key={index} className="py-3 px-4 font-semibold">
                                    {column.header}
                                </Th>
                            ))}
                        </Tr>
                    </THead>
                    <TBody>
                        {data.map((row: any) => (
                            <Tr key={row.task_id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                {columns.map((column, index) => (
                                    <Td key={index} className="py-2.5 px-4 text-gray-800 dark:text-gray-200">
                                        {column.format ? column.format(row[column.accessor], row) : row[column.accessor] || ''}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </div>

            {/* ===== Pagination ===== */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <Pagination currentPage={page} total={totalPages} onChange={(newPage: any) => setPage(newPage)} />
                <div className="w-full sm:w-36">
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

            {/* ===== Modals ===== */}
            {showAssignModal && (
                <TrackModal
                    showTaskModal={showAssignModal}
                    handleCloseModal={handleCloseModal}
                    storeData={storeTaskId!}
                    setShowAssignModal={setShowAssignModal}
                />
            )}

            {showFilterByRunner && (
                <FilterByRunner
                    showTaskModal={showFilterByRunner}
                    handleCloseModal={handleCloseFilterModal}
                    storeTaskId={storeTaskId?.task_id ?? 0}
                    particularMobileOfRunner={particularMobileOfRunner}
                    SetParticularMobileOfRunner={SetParticularMobileOfRunner}
                />
            )}
        </div>
    )
}

export default TaskTracking
