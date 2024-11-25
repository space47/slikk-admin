/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { IoMdAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import { OFFARRAY } from '../sendNotify.common'

interface SecondStepNotification {
    notificationTypeArray: any[]
    groupValue: any
    setGroupValue: any
    groupDatatoSend: any[]
    clickedGuarantee: any
    hanldeGroupSearch: any
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
    notificationTypeArray,
    groupValue,
    setGroupValue,
    groupDatatoSend,
    clickedGuarantee,
    hanldeGroupSearch,
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
                <FormItem label="Group Name" className="w-full xl:w-2/3 items-center">
                    <input
                        type="text"
                        name="group_name"
                        placeholder="Enter Group name"
                        value={groupValue}
                        onChange={(e) => setGroupValue(e.target.value)}
                    />

                    {groupValue && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                            {groupDatatoSend?.map((item, key) => (
                                <div key={key} className="flex items-center justify-center">
                                    <div
                                        className={
                                            clickedGuarantee[item?.name]
                                                ? 'px-6 py-2 bg-gray-500 text-green-200 font-semibold rounded-lg shadow-md transition duration-300 ease-in-out cursor-pointer'
                                                : 'px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out cursor-pointer'
                                        }
                                        onClick={() => hanldeGroupSearch(item?.name)}
                                    >
                                        {item?.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </FormItem>

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
