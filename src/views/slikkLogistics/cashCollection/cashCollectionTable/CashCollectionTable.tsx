/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import { Button, Dropdown, FormItem, Input, Select, Spinner } from '@/components/ui'
import UltimateDatePicker from '@/common/UltimateDateFilter'
import PageCommon from '@/common/PageCommon'
import UpdateDepositModal from '../cashCollectionUtils/UpdateDepositModal'
import DailyDepositModal from '../cashCollectionUtils/DailyDepositModal'
import { cashCollectionService } from '@/store/services/cashCollectionService'
import { CashCollection } from '@/store/types/cashCollection.types'
import { useCashCollectionColumns } from '../cashCollectionUtils/useCashCollectionColumns'
import { HiSearch } from 'react-icons/hi'
import NotFoundData from '@/views/pages/NotFound/Notfound'
import { DATE_FORMAT, DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DownloadOptions } from '../cashCollectionCommon'
import CreateCollectionModal from '../cashCollectionUtils/CreateCollectionModal'
import { notification } from 'antd'
import { commonDownload } from '@/common/commonDownload'
import { AxiosError } from 'axios'
import { errorMessage } from '@/utils/responseMessages'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import StoreSelectComponent from '@/common/StoreSelectComponent'
import { RiderAgency } from '../../riderDetails/RiderDetailsCommon'
import { StoreDetails } from '@/store/types/companyStore.types'
import { FaCalendarAlt } from 'react-icons/fa'

