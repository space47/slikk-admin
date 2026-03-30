/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import Select from '@/components/ui/Select'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA, USER_PROFILE_DATA } from '@/store/types/company.types'
import EasyTable from '@/common/EasyTable'
import AccessDenied from '@/views/pages/AccessDenied'
import { Button, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { MdInventory } from 'react-icons/md'
import BrandShipmentsTable from '@/views/brandDashboard/brandShipments/brandShipmentsTable/BrandShipmentsTable'
import { LiaShippingFastSolid } from 'react-icons/lia'
import { InwardColumns } from './inwardUtils/InwardColumns'
import { GRNDetails } from '@/store/types/inward.types'
import { inwardService } from '@/store/services/inwardService'
import { notification, Spin } from 'antd'
import PageCommon from '@/common/PageCommon'
import { FaDownload, FaPlus } from 'react-icons/fa'
import { InwardFilterSearch } from './inwardCommon'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import dayjs from 'dayjs'
import UltimateDateFilter from '@/common/UltimateDateFilter'
import { commonDownloadFromRtk } from '@/common/commonDownload'

const PaginationTable = () => {
    const navigate = useNavigate()
    const [inwardData, setInwardData] = useState<GRNDetails[]>([])
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [from, setFrom] = useState(dayjs().startOf('month').format('YYYY-MM-DD'))
    const [to, setTo] = useState(dayjs().format('YYYY-MM-DD'))
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [globalFilter, setGlobalFilter] = useState<any>('')
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const [inwardFilterStore, setInwardFilterStore] = useState('grn_number_search')
    const [companyCode, setCompanyCode] = useState<any>()
    const [storeCode, setStoreCode] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState('tab2')
    const { debounceFilter } = useDebounceInput({ globalFilter: globalFilter, delay: 500 })
    const [downloadInward, downloadResponse] = inwardService.useLazyInwardDataDownloadQuery()
    const To_Date = dayjs(to).add(1, 'days').format('YYYY-MM-DD')

    const inwardApiCall = inwardService.useInwardDataGetQuery(
        {
            id: selectedCompany.id,
            company: companyCode || '',
            store_id: storeCode?.join(',') || '',
            search_type: inwardFilterStore || '',
            search_value: debounceFilter || '',
            page,
            pageSize,
            from,
            to: To_Date,
        },
        { refetchOnMountOrArgChange: true, skip: !selectedCompany.id },
    )

    const handleDateChange = (dates: [Date | null, Date | null] | null, setFrom: (x: string) => void, setTo: (x: string) => void) => {
        if (dates && dates[0]) {
            setFrom(dayjs(dates[0]).format('YYYY-MM-DD'))
            setTo(dates[1] ? dayjs(dates[1]).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'))
        }
    }

    useEffect(() => {
        if (inwardApiCall.isSuccess) {
            setInwardData(inwardApiCall?.data?.data?.results)
            setCount(inwardApiCall?.data?.data?.count)
        }
        if (inwardApiCall.isError) {
            notification.error({ message: (inwardApiCall.error as any).data.message })
        }
    }, [inwardApiCall.isSuccess, inwardApiCall?.data?.data, inwardApiCall.isError, inwardApiCall.error])

    useEffect(() => {
        if (downloadResponse.isSuccess) {
            const isNoContent =
                downloadResponse?.data === undefined ||
                downloadResponse?.data === null ||
                (typeof downloadResponse.data === 'string' && (downloadResponse as any).data.trim() === '')

            if (isNoContent) {
                notification.warning({ message: 'No data available to download' })
                return
            }

            commonDownloadFromRtk(downloadResponse.data, `INWARD-${dayjs().format('YYYY-MM-DD HH:mm:ss a')}.csv`)
        }

        if (downloadResponse.isError) {
            notification.error({ message: 'Failed to download' })
        }
    }, [downloadResponse.isSuccess, downloadResponse.isError, downloadResponse.data])

    const handleDownload = () => {
        downloadInward({
            id: selectedCompany.id,
            company: companyCode || '',
            store_id: storeCode?.join(',') || '',
            search_type: inwardFilterStore || '',
            search_value: debounceFilter || '',
            page,
            pageSize,
            from,
            to: To_Date,
        })
    }

    const columns = InwardColumns({ companyList, storeList })

    const handleChange = (tab: string) => {
        setActiveTab(tab)
        setPage(1)
    }

    if (inwardApiCall.isError && (inwardApiCall.error as any).status === 403) {
        return <AccessDenied />
    }

    return (
        <Spin spinning={inwardApiCall.isLoading || inwardApiCall.isFetching}>
            <div className="p-2 shadow-xl rounded-xl ">
                <div>
                    <Tabs defaultValue="tab2" onChange={handleChange}>
                        <TabList>
                            <TabNav value="tab2" icon={<MdInventory className="text-green-500 text-3xl" />}>
                                <span className="text-xl font-bold">GRN</span>
                            </TabNav>
                            <TabNav value="tab1" icon={<LiaShippingFastSolid className="text-blue-600 text-3xl" />}>
                                <span className="text-xl font-bold">New Shipments</span>
                            </TabNav>
                        </TabList>
                    </Tabs>
                </div>

                {activeTab === 'tab1' && (
                    <div className="mt-10">
                        <BrandShipmentsTable />
                    </div>
                )}

                {activeTab === 'tab2' && (
                    <>
                        <div className="p-1 shadow-lg rounded-lg">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 mt-10">
                                <div className="flex flex-col lg:flex-row gap-6 w-full">
                                    <div className="flex flex-col w-full">
                                        <label className="font-semibold text-gray-700 mb-1">Search</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="search"
                                                value={globalFilter}
                                                placeholder="Search"
                                                className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
                                            />
                                            <Select
                                                isClearable
                                                classNamePrefix="react-select"
                                                options={InwardFilterSearch}
                                                defaultValue={InwardFilterSearch[0]}
                                                getOptionLabel={(option) => option.label}
                                                getOptionValue={(option) => option.value}
                                                onChange={(newVal) => setInwardFilterStore(newVal?.value as string)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="new"
                                        size="sm"
                                        icon={<FaDownload />}
                                        loading={downloadResponse.isLoading}
                                        disabled={downloadResponse.isLoading}
                                        onClick={handleDownload}
                                    >
                                        Export CSV
                                    </Button>
                                    <UltimateDateFilter
                                        customClass="border w-auto rounded-md h-auto font-bold bg-black text-white flex justify-center"
                                        from={from}
                                        to={to}
                                        setFrom={setFrom}
                                        setTo={setTo}
                                        handleDateChange={handleDateChange}
                                    />

                                    <Button variant="new" size="sm" icon={<FaPlus />} onClick={() => navigate('/app/goods/received/form')}>
                                        ADD GRN
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-2 items-center mb-2">
                                <div className="flex flex-col w-full max-w-xs">
                                    <label className="font-semibold text-gray-700 mb-1">Select Company</label>
                                    <Select
                                        isClearable
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        options={companyList}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id?.toString()}
                                        onChange={(newVal) => setCompanyCode(newVal?.code)}
                                    />
                                </div>
                                <div className="flex flex-col w-full max-w-[400px]">
                                    <label className="font-semibold text-gray-700 mb-1">Select Store</label>
                                    <Select
                                        isClearable
                                        isMulti
                                        options={storeList}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id?.toString()}
                                        onChange={(selectedOptions) => {
                                            setStoreCode(selectedOptions?.map((opt) => opt.id) || [])
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <EasyTable mainData={inwardData} columns={columns} page={page} pageSize={pageSize} />
                            <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
                        </div>
                    </>
                )}
            </div>
        </Spin>
    )
}

export default PaginationTable
