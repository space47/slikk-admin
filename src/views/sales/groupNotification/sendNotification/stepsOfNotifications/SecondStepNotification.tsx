/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'
import { IoMdAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import { OFFARRAY } from '../sendNotify.common'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import { pageSettingsService } from '@/store/services/pageSettingService'

interface SecondStepNotification {
    values: any
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
    values,
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
    const [subPageNamesData, setSubPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [pageNamesData, setPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [selectedPageName, setSelectedPageName] = useState<string | undefined>(undefined)

    const { data: SubPageNames, isSuccess: isSubPageNamesSuccess } = pageSettingsService.useSubPageNamesQuery({
        pageName: selectedPageName || '',
    })

    const { data: pageNames, isSuccess: isPageNamesSuccess } = pageSettingsService.usePageNamesQuery({
        page: 1,
        pageSize: 500,
    })

    useEffect(() => {
        if (isPageNamesSuccess) {
            setPageNamesData(pageNames?.data?.results || [])
        }
    }, [pageNames, isPageNamesSuccess])

    useEffect(() => {
        if (isSubPageNamesSuccess) {
            setSubPageNamesData(SubPageNames?.data || [])
        }
    }, [isSubPageNamesSuccess, SubPageNames, selectedPageName])

    console.log('groupDatatoSend', values?.groupId)
    return (
        <div className="space-y-6 shadow-lg rounded-lg px-14 py-9 mt-10">
            <div className="text-xl font-bold">Select Filters</div>
            <div className="grid xl:grid-cols-2 grid-cols-1  gap-10">
                <FormItem label={'Group Ids'} className={'col-span-1 w-full'}>
                    <Field name="groupId">
                        {({ field, form }: FieldProps<any>) => {
                            return (
                                <Select
                                    isClearable
                                    options={groupDatatoSend}
                                    value={groupDatatoSend.find((option) => option.name === field.value)}
                                    getOptionLabel={(option: any) => option.name}
                                    getOptionValue={(option: any) => option.name}
                                    onChange={(option) => {
                                        const value = option ? option.value : ''
                                        form.setFieldValue(field.name, option)
                                        console.log('FIELD.NAME', value)
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                />
                            )
                        }}
                    </Field>
                    {values?.groupId && (
                        <div className="mt-4 px-4 py-2 rounded-md bg-blue-50 border border-blue-200 text-blue-800 font-medium shadow-sm w-fit">
                            Users: {values?.groupId?.user?.length || 0}
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

                <div>
                    <FormItem label="Is Custom" className="w-full xl:w-2/3">
                        <Field type="checkbox" name="is_custom" component={Checkbox} />
                    </FormItem>
                </div>
                {values?.is_custom && (
                    <>
                        <FormItem label="Page">
                            <Field name="page">
                                {({ form, field }: FieldProps) => {
                                    console.log('field.value', field.value)
                                    const selectedPage =
                                        typeof field?.value === 'object'
                                            ? pageNamesData?.find((option) => option.name === field?.value?.name)
                                            : pageNamesData?.find((option) => option.name === field?.value)
                                    return (
                                        <div className="flex flex-col gap-1 w-full max-w-md">
                                            <Select
                                                isClearable
                                                className="w-full"
                                                options={pageNamesData}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id}
                                                value={selectedPage || null}
                                                onChange={(newVal) => {
                                                    console.log('inside  select', newVal)
                                                    const name = newVal?.name
                                                    form.setFieldValue('page', name)
                                                    setSelectedPageName(name)
                                                }}
                                            />
                                        </div>
                                    )
                                }}
                            </Field>
                        </FormItem>
                        <FormContainer>
                            <FormItem label="Sub Page">
                                <Field name="sub_page">
                                    {({ form, field }: FieldProps) => {
                                        const selectedSubPage =
                                            typeof field?.value === 'object'
                                                ? subPageNamesData?.find((option) => option.name === field?.value?.name)
                                                : subPageNamesData?.find((option) => option.name === field?.value)
                                        return (
                                            <div className="flex flex-col gap-1 w-full max-w-md">
                                                <Select
                                                    isClearable
                                                    className="w-full"
                                                    options={subPageNamesData}
                                                    getOptionLabel={(option) => option.name}
                                                    getOptionValue={(option) => option.id}
                                                    value={selectedSubPage || null}
                                                    onChange={(newVal) => {
                                                        console.log('inside sub page select', newVal)
                                                        const name = newVal?.name
                                                        form.setFieldValue('sub_page', name)
                                                    }}
                                                />
                                            </div>
                                        )
                                    }}
                                </Field>
                            </FormItem>
                        </FormContainer>
                    </>
                )}

                {values?.is_custom === false && (
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
                )}
            </div>
        </div>
    )
}

export default SecondStepNotification
