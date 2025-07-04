/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import TrackModal from './TrackModal'
import { Option, pageSizeOptions, SEARCHOPTIONS, STATUSARRAY, TaskDetails } from './TaskCommonType'
import { useNavigate } from 'react-router-dom'
import AccessDenied from '@/views/pages/AccessDenied'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import moment from 'moment'
import { Button, Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import FilterByRunner from './FilterByRunner'
import { TaskTrackingColumns } from './taskUtils/TaskTrakingColumns'

const { Tr, Th, Td, THead, TBody } = Table

const TaskTracking = () => {
    const [data, setData] = useState<TaskDetails[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [from, setFrom] = useState(moment().format('YYYY-MM-DD'))
    const [to, setTo] = useState(moment().format('YYYY-MM-DD'))
    const [showAssignModal, setShowAssignModal] = useState(false)
    const [storeTaskId, setStoreTaskId] = useState<TaskDetails>()
    const [accessDenied, setAccessDenied] = useState(false)
    const navigate = useNavigate()
    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [currentStatus, setCurrentStatus] = useState<any>()
    const [showFilterByRunner, SetShowFilterByRunner] = useState(false)
    const [particularMobileOfRunner, SetParticularMobileOfRunner] = useState<string>('')
    const [statusName, setStatusName] = useState('')

    const fetchData = async () => {
        try {
            let searchData = ''
            let deliveryType = ''
            let fromDate = ''

            const filterRunnerName = particularMobileOfRunner ? `&runner_mobile=${particularMobileOfRunner}` : ''

            if (currentSelectedPage.value === 'client_order_id' && globalFilter) {
                searchData = `&client_order_id=${globalFilter}`
            } else if (currentSelectedPage.value === 'mobile' && globalFilter) {
                searchData = `&runner_mobile=${globalFilter}`
            }

            const currentStatusName = statusName ? `&current_status=${statusName}` : ''

            if (!globalFilter) {
                deliveryType = `task_type=FORWARD,EXCHANGE`
            }
            if (from && to && !globalFilter && !particularMobileOfRunner) {
                fromDate = `&from=${from}&to=${To_Date}`
            }

            const response = await axioisInstance.get(
                `logistic/slikk/task?${deliveryType}&p=${page}&page_size=${pageSize}${fromDate}${searchData}${filterRunnerName}${currentStatusName}`,
            )
            const data = response.data.data.results
            const total = response.data.data.count

            setData(data)
            setTotalData(total)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            }
            console.error(error)
        }
    }

    console.log('data of results', data)

    useEffect(() => {
        fetchData()
    }, [from, to, particularMobileOfRunner, globalFilter, currentStatus, page, pageSize])

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

    if (accessDenied) {
        return <AccessDenied />
    }
    return (
        <div className="px-2 sm:px-4">
            {/* Search and Filter Section */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-7">
                {/* Left Side - Search and Dropdowns */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto xl:mt-9">
                    {/* Search Input */}
                    <div className="w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search here"
                            value={globalFilter}
                            className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>

                    {/* Dropdowns Container */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        {/* Page Select Dropdown */}
                        <div className="w-full sm:w-auto bg-gray-100 rounded-md dark:bg-blue-600 dark:text-white">
                            <Dropdown
                                className="w-full sm:w-auto text-black bg-gray-200 font-bold px-4 py-2 rounded-md"
                                title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                onSelect={handleSelect}
                            >
                                {SEARCHOPTIONS?.map((item, key) => (
                                    <DropdownItem key={key} eventKey={item.value}>
                                        <span>{item.label}</span>
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>

                        {/* Status Dropdown */}
                        <div className="w-full sm:w-auto bg-gray-100 rounded-md dark:bg-blue-600 dark:text-white">
                            <Dropdown
                                className="w-full sm:w-auto text-black bg-gray-200 font-bold px-4 py-2 rounded-md"
                                title={currentStatus?.value ? currentStatus.label : 'SELECT STATUS'}
                                onSelect={handleSelectStatus}
                            >
                                {STATUSARRAY?.map((item, key) => (
                                    <DropdownItem key={key} eventKey={item.value}>
                                        <span>{item.label}</span>
                                    </DropdownItem>
                                ))}
                                <div
                                    className="flex justify-center items-center text-red-500 font-bold cursor-pointer hover:bg-gray-100 p-2"
                                    onClick={() => {
                                        setCurrentStatus({
                                            label: 'ALL',
                                            value: 'ALL',
                                        })
                                        setStatusName('')
                                    }}
                                >
                                    REMOVE
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col xl:flex-row gap-2 xl:align-top">
                    <div className=" items-center xl:mt-9 md:mt-9 ">
                        <Button variant="new" size="sm" onClick={() => handleFilterRunner()}>
                            Filter by Runner
                        </Button>
                    </div>
                    <div className="">
                        <UltimateDatePicker from={from} setFrom={setFrom} to={to} setTo={setTo} handleDateChange={handleDateChange} />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <Table>
                    <THead>
                        <Tr>
                            {columns.map((column, index) => (
                                <Th key={index}>{column.header}</Th>
                            ))}
                        </Tr>
                    </THead>
                    <TBody>
                        {data.map((row: any) => (
                            <Tr key={row.task_id}>
                                {columns.map((column, index) => (
                                    <Td key={index}>
                                        {column.format ? column.format(row[column.accessor], row) : row[column.accessor] || ''}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </div>

            {/* Pagination Section */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <Pagination currentPage={page} total={totalPages} onChange={(newPage: any) => setPage(newPage)} />
                <div className="w-full sm:w-32">
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

            {/* Modals */}
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
