import { Button, Pagination, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { pageSettingsService } from '@/store/services/pageSettingService'
import {
    pageSettingsRequiredType,
    setPageSettingsData,
    setPage,
    setPageSize,
    setCount,
} from '@/store/slices/pageSettingsSlice/pageSettingsSlice'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePageSettingsColumns } from '../newPageSettingsUtils/usePageSettingsColumns'
import { Option, pageSizeOptions } from '@/constants/pageUtils.constants'
import LoadingSpinner from '@/common/LoadingSpinner'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import PageDraggavleTable from '../../pageSettings/PageDraggavleTable'
import { DropResult } from 'react-beautiful-dnd'

const NewPageSettingsTables = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { pageSettingsData, page, pageSize, count } = useAppSelector<pageSettingsRequiredType>((state) => state.pageSettings)
    const { data: pageSettings, isSuccess, isLoading } = pageSettingsService.usePageSettingsDataQuery({ page, pageSize })

    useEffect(() => {
        if (isSuccess) {
            dispatch(setPageSettingsData(pageSettings?.data?.results || []))
            dispatch(setCount(pageSettings?.data?.count || 0))
        }
    }, [dispatch, pageSettings])

    const reorderData = (startIndex: number, endIndex: number) => {
        const newData = [...(pageSettingsData || [])]
        const [movedRow] = newData.splice(startIndex, 1)
        newData.splice(endIndex, 0, movedRow)
        dispatch(setPageSettingsData(newData))
    }

    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result
        if (destination) reorderData(source.index, destination.index)
    }

    const columns = usePageSettingsColumns()
    const table = useReactTable({ data: pageSettingsData || [], columns, getCoreRowModel: getCoreRowModel() })

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <div className="flex justify-end mb-6">
                <Button type="button" variant="new" onClick={() => navigate(`/app/appSettings/newPageSettings/addNew`)}>
                    Add New
                </Button>
            </div>
            <div>
                <PageDraggavleTable table={table} handleDragEnd={handleDragEnd} />
            </div>
            <div className="flex justify-between mt-10">
                <div>
                    <Pagination
                        pageSize={pageSize}
                        currentPage={page}
                        total={count}
                        className="mb-4 md:mb-0"
                        onChange={(e) => dispatch(setPage(e))}
                    />
                </div>
                <div>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => {
                            if (option) {
                                dispatch(setPage(1))
                                dispatch(setPageSize(option?.value))
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default NewPageSettingsTables
