/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Button, Input, Select, Spinner } from '@/components/ui'
import EasyTable from '@/common/EasyTable'
import { useNavigate } from 'react-router-dom'
import AccessDenied from '@/views/pages/AccessDenied'
import GdnDeleteModal from './components/GdnDeleteModal'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA, USER_PROFILE_DATA } from '@/store/types/company.types'
import PageCommon from '@/common/PageCommon'
import { useGdnColumns } from '../gdnUtils/useGdnColumns'
import { gdnService } from '@/store/services/gdnService'
import { GDNDetails } from '@/store/types/gdn.types'
import { notification } from 'antd'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'

const GdnTable = () => {
    const [gdnData, setGdnData] = useState<GDNDetails[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [storeGdnId, setStoreGdnId] = useState<number>()
    const navigate = useNavigate()
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const [companyCode, setCompanyCode] = useState<any>()
    const [storeCode, setStoreCode] = useState<any[]>([])
    const { debounceFilter } = useDebounceInput({ globalFilter, delay: 500 })
    const gdnTableData = gdnService.useGdnDataGetQuery({
        page: page,
        pageSize: pageSize,
        company: companyCode || '',
        store_id: storeCode?.join(',') || '',
        document_number: debounceFilter || '',
    })

    useEffect(() => {
        if (gdnTableData.isSuccess) {
            setGdnData(gdnTableData?.data?.data?.results)
            setCount(gdnTableData?.data?.data?.count)
        }
        if (gdnTableData.isError) {
            notification.error({ message: (gdnTableData?.error as any).data.message || 'Data failed to load' })
        }
    }, [gdnTableData.isSuccess, gdnTableData?.data?.data, gdnTableData.isError, gdnTableData.error])

    const handleDeleteClick = (id: number) => {
        setShowDeleteModal(true)
        setStoreGdnId(id)
    }

    const columns = useGdnColumns({ handleDeleteClick })

    if (gdnTableData.isError && (gdnTableData.error as any).status === 403) {
        return <AccessDenied />
    }

    return (
        <div className="p-2 shadow-xl rounded-xl ">
            <div className="flex justify-between items-center mb-5">
                <div className="flex gap-2">
                    <div className="flex flex-col">
                        <label className="font-semibold text-gray-700 mb-1">Search</label>
                        <Input
                            type="search"
                            value={globalFilter}
                            placeholder="Search by document number"
                            className="h-1/2 rounded-lg"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col xl:w-[300px] md:w-[200px] w-full">
                        <label className="font-semibold text-gray-700 mb-1">Select Company</label>
                        <Select
                            isClearable
                            className="react-select-container "
                            classNamePrefix="react-select"
                            options={companyList}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id?.toString()}
                            onChange={(newVal) => setCompanyCode(newVal?.code)}
                        />
                    </div>
                    <div className="flex flex-col xl:w-[300px] md:w-[200px] w-full">
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
                <div className="">
                    <Button variant="new" onClick={() => navigate(`/app/goods/gdn/addNew`)}>
                        Add GDN
                    </Button>
                </div>
            </div>
            {(gdnTableData.isLoading || gdnTableData.isFetching) && (
                <div className="flex items-center justify-center mt-2 mb-5">
                    <Spinner size={20} />
                </div>
            )}
            <div>
                <EasyTable overflow mainData={gdnData} columns={columns} page={page} pageSize={pageSize} />
            </div>
            <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
            {showDeleteModal && (
                <GdnDeleteModal
                    setShowDeleteModal={setShowDeleteModal}
                    showDeleteModal={showDeleteModal}
                    storeGdnId={storeGdnId}
                    refetch={gdnTableData.refetch}
                />
            )}
        </div>
    )
}

export default GdnTable
