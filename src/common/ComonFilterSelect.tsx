/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FILTER_STATE } from '@/store/types/filters.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Field, FieldProps, useFormikContext } from 'formik'
import React, { useEffect, useReducer, useState } from 'react'
import { IoMdAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'

interface props {
    setFilterId: (x: any) => void
    isEdit?: boolean
    filterId?: string
    customClass?: string
    isOnchange?: (x: any) => void
    isExclude?: boolean
}

type state = {
    max_discount: number | null
    min_discount: number | null
    max_price: number | null
    min_price: number | null
}

type Action =
    | { type: 'SET_MAX_DISCOUNT'; payload: number | null }
    | { type: 'SET_MIN_DISCOUNT'; payload: number | null }
    | { type: 'SET_MAX_PRICE'; payload: number | null }
    | { type: 'SET_MIN_PRICE'; payload: number | null }

const initialState: state = {
    max_discount: null,
    min_discount: null,
    max_price: null,
    min_price: null,
}

const reducer = (state: state, action: Action): state => {
    switch (action.type) {
        case 'SET_MAX_DISCOUNT':
            return { ...state, max_discount: action.payload }
        case 'SET_MIN_DISCOUNT':
            return { ...state, min_discount: action.payload }
        case 'SET_MAX_PRICE':
            return { ...state, max_price: action.payload }
        case 'SET_MIN_PRICE':
            return { ...state, min_price: action.payload }
        default:
            return state
    }
}

const CommonFilterSelect = ({ setFilterId, filterId, customClass, isOnchange, isExclude }: props) => {
    const dispatch = useAppDispatch()
    const [showAddFilter, setShowAddFilter] = useState<number[]>([])
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [filtersData, setFiltersData] = useState<any[]>([])
    const [state, dispatchState] = useReducer(reducer, initialState)
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
        const additionalData = {
            max_discount: state.max_discount || '',
            min_discount: state.min_discount || '',
            max_price: state.max_price || '',
            min_price: state.min_price || '',
        }

        const filterDataWithAdditional = Object.fromEntries(
            Object.entries(additionalData).filter(([, value]) => value !== null && value !== ''),
        )

        const body = {
            filter_data: filterData,
            extra_filters: filterDataWithAdditional,
        }
        try {
            const response = await axioisInstance.post(`/product/search/criteria`, body)
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
            <div className="font-bold mb-7">{isExclude ? 'Excluded Filters:' : 'Filters:'}</div>
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
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <FormItem label="Max Discount for Filters">
                            <Field name="max_discount">
                                {({ field }: FieldProps<any>) => (
                                    <input
                                        type="number"
                                        placeholder="Max Discount"
                                        className="w-full p-2 border rounded"
                                        {...field}
                                        onChange={(e) =>
                                            dispatchState({
                                                type: 'SET_MAX_DISCOUNT',
                                                payload: e.target.value ? parseFloat(e.target.value) : null,
                                            })
                                        }
                                    />
                                )}
                            </Field>
                        </FormItem>
                        <FormItem label="Min Discount for Filters">
                            <Field name="min_discount">
                                {({ field }: FieldProps<any>) => (
                                    <input
                                        type="number"
                                        placeholder="Min Discount"
                                        className="w-full p-2 border rounded"
                                        {...field}
                                        onChange={(e) =>
                                            dispatchState({
                                                type: 'SET_MIN_DISCOUNT',
                                                payload: e.target.value ? parseFloat(e.target.value) : null,
                                            })
                                        }
                                    />
                                )}
                            </Field>
                        </FormItem>
                        <FormItem label="Max Price for Filters">
                            <Field name="max_price">
                                {({ field }: FieldProps<any>) => (
                                    <input
                                        type="number"
                                        placeholder="Max Price"
                                        className="w-full p-2 border rounded"
                                        {...field}
                                        onChange={(e) =>
                                            dispatchState({
                                                type: 'SET_MAX_PRICE',
                                                payload: e.target.value ? parseFloat(e.target.value) : null,
                                            })
                                        }
                                    />
                                )}
                            </Field>
                        </FormItem>
                        <FormItem label="Min Price for Filters">
                            <Field name="min_price">
                                {({ field }: FieldProps<any>) => (
                                    <input
                                        type="number"
                                        placeholder="Min Price"
                                        className="w-full p-2 border rounded"
                                        {...field}
                                        onChange={(e) =>
                                            dispatchState({
                                                type: 'SET_MIN_PRICE',
                                                payload: e.target.value ? parseFloat(e.target.value) : null,
                                            })
                                        }
                                    />
                                )}
                            </Field>
                        </FormItem>
                    </div>
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
