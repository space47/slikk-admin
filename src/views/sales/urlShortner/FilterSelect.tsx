/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { IoMdAddCircle } from 'react-icons/io'
import { Field, FieldProps } from 'formik'
import { Button, Input, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FILTER_STATE } from '@/store/types/filters.types'
import { MdCancel } from 'react-icons/md'
import { MAXMINARRAY, OFFARRAY } from '../groupNotification/sendNotification/sendNotify.common'

interface FILTERPROPS {
    handleAddFilter: any
    showAddFilter: any
    handleRemoveFilter: any
    handleAddFilters: any
}

const DISCOUNTOPTIONS = [
    { value: 'sort_lowtohigh', label: 'Low to High' },
    { value: 'sort_hightolow', label: 'High to Low' },
    { value: 'sort_discount', label: 'DISCOUNT' },
]

const targetPageArray = [
    { label: 'product', value: 'product' },
    { label: 'productListing', value: 'products' },
    { label: 'wishlist', value: 'wishlist' },
    { label: 'order', value: 'order' },
    { label: 'cart', value: 'cart' },
]

const FilterSelect = ({ handleAddFilter, showAddFilter, handleRemoveFilter, handleAddFilters }: FILTERPROPS) => {
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [])
    return (
        <div>
            {' '}
            <FormItem label="SEARCH STRINGS">
                <FormContainer className="items-center mt-4">
                    <button onClick={handleAddFilter} type="button">
                        <IoMdAddCircle className="text-3xl text-green-500" />
                    </button>
                </FormContainer>

                {showAddFilter.map((_, index: any) => (
                    <FormItem key={index} className="flex  gap-2">
                        <div className="flex gap-3 items-center">
                            <Field name={`filtersAdd[${index}]`} key={index}>
                                {({ field, form }: FieldProps<any>) => (
                                    <Select
                                        isMulti
                                        placeholder={`Filter Tags ${index + 1}`}
                                        options={filters.filters}
                                        getOptionLabel={(option) => option.label}
                                        getOptionValue={(option) => option.value}
                                        onChange={(newVal) => {
                                            const newValues = newVal ? newVal.map((val) => val.value) : []
                                            form.setFieldValue(field.name, newValues)
                                        }}
                                        className="w-3/4"
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
                                <Button variant="new" onClick={() => handleAddFilters(form.values)} type="button">
                                    Search Strings
                                </Button>
                            )}
                        </Field>
                    </>
                )}
            </FormItem>
            <FormContainer className="flex gap-3 flex-col xl:flex-row">
                {MAXMINARRAY.map((item, key) => (
                    <FormItem key={key} label={item.label} className="w-full xl:w-2/3">
                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                    </FormItem>
                ))}
            </FormContainer>
            <FormContainer className="flex gap-3 flex-col xl:flex-row">
                {OFFARRAY.map((item, key) => (
                    <FormItem key={key} label={item.label} className="w-full xl:w-2/3">
                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                    </FormItem>
                ))}
            </FormContainer>
            <div className="flex flex-col">
                <div>Sort By</div>
                <Field name="discountTags">
                    {({ field, form }: FieldProps<any>) => {
                        return (
                            <Select
                                isMulti
                                placeholder="Discount Tags"
                                options={DISCOUNTOPTIONS}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                onChange={(newVal) => {
                                    const newValues = newVal ? newVal.map((val) => val.value) : []
                                    form.setFieldValue(field.name, newValues)
                                }}
                            />
                        )
                    }}
                </Field>
            </div>
            <FormItem label="Target Page">
                <Field name="target_page">
                    {({ field, form }: FieldProps<any>) => {
                        return (
                            <Select
                                placeholder="Select Target Page"
                                options={targetPageArray}
                                value={targetPageArray.find((option) => option.value === field.value)}
                                onChange={(option) => form.setFieldValue(field.name, option?.value)}
                            />
                        )
                    }}
                </Field>
            </FormItem>
        </div>
    )
}

export default FilterSelect
