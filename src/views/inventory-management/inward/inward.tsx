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
import { notification } from 'antd'
import PageCommon from '@/common/PageCommon'
import { FaPlus } from 'react-icons/fa'

const PaginationTable = () => {
    const navigate = useNavigate()
    const [inwardData, setInwardData] = useState<GRNDetails[]>([])
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [globalFilter, setGlobalFilter] = useState<any>('')
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const [companyCode, setCompanyCode] = useState<any>()
    const [storeCode, setStoreCode] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState('tab2')
    const inwardApiCall = inwardService.useInwardDataGetQuery(
        {
            id: selectedCompany.id,
            company: companyCode || '',
            store_id: storeCode?.join(',') || '',
            document_number: globalFilter || '',
            page,
            pageSize,
        },
        { refetchOnMountOrArgChange: true },
    )

    useEffect(() => {
        if (inwardApiCall.isSuccess) {
            setInwardData(inwardApiCall?.data?.data?.results)
            setCount(inwardApiCall?.data?.data?.count)
        }
        if (inwardApiCall.isError) {
            notification.error({ message: (inwardApiCall.error as any).data.message })
        }
    }, [inwardApiCall.isSuccess, inwardApiCall?.data?.data, inwardApiCall.isError, inwardApiCall.error])

    const columns = InwardColumns({ companyList, storeList })

    const handleChange = (tab: string) => {
        setActiveTab(tab)
        setPage(1)
    }

    if (inwardApiCall.isError && (inwardApiCall.error as any).status === 403) {
        return <AccessDenied />
    }

    return (
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
                        <div>
                            <Button variant="new" size="sm" icon={<FaPlus />} onClick={() => navigate('/app/goods/received/form')}>
                                ADD GRN
                            </Button>
                        </div>
                    </div>

                    <EasyTable mainData={inwardData} columns={columns} page={page} pageSize={pageSize} />
                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
                </>
            )}
        </div>
    )
}

export default PaginationTable
