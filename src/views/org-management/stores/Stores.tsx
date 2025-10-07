import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { STORETABLE } from './commonStores'
import AccessDenied from '@/views/pages/AccessDenied'
import EasyTable from '@/common/EasyTable'
import PageCommon from '@/common/PageCommon'
import { useStoreColumn } from './storeUtil/useStoreColumn'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { Button } from '@/components/ui'
import ActiveStoreModal from './storesComponents/ActivateStoreModal'

const Stores = () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [currentStoreId, setCurrentStoreId] = useState<number | null>(null)
    const [isStoreAvailableModal, setStoreAvailableModal] = useState(false)
    const [checkActive, setCheckActive] = useState(false)

    const navigate = useNavigate()

    const query = useMemo(() => {
        return `merchant/store?p=${page}&page_size=${pageSize}`
    }, [page, pageSize])

    const handleActiveCareer = (id: number, e, checked: boolean) => {
        setCurrentStoreId(id)
        setStoreAvailableModal(true)
        setCheckActive(checked)
    }

    const { data, totalData, responseStatus } = useFetchApi<STORETABLE>({ url: query, initialData: [] })
    const columns = useStoreColumn({ handleActiveCareer })
    if (responseStatus === 403) return <AccessDenied />

    return (
        <div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        className="p-2 border rounded"
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>
                <div className="flex items-end justify-end mb-4 order-first xl:order-none">
                    <Button variant="new" size="sm" onClick={() => navigate('/app/stores/addNew')}>
                        ADD NEW
                    </Button>
                </div>
            </div>
            <EasyTable overflow mainData={data} columns={columns} page={page} pageSize={pageSize} />
            <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalData} />
            {isStoreAvailableModal && (
                <ActiveStoreModal
                    checked={checkActive}
                    isOpen={isStoreAvailableModal}
                    setIsOpen={setStoreAvailableModal}
                    storeId={currentStoreId as number}
                />
            )}
        </div>
    )
}

export default Stores
