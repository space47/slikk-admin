import { Button, Dropdown, Input, Pagination, Select } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { useAppDispatch, useAppSelector } from '@/store'
import { eventSeriesService } from '@/store/services/eventSeriesService'
import {
    EventSeriesSliceType,
    setFrom,
    setTo,
    setCount,
    setEventSeriesData,
    setPage,
    setPageSize,
} from '@/store/slices/eventSeriesSlice/eventSeriesSlice'
import React, { useEffect, useState } from 'react'
import { EventSearchOptions } from '../eventCommons/eventCommonArray'
import UltimatePersistDatePicker from '@/common/UltimatePersistDatePicker'
import { handleSelect } from './eventListUtils/EventListFunctions'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { EventListColumns } from './eventListUtils/EventListColumns'
import EasyTable from '@/common/EasyTable'
import { Option } from '@/views/org-management/sellers/sellerCommon'
import { pageSizeOptions } from '@/views/category-management/orderlist/commontypes'
import AssignUserModal from './eventListUtils/AssignUserModal'

const EventList = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(EventSearchOptions[0])
    const { eventSeriesData, count, from, page, pageSize, to } = useAppSelector<EventSeriesSliceType>((state) => state.eventSeries)
    const [isAddEvent, setIsAddEvent] = useState<boolean>(false)
    const To_Date = moment(to).add(1, 'days').format('YYYY-MM-DD')
    const {
        data: eventData,
        isLoading,
        isSuccess,
    } = eventSeriesService.useEventSeriesDataQuery({
        // from: from,
        // to: To_Date,
        page: page,
        pageSize: pageSize,
        event_id: currentSelectedPage?.value === 'event_id' ? globalFilter : undefined,
        event_type: currentSelectedPage?.value === 'event_type' ? globalFilter : undefined,
        mobile: currentSelectedPage?.value === 'mobile_number' ? globalFilter : undefined,
        event_name: currentSelectedPage?.value === 'event_name' ? globalFilter : undefined,
    })

    useEffect(() => {
        if (isSuccess) {
            dispatch(setEventSeriesData(eventData.data?.results || []))
            dispatch(setCount(eventData.data?.count || 0))
        }
    }, [eventData, isSuccess, dispatch, from, to, page, pageSize, globalFilter, currentSelectedPage])

    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
        if (dates && dates[0]) {
            dispatch(setFrom(moment(dates[0]).format('YYYY-MM-DD')))
            const toDate = dates[1] ? moment(dates[1]).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
            dispatch(setTo(toDate))
        }
    }
    const columns = EventListColumns()

    console.log('EventList', eventSeriesData)

    return (
        <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
            <div className="flex flex-wrap xl:flex-nowrap justify-between items-center gap-4">
                {/* Left: Search and Dropdown */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                        <Input
                            type="search"
                            name="search"
                            placeholder="Search here..."
                            value={globalFilter}
                            className="w-[150px] xl:w-[250px] rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                        <div className="relative font-bold">
                            <Dropdown
                                className="text-sm font-medium text-black dark:text-white bg-gray-100 dark:bg-blue-600 px-2 py-1 rounded-md"
                                title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                onSelect={(e) => handleSelect(e, setCurrentSelectedPage)}
                            >
                                {EventSearchOptions?.map((item, key) => (
                                    <DropdownItem key={key} eventKey={item.value}>
                                        <span>{item.label}</span>
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* Right: Date Picker & Button */}
                <div className="flex  items-center gap-3">
                    <div>
                        <UltimatePersistDatePicker setFrom={setFrom} setTo={setTo} handleDateChange={handleDateChange} />
                    </div>
                    <div className="mt-8">
                        <Button className="" size="sm" variant="new" onClick={() => setIsAddEvent(true)}>
                            ADD USER TO EVENT
                        </Button>
                    </div>
                    <div className="mt-8">
                        <Button className="" size="sm" variant="new" onClick={() => navigate('/app/appSettings/eventSeries/addEvent')}>
                            ADD NEW EVENT
                        </Button>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <div>
                <EasyTable overflow columns={columns} mainData={eventSeriesData} page={page} pageSize={pageSize} />
                <div className="flex flex-col md:flex-row items-center justify-between mt-4">
                    <Pagination
                        pageSize={pageSize}
                        currentPage={page}
                        total={count}
                        className="mb-4 md:mb-0"
                        onChange={(e) => dispatch(setPage(e))}
                    />

                    <div className="min-w-[130px] flex gap-5">
                        <Select<Option>
                            size="sm"
                            isSearchable={false}
                            value={pageSizeOptions.find((option) => option.value === pageSize)}
                            options={pageSizeOptions}
                            onChange={(option) => {
                                if (option) {
                                    dispatch(setPageSize(option.value))
                                    dispatch(setPage(1))
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            {isAddEvent && <AssignUserModal dialogIsOpen={isAddEvent} setIsOpen={setIsAddEvent} eventSeriesData={eventSeriesData ?? []} />}
        </div>
    )
}

export default EventList
