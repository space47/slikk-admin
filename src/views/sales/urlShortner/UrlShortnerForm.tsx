/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, FormContainer, FormItem, Input, Select, Spinner } from '@/components/ui'
import { Field, FieldProps, Form } from 'formik'
import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { URLARRAY } from './urlShortner.common'
import FilterSelect, { targetPageArray } from './FilterSelect'
import { UtmArray } from '../groupNotification/sendNotification/sendNotify.common'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import BannerFields from '@/common/BannerFields'
import { useFetchApi } from '@/commonHooks/useFetchApi'

interface props {
    values: any
    pageNamesData: pageNameTypes[] | undefined
    setSelectedPageName: Dispatch<SetStateAction<string | undefined>>
    subPageNamesData: pageNameTypes[] | undefined
    setFilterId: Dispatch<SetStateAction<undefined>>
    setFieldValues: any
}

const UrlShortnerForm = ({ values, pageNamesData, setSelectedPageName, subPageNamesData, setFilterId, setFieldValues }: props) => {
    const query = useMemo(() => {
        return `banners?p=1&page_size=1000&page=${values?.page || ''}`
    }, [])

    const { data: bannerDetails, loading: bannerLoading } = useFetchApi<any>({ url: query })

    return (
        <div className="mx-auto">
            <Form className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
                <FormContainer className="space-y-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Link Configuration</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                {URLARRAY.slice(0, 1).map((item, key) => (
                                    <FormItem key={key} label={item.label} className={`transition-all duration-200 ${item.classname}`}>
                                        <div className="relative">
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={item?.type === 'checkbox' ? Checkbox : Input}
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>
                                    </FormItem>
                                ))}

                                <FormItem
                                    label={
                                        <span className="flex items-center gap-2">
                                            <span className="text-gray-700 dark:text-gray-200 font-medium">Target Page</span>
                                        </span>
                                    }
                                >
                                    <Field name="target_page">
                                        {({ field, form }: FieldProps<any>) => (
                                            <Select
                                                isClearable
                                                placeholder={
                                                    <div className="text-gray-400 flex items-center gap-2">
                                                        <span>📄</span>
                                                        Select Target Page
                                                    </div>
                                                }
                                                options={targetPageArray}
                                                defaultValue={field.value}
                                                value={targetPageArray.find((option) => option.value === field.value)}
                                                onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        padding: '4px 8px',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '12px',
                                                        backgroundColor: 'var(--tw-bg-opacity)',
                                                    }),
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {values?.target_page === 'products' && (
                                    <FormItem label="Page Title" className="animate-fadeIn">
                                        <Field
                                            type="text"
                                            name="page_title"
                                            placeholder="Enter Page Title"
                                            component={Input}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </FormItem>
                                )}
                                <FormItem label="SearchBy Name" className="animate-fadeIn">
                                    <Field
                                        type="text"
                                        name="search_key"
                                        placeholder="Enter name through which you want to search"
                                        component={Input}
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </FormItem>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormItem
                                        label={
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                                <span className="text-gray-800 dark:text-gray-100">App Only</span>
                                            </span>
                                        }
                                    >
                                        <Field type="checkbox" name="app" component={Checkbox} />
                                    </FormItem>
                                    <FormItem
                                        label={
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                                                <span className="text-gray-800 dark:text-gray-100">Is Custom</span>
                                            </span>
                                        }
                                    >
                                        <Field type="checkbox" name="is_custom" component={Checkbox} />
                                    </FormItem>
                                </div>

                                {values?.is_custom === true && (
                                    <FormItem label="Custom Page" className="animate-fadeIn">
                                        <Field name="page">
                                            {({ form, field }: FieldProps) => {
                                                const selectedPage =
                                                    typeof field?.value === 'object'
                                                        ? pageNamesData?.find(
                                                              (option) => option.name === decodeURIComponent(field?.value?.name),
                                                          )
                                                        : pageNamesData?.find((option) => option.name === decodeURIComponent(field?.value))
                                                return (
                                                    <div className="flex flex-col gap-2 w-full">
                                                        <Select
                                                            isClearable
                                                            className="w-full"
                                                            options={pageNamesData}
                                                            getOptionLabel={(option) => option.name}
                                                            getOptionValue={(option) => option.id?.toString()}
                                                            value={selectedPage || null}
                                                            onChange={(newVal) => {
                                                                form.setFieldValue('page', newVal)
                                                                const name = typeof newVal === 'object' ? newVal?.name : newVal
                                                                setSelectedPageName(name)
                                                            }}
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    padding: '4px 8px',
                                                                    border: '1px solid #e5e7eb',
                                                                    borderRadius: '12px',
                                                                }),
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                )}

                                {(values?.target_page === 'home' || values?.is_custom === true) && (
                                    <FormItem label="Sub Page" className="animate-fadeIn">
                                        <Field name="sub_page">
                                            {({ form, field }: FieldProps) => {
                                                const selectedSubPage =
                                                    typeof field?.value === 'object'
                                                        ? subPageNamesData?.find(
                                                              (option) => option.name === decodeURIComponent(field?.value?.name),
                                                          )
                                                        : subPageNamesData?.find(
                                                              (option) => option.name === decodeURIComponent(field?.value),
                                                          )
                                                return (
                                                    <div className="flex flex-col gap-2 w-full">
                                                        <Select
                                                            isClearable
                                                            className="w-full"
                                                            options={subPageNamesData}
                                                            getOptionLabel={(option) => option.name}
                                                            getOptionValue={(option) => option.id?.toString()}
                                                            value={selectedSubPage || null}
                                                            onChange={(newVal) => form.setFieldValue('sub_page', newVal)}
                                                            styles={{
                                                                control: (base) => ({
                                                                    ...base,
                                                                    padding: '4px 8px',
                                                                    border: '1px solid #e5e7eb',
                                                                    borderRadius: '12px',
                                                                }),
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* UTM Section */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">UTM Parameters</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {UtmArray.map((item, key) => (
                                <FormItem
                                    key={key}
                                    label={item?.label}
                                    className="transition-all duration-200 hover:transform hover:scale-[1.02]"
                                >
                                    <Field
                                        type={item.type}
                                        name={item.name}
                                        placeholder={item.placeholder}
                                        component={item?.type === 'checkbox' ? Checkbox : Input}
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </FormItem>
                            ))}
                        </div>
                    </div>

                    {/* Advance Settings */}
                    <div className="space-y-6">
                        <FormItem label="Advance Settings">
                            <Field type="checkbox" name="select_filter" component={Checkbox} />
                        </FormItem>

                        {values.select_filter && (
                            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-orange-200 dark:border-gray-700 space-y-6 animate-fadeIn">
                                <FormItem label="Enable Banner">
                                    <Field type="checkbox" name="is_banner" component={Checkbox} />
                                </FormItem>

                                {values?.is_banner &&
                                    (bannerLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Spinner size={24} className="text-blue-500" />
                                            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading banner details...</span>
                                        </div>
                                    ) : (
                                        <BannerFields values={values} setFieldValues={setFieldValues} bannerData={bannerDetails} />
                                    ))}

                                <FilterSelect filterValue={values?.filter_id} setFilterId={setFilterId} />
                            </div>
                        )}
                    </div>

                    {/* Bottom URL Fields */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        {URLARRAY.slice(1).map((item, key) => (
                            <FormItem key={key} label={item?.label} className="transition-all duration-200">
                                <Field
                                    type={item.type}
                                    name={item.name}
                                    placeholder={item.placeholder}
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                            </FormItem>
                        ))}
                    </div>

                    <FormContainer className="flex justify-end pt-6">
                        <Button variant="accept" type="submit">
                            <span className="flex items-center gap-2">Submit Configuration</span>
                        </Button>
                    </FormContainer>
                </FormContainer>
            </Form>
        </div>
    )
}

export default UrlShortnerForm
