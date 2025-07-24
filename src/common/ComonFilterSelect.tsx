/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FILTER_STATE } from '@/store/types/filters.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Field, FieldProps, useFormikContext } from 'formik'
import React, { useEffect, useState } from 'react'
import { IoMdAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'

interface props {
    setFilterId: (x: any) => void
    isEdit?: boolean
    filterId?: string
    customClass?: string
    isOnchange?: (x: any) => void
}

const CommonFilterSelect = ({ setFilterId, filterId, customClass, isOnchange }: props) => {
    const dispatch = useAppDispatch()
    const [showAddFilter, setShowAddFilter] = useState<number[]>([])
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [filtersData, setFiltersData] = useState<any[]>([])
    const { setFieldValue } = useFormikContext()
    console.log('initial values', filtersData)

    useEffect(() => {
        const fetchCriteria = async () => {
            if (filterId) {
                try {
                    const res = await axioisInstance.get(`/product/search/criteria?id=${filterId}`)
                    const data = res?.data?.data
                    if (data?.search_data) {
                        const initialVals = data.search_data.map((items: string[]) => items)
                        setShowAddFilter(
                            Array(data.search_data.length)
                                .fill(0)
                                .map((_, i) => i),
                        )

                        initialVals.forEach((val: string[], index: number) => {
                            setFieldValue(`filtersAdd[${index}]`, val)
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        fetchCriteria()
    }, [filterId, setFieldValue])

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const handleAddFilter = () => {
        setShowAddFilter([...showAddFilter, showAddFilter.length])
    }

    const handleRemoveFilter = (index: number) => {
        const updatedFilters = showAddFilter.filter((_, i) => i !== index)
        setShowAddFilter(updatedFilters)
        setFieldValue(`filtersAdd[${index}]`, undefined)
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
                <FormItem key={index} className="flex gap-2">
                    <div className="flex gap-3 items-center">
                        <Field key={index} name={`filtersAdd[${index}]`}>
                            {({ field, form }: FieldProps<any>) => {
                                const selectedOptions =
                                    field.value?.flatMap((value: any) =>
                                        filters?.filters?.flatMap((filterGroup) =>
                                            filterGroup?.options?.filter((option: any) => option.value === value),
                                        ),
                                    ) || []

                                return (
                                    <Select
                                        isMulti
                                        placeholder={`Filter Tags ${index + 1}`}
                                        options={filters.filters || []}
                                        value={selectedOptions}
                                        getOptionLabel={(option) => option.label}
                                        getOptionValue={(option) => option.value}
                                        className={`${!!customClass === true ? customClass : 'w-3/4'}`}
                                        onChange={
                                            isOnchange
                                                ? isOnchange
                                                : (newVal) => {
                                                      const newValues = newVal ? newVal.map((val) => val.value) : []
                                                      form.setFieldValue(field.name, newValues)
                                                  }
                                        }
                                    />
                                )
                            }}
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

export default CommonFilterSelect
