/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import TrackModal from './TrackModal'
import { MdAssignment } from 'react-icons/md'
import { Option, pageSizeOptions, SEARCHOPTIONS, TaskDetails } from './TaskCommonType'

import { useNavigate } from 'react-router-dom'
import AccessDenied from '@/views/pages/AccessDenied'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import moment from 'moment'
import { Button, Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import FilterByRunner from './FilterByRunner'

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
    const [storeTaskId, setStoreTaskId] = useState()
    const [accessDenied, setAccessDenied] = useState(false)
    const navigate = useNavigate()
    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SEARCHOPTIONS[0])
    const [showFilterByRunner, SetShowFilterByRunner] = useState(false)
    const [particularMobileOfRunner, SetParticularMobileOfRunner] = useState<string>('')

    const fetchData = async () => {
        try {
            let searchData = ''
            let filterRunnerName = ''
            if (particularMobileOfRunner) {
                filterRunnerName = `&runner_mobile=${particularMobileOfRunner}`
            }

            if (currentSelectedPage.value === 'client_order_id' && globalFilter) {
                searchData = `&client_order_id=${globalFilter}`
            } else if (currentSelectedPage.value === 'status' && globalFilter) {
                searchData = `&status=${globalFilter}`
            }
            const response = await axioisInstance.get(
                `logistic/slikk/task?task_type=FORWARD&page_size=100&from=${from}&to=${To_Date}${searchData}${filterRunnerName}`,
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

    useEffect(() => {
        fetchData()
    }, [from, to, particularMobileOfRunner, globalFilter])

    const filteredData = data.filter((item) =>
        Object.values(item).some((val) => (val ? val.toString().toLowerCase().includes(globalFilter.toLowerCase()) : false)),
    )

    const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize)
    const totalPages = Math.ceil(totalData / pageSize)

    const handleAssignClick = (task_id: any) => {
        setShowAssignModal(true)
        setStoreTaskId(task_id)
    }

    const handleCloseModal = () => {
        setShowAssignModal(false)
    }
    const handleCloseFilterModal = () => {
        SetShowFilterByRunner(false)
    }

    const handleTaskDetailopen = (task_id: unknown) => {
        navigate(`/app/tryAndBuy/taskTracking/${task_id}`)
    }
    const handleSelect = (value: any) => {
        const selected = SEARCHOPTIONS.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    const columns = [
        {
            header: 'Assign Task',
            accessor: 'task_id',
            format: (value: any, row: TaskDetails) =>
                row.status == 'CREATED' && (
                    <button onClick={() => handleAssignClick(row.task_id)} className="bg-none border-none">
                        <MdAssignment className="text-3xl text-yellow-500" />
                    </button>
                ),
        },
        {
            header: 'Task ID',
            accessor: 'task_id',
            format: (_: any, row: TaskDetails) => {
                return (
                    <button className="px-3 py-2 bg-gray-400 text-white rounded-[10px]" onClick={() => handleTaskDetailopen(row.task_id)}>
                        {row.task_id}
                    </button>
                )
            },
        },
        { header: 'Status', accessor: 'status' },
        { header: 'Task Type', accessor: 'task_type' },

        {
            header: 'Pickup Name',
            accessor: 'pickup_details.name',
            format: (_: any, row: TaskDetails) => row.pickup_details?.name || '',
        },
        {
            header: 'Pickup Address',
            accessor: 'pickup_details.address',
            format: (_: any, row: TaskDetails) => row.pickup_details?.address || '',
        },
        {
            header: 'Pickup Landmark',
            accessor: 'pickup_details.landmark',
            format: (_: any, row: TaskDetails) => row.pickup_details?.landmark || '',
        },
        {
            header: 'Pickup Contact Number',
            accessor: 'pickup_details.contact_number',
            format: (_: any, row: TaskDetails) => row.pickup_details?.contact_number || '',
        },
        {
            header: 'Drop Name',
            accessor: 'drop_details.name',
            format: (_: any, row: TaskDetails) => row.drop_details?.name || '',
        },
        {
            header: 'Drop Address',
            accessor: 'drop_details.address',
            format: (_: any, row: TaskDetails) => row.drop_details?.address || '',
        },
        // {
        //     header: 'Drop Landmark',
        //     accessor: 'drop_details.landmark',
        //     format: (_: any, row: TaskDetails) => row.drop_details?.landmark || '',
        // },
        {
            header: 'Drop Contact Number',
            accessor: 'drop_details.contact_number',
            format: (_: any, row: TaskDetails) => row.drop_details?.contact_number || '',
        },
        // {
        //     header: 'User Credits Key',
        //     accessor: 'user_details.credits_key',
        //     format: (_: any, row: TaskDetails) => row.user_details?.credits_key || '',
        // },
        {
            header: 'User Contact Number',
            accessor: 'user_details.contact_number',
            format: (_: any, row: TaskDetails) => row.user_details?.contact_number || '',
        },
        {
            header: 'Order ID',
            accessor: 'client_order_details.order_id',
            format: (_: any, row: TaskDetails) => row.client_order_details?.order_id || '',
        },
        {
            header: 'Is Prepaid',
            accessor: 'client_order_details.is_prepaid',
            format: (_: any, row: TaskDetails) => (row.client_order_details?.is_prepaid ? 'Yes' : 'No'),
        },
        {
            header: 'Cash to be Collected',
            accessor: 'client_order_details.cash_to_be_collected',
            format: (_: any, row: TaskDetails) => row.client_order_details?.cash_to_be_collected || '',
        },
        {
            header: 'Delivery Charge from Customer',
            accessor: 'client_order_details.delivery_charge_to_be_collected_from_customer',
            format: (_: any, row: TaskDetails) => (row.client_order_details?.delivery_charge_to_be_collected_from_customer ? 'Yes' : 'No'),
        },
        {
            header: 'Client Order ID',
            accessor: 'client_order_id',
            format: (_: any, row: TaskDetails) => row.client_order_id || '',
        },
    ]

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            setFrom(moment(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
        }
    }

    const handleFilterRunner = () => {
        SetShowFilterByRunner(true)
    }

    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div>
            <div className="flex flex-wrap gap-4 justify-between  mb-7">
                {/* Search Input and Dropdown */}
                <div className="flex gap-4 items-center xl:mt-4 ">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="bg-gray-100 xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white">
                        <Dropdown
                            className="text-black bg-gray-200 font-bold px-4 py-2 rounded-md"
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
                </div>

                {/* Filter Button and Date Picker */}
                <div className="flex gap-2">
                    <div className="xl:mt-8">
                        <Button variant="new" onClick={() => handleFilterRunner()}>
                            Filter by Runner
                        </Button>
                    </div>
                    <div>
                        <UltimateDatePicker from={from} setFrom={setFrom} to={to} setTo={setTo} handleDateChange={handleDateChange} />
                    </div>
                </div>
            </div>

            <Table>
                <THead>
                    <Tr>
                        {columns.map((column, index) => (
                            <Th key={index}>{column.header}</Th>
                        ))}
                    </Tr>
                </THead>
                <TBody>
                    {paginatedData.map((row: any) => (
                        <Tr key={row.task_id}>
                            {columns.map((column, index) => (
                                <Td key={index}>{column.format ? column.format(row[column.accessor], row) : row[column.accessor] || ''}</Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <div className="mt-4 flex justify-between items-center">
                <Pagination currentPage={page} total={totalPages} onChange={(newPage: any) => setPage(newPage)} />
                <Select<Option>
                    size="sm"
                    isSearchable={false}
                    value={pageSizeOptions.find((option) => option.value === pageSize)}
                    options={pageSizeOptions}
                    onChange={(option) => setPageSize(Number(option?.value))}
                />
            </div>
            {showAssignModal && (
                <TrackModal
                    showTaskModal={showAssignModal}
                    handleCloseModal={handleCloseModal}
                    storeTaskId={storeTaskId ?? 0}
                    setShowAssignModal={setShowAssignModal}
                />
            )}
            {showFilterByRunner && (
                <FilterByRunner
                    showTaskModal={showFilterByRunner}
                    handleCloseModal={handleCloseFilterModal}
                    storeTaskId={storeTaskId ?? 0}
                    particularMobileOfRunner={particularMobileOfRunner}
                    SetParticularMobileOfRunner={SetParticularMobileOfRunner}
                />
            )}
        </div>
    )
}

export default TaskTracking
