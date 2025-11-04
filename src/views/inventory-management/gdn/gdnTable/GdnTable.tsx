/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react'
import { GDN_TYPES } from '../commonGdn'
import { Button, Select, Spinner } from '@/components/ui'
import EasyTable from '@/common/EasyTable'
import { useNavigate } from 'react-router-dom'
import AccessDenied from '@/views/pages/AccessDenied'
import GdnDeleteModal from './components/GdnDeleteModal'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA, USER_PROFILE_DATA } from '@/store/types/company.types'
import PageCommon from '@/common/PageCommon'
import { useGdnColumns } from '../gdnUtils/useGdnColumns'
import { useFetchApi } from '@/commonHooks/useFetchApi'

const GdnTable = () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [storeGdnId, setStoreGdnId] = useState<number>()
    const navigate = useNavigate()
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const [companyCode, setCompanyCode] = useState<any>()
    const [storeCode, setStoreCode] = useState<any[]>([])

    const query = useMemo(() => {
        let code = ''
        let store = ''
        if (companyCode) code = `&company_code=${encodeURIComponent(companyCode)}`
        if (storeCode && storeCode.length > 0) store = `&store_id=${encodeURIComponent(storeCode?.join(','))}`
        return `/goods/dispatch?p=${page}&page_size=${pageSize}${code}${store}`
    }, [page, pageSize, storeCode, companyCode])

    const { data: gdnData, totalData, loading, responseStatus } = useFetchApi<GDN_TYPES>({ url: query })

    const handleDeleteClick = (id: number) => {
        setShowDeleteModal(true)
        setStoreGdnId(id)
    }

    const columns = useGdnColumns({ handleDeleteClick })

    if (responseStatus === 403) {
        return <AccessDenied />
    }

    return (
        <div className="p-2 shadow-xl rounded-xl ">
            <div className="flex justify-between items-center mb-5">
                <div className="flex gap-2">
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
            {loading && (
                <div className="flex items-center justify-center mt-2 mb-5">
                    <Spinner size={20} />
                </div>
            )}
            <div>
                <EasyTable overflow mainData={gdnData} columns={columns} page={page} pageSize={pageSize} />
            </div>
            <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalData} />
            {showDeleteModal && (
                <GdnDeleteModal setShowDeleteModal={setShowDeleteModal} showDeleteModal={showDeleteModal} storeGdnId={storeGdnId} />
            )}
        </div>
    )
}

export default GdnTable
