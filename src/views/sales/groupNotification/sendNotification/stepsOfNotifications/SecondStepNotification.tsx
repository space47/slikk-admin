/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'
import { DISCOUNTOPTIONS, targetPageArray } from '../sendNotify.common'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import { pageSettingsService } from '@/store/services/pageSettingService'
import CommonFilterSelect from '@/common/ComonFilterSelect'

interface SecondStepNotification {
    values: any
    setFilterId: React.Dispatch<React.SetStateAction<string>>
    filterId: string
    excludeFilterId: string
    setExcludeFilterId: React.Dispatch<React.SetStateAction<string | number>>
}

const SecondStepNotification = ({ values, setFilterId, filterId, excludeFilterId, setExcludeFilterId }: SecondStepNotification) => {
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

            <CommonFilterSelect isCsv isSku values={values} setFilterId={setFilterId} filterId={filterId} />
            <div className="mb-4">
                <CommonFilterSelect isEdit isExclude filterId={excludeFilterId as string} setFilterId={setExcludeFilterId} />
            </div>

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

                {!values?.is_custom && (
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
                {values?.target_page?.toLowerCase() === 'home' && (
                    <FormItem label="Target Sub Page">
                        <Field type="text" name="sub" component={Input} placeholder="Enter target Sub Page" />
                    </FormItem>
                )}

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
                                                getOptionValue={(option) => option.id?.toString()}
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
                                                    getOptionValue={(option) => option.id?.toString()}
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
            </div>
        </div>
    )
}

export default SecondStepNotification