export const CashCollectionTable: React.FC = () => {
    const [cashData, setCashData] = useState<CashCollection[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [searchOnEnter, setSearchOnEnter] = useState('')
    const [selectedOption, setSelectedOption] = useState('')
    const [page, setPage] = useState(DEFAULT_PAGE)
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
    const [count, setCount] = useState(0)
    const [from, setFrom] = useState(moment().format(DATE_FORMAT))
    const [to, setTo] = useState(moment().format(DATE_FORMAT))
    const [updateDepositRow, setUpdateDepositRow] = useState<CashCollection>()
    const [dailyRow, setDailyRow] = useState<CashCollection>()
    const [isUpdateDepositOpen, setIsUpdateDepositOpen] = useState(false)
    const [isDailyDepositOpen, setIsDailyDepositOpen] = useState(false)
    const [isCreateModal, setIsCreateModal] = useState(false)
    const [downloadSpinning, setDownloadSpinning] = useState(false)
    const [store, setStore] = useState<StoreDetails[]>([])
    const [agency, setAgency] = useState('')

    const toDate = useMemo(() => moment(to).add(1, 'days').format(DATE_FORMAT), [to])

    const { data, isSuccess, isError, refetch, isLoading, isFetching } = cashCollectionService.useCashCollectionQuery({
        from,
        to: toDate,
        page,
        pageSize,
        mobile: searchOnEnter || '',
        agency: agency || '',
        store_id: store?.map((item) => item?.id).join(',') || '',
    })

    useEffect(() => {
        if (isSuccess && data?.data) {
            setCashData(data.data.results ?? [])
            setCount(data.data.count ?? 0)
        }
        if (isError) {
            console.error('Error fetching cash collection data')
        }
    }, [data, isSuccess, isError])

    const handleSearch = useCallback(() => {
        setSearchOnEnter(globalFilter.trim())
        setPage(DEFAULT_PAGE)
    }, [globalFilter])

    const handleDateChange = useCallback((dates: [Date | null, Date | null] | null) => {
        if (dates?.[0]) {
            setFrom(moment(dates[0]).format(DATE_FORMAT))
            setTo(dates[1] ? moment(dates[1]).format(DATE_FORMAT) : moment().format(DATE_FORMAT))
            setPage(DEFAULT_PAGE)
        }
    }, [])

    const handleSelect = (val: string) => {
        setSelectedOption(val)
        handleDownload(val)
    }

    const handleDownload = async (val: string) => {
        try {
            setDownloadSpinning(true)
            notification.info({ message: 'Download in progress' })
            const reportType = val === 'order_level' ? `&report_type=order_level` : ''
            const res = await axioisInstance.get(`/rider/cash/collection?from=${from}&to=${toDate}&download=true${reportType}`)
            commonDownload(res, 'CashCollection.csv')
            notification.success({ message: 'Successfully completed' })
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        } finally {
            setDownloadSpinning(false)
            setSelectedOption('')
        }
    }

    const handleDailyCash = (row: CashCollection) => {
        setDailyRow(row)
        setIsDailyDepositOpen(true)
    }

    const handleUpdateCash = (row: CashCollection) => {
        setUpdateDepositRow(row)
        setIsUpdateDepositOpen(true)
    }

    const columns = useCashCollectionColumns({
        handleDailyCash,
        handleUpdateCash,
    })

    return (
        <div className="w-full min-h-[80vh] transition-colors duration-300">
            <div className="w-full dark:bg-gray-800 rounded-2xl shadow-lg">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 w-full p-6">
                    <div className="flex items-center w-full lg:w-1/3 gap-2 rounded-lg shadow-inner border px-3 py-2">
                        <Input
                            type="search"
                            name="search"
                            placeholder="Search By Riders Number..."
                            value={globalFilter}
                            className="w-full rounded-md"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            className="bg-blue-600 hover:bg-blue-500 p-2 rounded-md transition-colors duration-200 flex items-center justify-center"
                            aria-label="Search"
                            onClick={handleSearch}
                        >
                            <HiSearch className="text-white text-xl" />
                        </button>
                    </div>
                </div>
                <div className="flex xl:justify-between md:justify-between flex-col xl:flex-row md:flex-row px-6 items-center shadow-md rounded-lg">
                    <div className="items-center flex gap-2">
                        <StoreSelectComponent label="Store" setStore={setStore} store={store} customCss="xl:w-[300px]" />
                        <div>
                            <FormItem label="Select Agency">
                                <Select
                                    isClearable
                                    isSearchable
                                    className="xl:w-[200px]"
                                    options={RiderAgency}
                                    value={RiderAgency.find((option) => option.value === agency)}
                                    onChange={(agency) => setAgency(agency?.value as string)}
                                />
                            </FormItem>
                        </div>
                    </div>

                    <div className="flex gap-3 items-center xl:md:flex-row flex-col">
                        <Button variant="new" size="sm" onClick={() => setIsCreateModal(true)} icon={<FaCalendarAlt />}>
                            Create Daily Collection
                        </Button>
                        <div className={'border w-auto rounded-md h-auto font-bold bg-black text-white flex justify-center'}>
                            <Dropdown
                                className="text-xl text-white bg-white font-bold border-2 border-blue-600"
                                title={selectedOption || 'Download Report'}
                                onSelect={(value) => handleSelect(value.toString())}
                            >
                                {DownloadOptions.map((item) => (
                                    <DropdownItem key={item.value} eventKey={item.value}>
                                        <span className="flex items-center gap-1">
                                            <span> {downloadSpinning && <Spinner size={30} />}</span>
                                            <span>{item.label}</span>
                                        </span>
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>

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

                {isFetching || isLoading ? (
                    <div className="mb-10 flex justify-center items-center">
                        <Spinner size={30} />
                    </div>
                ) : cashData?.length > 0 ? (
                    <div className="p-6 overflow-x-auto">
                        <EasyTable mainData={cashData} columns={columns} page={page} pageSize={pageSize} />
                    </div>
                ) : (
                    <NotFoundData />
                )}

                <div className="mb-8 p-2">
                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
                </div>
            </div>
            <UpdateDepositModal
                from={from}
                isOpen={isUpdateDepositOpen}
                setIsOpen={() => setIsUpdateDepositOpen(false)}
                row={updateDepositRow}
                refetch={refetch}
            />

            <DailyDepositModal
                isOpen={isDailyDepositOpen}
                setIsOpen={() => setIsDailyDepositOpen(false)}
                row={dailyRow}
                refetch={refetch}
            />
            <CreateCollectionModal isOpen={isCreateModal} setIsOpen={setIsCreateModal} />
        </div>
    )
}

export default CashCollectionTable
