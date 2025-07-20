/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Select, Tooltip } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FILTER_STATE } from '@/store/types/filters.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { IoMdAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'

interface Props {
    setFilterId: (x: any) => void
    isEdit?: boolean
    filterId?: string
    customClass?: string
    isOnchange?: (x: any, index: number) => void
}

const FilterSelectWithoutFormik = ({ setFilterId, filterId, customClass, isOnchange }: Props) => {
    const dispatch = useAppDispatch()
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [filtersData, setFiltersData] = useState<any[][]>([])
    const [filtersAdd, setFiltersAdd] = useState<any[][]>([])
    const [showAddFilter, setShowAddFilter] = useState<number[]>([])

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    useEffect(() => {
        const fetchCriteria = async () => {
            if (filterId) {
                try {
                    const res = await axioisInstance.get(`/product/search/criteria?id=${filterId}`)
                    const data = res?.data?.data
                    if (data?.search_data) {
                        setFiltersAdd(data.search_data)
                        setShowAddFilter(data.search_data.map((_, i: number) => i))
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        }
        fetchCriteria()
    }, [filterId])

    const handleAddFilter = () => {
        setShowAddFilter([...showAddFilter, showAddFilter.length])
        setFiltersAdd([...filtersAdd, []])
    }

    const handleRemoveFilter = (index: number) => {
        const updatedFilters = filtersAdd.filter((_, i) => i !== index)
        setFiltersAdd(updatedFilters)
        setShowAddFilter(updatedFilters.map((_, i) => i))
    }

    const handleSelectChange = (selected: any, index: number) => {
        const newValues = selected.map((val: any) => val.value)
        const updatedFilters = [...filtersAdd]
        updatedFilters[index] = newValues
        setFiltersAdd(updatedFilters)

        if (isOnchange) {
            isOnchange(newValues, index)
        }
    }

    const handleAddFilters = async () => {
        const newFilterData = filtersAdd.filter((entry) => Array.isArray(entry) && entry.length > 0)
        setFiltersData((prev) => {
            const updated = [...prev, newFilterData]
            const last = updated.at(-1)
            sendFilterData(last)
            return updated
        })
    }

    const sendFilterData = async (filterData: any) => {
        try {
            const response = await axioisInstance.post(`/product/search/criteria`, { filter_data: filterData })
            setFilterId(response.data?.data?.id)
            notification.success({
                message: 'Filter Id Added',
            })
        } catch (error) {
            notification.error({
                message: 'Failed to Add Filter ID',
            })
            console.error(error)
        }
    }

    return (
        <div>
            <FormContainer className="items-center flex flex-col xl:flex-row md:flex-row gap-2 items-center">
                <p className="font-bold">Filters {filterId ? <>(Id: {filterId})</> : ''}</p>
                <button type="button" onClick={handleAddFilter}>
                    <Tooltip title="Add new filters">
                        <IoMdAddCircle className="text-3xl text-green-500" />
                    </Tooltip>
                </button>
            </FormContainer>

            {showAddFilter.map((_, index) => {
                const selectedOptions =
                    filtersAdd[index]?.flatMap((value: any) =>
                        filters?.filters?.flatMap((group) => group?.options?.filter((option: any) => option.value === value)),
                    ) || []

                return (
                    <FormItem key={index} className="flex gap-2">
                        <div className="flex gap-3 items-center">
                            <Select
                                isMulti
                                placeholder={`Filter Tags ${index + 1}`}
                                options={filters.filters || []}
                                value={selectedOptions}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                className={`${customClass ? customClass : 'w-3/4'}`}
                                onChange={(selected) => handleSelectChange(selected, index)}
                            />
                            <button type="button" onClick={() => handleRemoveFilter(index)}>
                                <MdCancel className="text-xl text-red-500" />
                            </button>
                        </div>
                    </FormItem>
                )
            })}

            {showAddFilter.length > 0 && (
                <div className="mt-4">
                    <Button type="button" variant="new" onClick={handleAddFilters}>
                        Search Strings
                    </Button>
                </div>
            )}
        </div>
    )
}

export default FilterSelectWithoutFormik
