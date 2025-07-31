/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { IoMdAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import { OFFARRAY } from '../sendNotify.common'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'

interface SecondStepNotification {
    notificationTypeArray: any[]
    groupDatatoSend: any[]
    handleAddFilter: any
    showAddFilter: any
    filters: any
    handleRemoveFilter: any
    MAXMINARRAY: any
    DISCOUNTOPTIONS: any
    targetPageArray: any
    handleAddFilters: any
}

const SecondStepNotification = ({
    groupDatatoSend,
    handleAddFilter,
    showAddFilter,
    filters,
    handleRemoveFilter,
    MAXMINARRAY,
    DISCOUNTOPTIONS,
    targetPageArray,
    handleAddFilters,
}: SecondStepNotification) => {
    return (
        <div className="space-y-6 shadow-lg rounded-lg px-14 py-9 mt-10">
            <div className="text-xl font-bold">Select Filters</div>
            <div className="grid xl:grid-cols-2 grid-cols-1  gap-10">
                <CommonSelect name="groupIds" options={groupDatatoSend} label="Group Id" />

                <FormItem label="SEARCH FILTER STRINGS">
                    <FormContainer className="items-center mt-4">
                        <button onClick={handleAddFilter} type="button">
                            <IoMdAddCircle className="text-3xl text-green-500" />
                        </button>
                    </FormContainer>

                    {showAddFilter.map((item: any) => (
                        <FormItem key={item} className="flex  gap-2">
                            <div className="flex gap-3 items-center">
                                <Field name={`filtersAdd[${item}]`} key={item}>
                                    {({ field, form }: FieldProps<any>) => (
                                        <Select
                                            isMulti
                                            isClearable
                                            placeholder={`Select Filter Tags `}
                                            options={filters.filters}
                                            getOptionLabel={(option: any) => option.label}
                                            getOptionValue={(option: any) => option.value}
                                            onChange={(newVal) => {
                                                const newValues = newVal ? newVal.map((val) => val.value) : []
                                                form.setFieldValue(field.name, newValues)
                                            }}
                                            className="w-3/4"
                                        />
                                    )}
                                </Field>
                                <div className="">
                                    <button type="button" className="" onClick={() => handleRemoveFilter(item)}>
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
            </div>

            <FormContainer className="flex gap-3 flex-col xl:flex-row">
                {MAXMINARRAY.map((item: any, key: any) => (
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

            <div className="grid xl:grid-cols-2 grid-cols-1 gap-10 ">
                <div className="flex flex-col">
                    <div className="font-bold mb-2">Sort By</div>
                    <Field name="discountTags">
                        {({ field, form }: FieldProps<any>) => {
                            return (
                                <Select
                                    isClearable
                                    isMulti
                                    placeholder="Discount Tags"
                                    options={DISCOUNTOPTIONS}
                                    getOptionLabel={(option: any) => option.label}
                                    getOptionValue={(option: any) => option.value}
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
                                    isClearable
                                    placeholder="Select Target Page"
                                    options={targetPageArray}
                                    value={targetPageArray.find((option: any) => option.value === field.value)}
                                    onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                />
                            )
                        }}
                    </Field>
                </FormItem>
            </div>
        </div>
    )
}

export default SecondStepNotification
