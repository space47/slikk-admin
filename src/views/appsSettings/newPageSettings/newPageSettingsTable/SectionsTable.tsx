import LoadingSpinner from '@/common/LoadingSpinner'
import { pageSettingsService } from '@/store/services/pageSettingService'
import { pageSettingsRequiredType } from '@/store/slices/pageSettingsSlice/pageSettingsSlice'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSectionsColumns } from '../newPageSettingsUtils/useSectionsColumns'
import EasyTable from '@/common/EasyTable'
import { Button } from '@/components/ui'

const SectionsTable = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [sectionsData, setSectionsData] = useState<pageSettingsRequiredType[]>([])
    const { data, isSuccess, isLoading } = pageSettingsService.usePageSettingsDataQuery({
        page: 1,
        pageSize: 100,
        section_id: Number(id),
    })

    useEffect(() => {
        if (isSuccess) {
            setSectionsData([data?.data] as pageSettingsRequiredType[])
        }
    }, [isSuccess, data, id])

    const columns = useSectionsColumns()

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="p-4 shadow-lg rounded-xl flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div className="text-xl font-bold">Sections Date</div>

                <div className="flex gap-2">
                    <Button type="button" variant="new" onClick={() => navigate(`/app/appSettings/newPageSettings/addNew`)}>
                        New Section
                    </Button>
                </div>
            </div>
            <div>
                <EasyTable noPage overflow mainData={sectionsData} columns={columns} />
            </div>
        </div>
    )
}

export default SectionsTable
