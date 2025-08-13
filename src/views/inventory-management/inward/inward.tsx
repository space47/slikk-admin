/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA, USER_PROFILE_DATA } from '@/store/types/company.types'
import EasyTable from '@/common/EasyTable'
import { Option, pageSizeOptions, TableData } from './inwardCommon'
import AccessDenied from '@/views/pages/AccessDenied'
import { Button, Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { MdInventory } from 'react-icons/md'
import BrandShipmentsTable from '@/views/brandDashboard/brandShipments/brandShipmentsTable/BrandShipmentsTable'
import { LiaShippingFastSolid } from 'react-icons/lia'
import { InwardColumns } from './inwardUtils/InwardColumns'
import { useFetchApi } from '@/commonHooks/useFetchApi'

const PaginationTable = () => {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [globalFilter, setGlobalFilter] = useState<any>('')
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)

    console.log('selected Store', storeList)
    const [companyCode, setCompanyCode] = useState<any>()
    const [storeCode, setStoreCode] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState('tab2')

    const query = useMemo(() => {
        let filter = ''
        let code = ''
        let store = ''
        if (globalFilter) filter = `&document_number=${globalFilter}`
        if (companyCode) code = `&company_code=${encodeURIComponent(companyCode)}`
        if (storeCode && storeCode.length > 0) store = `&store_id=${encodeURIComponent(storeCode?.join(','))}`
        const response = `goods/received/${selectedCompany.id}?p=${page}&page_size=${pageSize}${filter}${code}${store}`
        return response
    }, [page, pageSize, globalFilter, companyCode, selectedCompany, storeCode])

    const { data, totalData, responseStatus } = useFetchApi<TableData>({ url: query, initialData: [] })

    const columns = InwardColumns({ companyList, storeList })
    const handleGRN = () => {
        navigate('/app/goods/received/form')
    }
    const handleChange = (tab: string) => {
        setActiveTab(tab)
        setPage(1)
    }

    if (responseStatus === 403) return <AccessDenied />

    return (
        <div>
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
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 mt-10">
                        <div className="flex flex-col lg:flex-row gap-6 w-full">
                            <div className="flex flex-col w-full max-w-xs">
                                <label className="font-semibold text-gray-700 mb-1">Search</label>
                                <input
                                    type="search"
                                    value={globalFilter}
                                    placeholder="Search by document No."
                                    className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col w-full max-w-xs">
                                <label className="font-semibold text-gray-700 mb-1">Select Company</label>
                                <Select
                                    isClearable
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    options={companyList}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id}
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
                                    getOptionValue={(option) => option.id}
                                    onChange={(selectedOptions) => {
                                        setStoreCode(selectedOptions?.map((opt) => opt.id) || [])
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <Button onClick={handleGRN} variant="new">
                                ADD GRN
                            </Button>
                        </div>
                    </div>

                    <EasyTable mainData={data} columns={columns} page={page} pageSize={pageSize} />
                    <div className="flex items-center justify-between mt-4">
                        <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={(page) => setPage(page)} />
                        <div style={{ minWidth: 130 }}>
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
                </>
            )}
        </div>
    )
}

export default PaginationTable
