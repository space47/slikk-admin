/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FILTER_STATE } from '@/store/types/filters.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Field, FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'
import { IoMdAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'

interface props {
    setFilterId: (x: any) => void
}

const ComonFilterSelect = ({ setFilterId }: props) => {
    const dispatch = useAppDispatch()
    const [showAddFilter, setShowAddFilter] = useState<number[]>([])
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [filtersData, setFiltersData] = useState<any[]>([])
    console.log(filtersData)
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])
    const handleAddFilter = () => {
        setShowAddFilter([...showAddFilter, showAddFilter.length])
    }

    const handleRemoveFilter = (index: number) => {
        const updatedFilters = showAddFilter.filter((_, i) => i !== index)
        setShowAddFilter(updatedFilters)
    }

    const handleAddFilters = async (values: any) => {
        const newFilterData = showAddFilter.map((_, index) => values.filtersAdd[index] || [])
        setFiltersData((prev) => {
            const updatedFilters = [...prev, newFilterData]
            const lastElement = updatedFilters.at(-1)
            sendFilterData(lastElement)
            return updatedFilters
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
            <div className="font-bold mb-7">Filters:</div>
            <FormContainer className="items-center mt-4">
                <button type="button" onClick={handleAddFilter}>
                    <IoMdAddCircle className="text-3xl text-green-500" />
                </button>
            </FormContainer>

            {showAddFilter.map((_, index: any) => (
                <FormItem key={index} className="flex  gap-2">
                    <div className="flex gap-3 items-center">
                        <Field key={index} name={`filtersAdd[${index}]`}>
                            {({ field, form }: FieldProps<any>) => (
                                <Select
                                    isMulti
                                    placeholder={`Filter Tags ${index + 1}`}
                                    options={filters.filters}
                                    getOptionLabel={(option) => option.label}
                                    getOptionValue={(option) => option.value}
                                    className="w-3/4"
                                    onChange={(newVal) => {
                                        const newValues = newVal ? newVal.map((val) => val.value) : []
                                        form.setFieldValue(field.name, newValues)
                                    }}
                                />
                            )}
                        </Field>
                        <div className="">
                            <button type="button" className="" onClick={() => handleRemoveFilter(index)}>
                                <MdCancel className="text-xl text-red-500" />
                            </button>
                        </div>
                    </div>
                </FormItem>
            ))}

            {showAddFilter.length > 0 && (
                <>
                    <Field>
                        {({ form }: FieldProps<any>) => (
                            <Button type="button" variant="new" onClick={() => handleAddFilters(form.values)}>
                                Search Strings
                            </Button>
                        )}
                    </Field>
                </>
            )}
        </div>
    )
}

export default ComonFilterSelect
