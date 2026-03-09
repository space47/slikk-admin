/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Select, Switcher } from '@/components/ui'
import { FashionList } from '@/constants/commonArray.constant'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { companyStore, StoreDetails } from '@/store/types/companyStore.types'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { Field, FieldArray, FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { getBgColor, getBorderColor } from './reportAnalyticsUtils'

interface ReportFieldsProps {
    values: any[]
    reportQueryArray: any[]
    optionDataMap: any
    storeName: any
}

interface FieldRendererProps {
    item: any
    index: number
    parentIndex: string
    reportQueryArray: any[]
    optionDataMap: any
    showInfo: boolean
    storeResults: StoreDetails[]
    companyList: SINGLE_COMPANY_DATA[]
    depth: number
}

const FieldRenderer = ({
    item,
    index,
    parentIndex = '',
    reportQueryArray,
    optionDataMap,
    showInfo,
    storeResults,
    companyList,
    depth = 0,
}: FieldRendererProps) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const fieldPath = parentIndex ? `${parentIndex}.subFields[${index}]` : `required_fields[${index}]`

    if (item.dataType === 'filter' && !isExpanded) {
        return (
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 tracking-wide">Filter Fields</h2>
                <div
                    className={`inline-block ${getBorderColor(depth)} border rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer bg-blue-200 bg-transparent`}
                    style={{ marginLeft: `${depth * 20}px`, width: '320px' }}
                    onClick={() => setIsExpanded(true)}
                >
                    <div className="flex items-center justify-between p-3 group">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white/60 group-hover:bg-white/80 transition">
                                <MdOutlineKeyboardArrowRight className="w-4 h-4 text-blue-700 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                            <span className="text-sm font-semibold text-blue-900">{item.key || 'Unnamed Filter'}</span>
                        </div>
                        <span className="text-xs font-medium text-blue-800 bg-white px-2.5 py-1 rounded-md shadow-sm">set Filters</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <div
                className={`${getBgColor(depth)} rounded-lg border ${getBorderColor(depth)} p-4 shadow-sm hover:shadow-md transition-shadow duration-200`}
                style={{ marginLeft: `${depth * 20}px` }}
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-2">
                        <Field name={`${fieldPath}.position`} component={Input} className="hidden" type="number" />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{depth === 0 ? 'Key' : 'Sub Field Key'}</label>
                            <Field
                                name={`${fieldPath}.key`}
                                placeholder="Enter key"
                                component={Input}
                                className="w-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                disabled={depth > 0}
                            />
                        </div>
                    </div>

                    {/* Data Type - hidden for Filter type since it's already determined */}
                    {item.dataType !== 'Filter' && (
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {depth === 0 ? 'Data Type' : 'Sub Field Type'}
                            </label>
                            <Field name={`${fieldPath}.dataType`}>
                                {({ field, form }: FieldProps) => (
                                    <Select
                                        isDisabled
                                        className="w-full"
                                        placeholder="Select type"
                                        options={reportQueryArray}
                                        value={reportQueryArray.find((option) => option.value === field.value)}
                                        classNamePrefix="react-select"
                                        onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                    />
                                )}
                            </Field>
                        </div>
                    )}

                    {/* Value - hidden for Filter type */}
                    {item.dataType !== 'filter' && (
                        <div className="md:col-span-7">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {depth === 0 ? 'Value' : 'Sub Field Value'}
                            </label>
                            <Field name={`${fieldPath}.value`}>
                                {({ field, form }: FieldProps) => {
                                    const { dataType, key } = item
                                    const options = optionDataMap[key]

                                    if (dataType === 'Select' && options) {
                                        const selectedOption = options.find(
                                            (option: any) => option.name?.toLowerCase() === field.value?.toLowerCase(),
                                        )
                                        return (
                                            <div className="w-full">
                                                <Select
                                                    isClearable
                                                    className="w-full"
                                                    {...field}
                                                    options={options}
                                                    getOptionLabel={(option) => option?.name}
                                                    getOptionValue={(option) => option?.id?.toString()}
                                                    value={selectedOption || null}
                                                    classNamePrefix="react-select"
                                                    onChange={(newVal) => {
                                                        form.setFieldValue(`${fieldPath}.value`, newVal?.name)
                                                    }}
                                                />
                                                {showInfo && (
                                                    <p className="mt-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded">
                                                        Leave empty to select all
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    }

                                    if (dataType === 'Select' && key === 'store_code') {
                                        return (
                                            <Select
                                                isClearable
                                                className="w-full"
                                                options={storeResults}
                                                getOptionLabel={(option) => option?.code}
                                                getOptionValue={(option) => option?.code}
                                                classNamePrefix="react-select"
                                                placeholder="Select store"
                                                onChange={(newVal) => {
                                                    form.setFieldValue(`${fieldPath}.value`, newVal?.code)
                                                }}
                                            />
                                        )
                                    }

                                    if (dataType === 'Select' && key === 'company_code') {
                                        const selectedCompany = companyList.find(
                                            (option) => option?.code?.toString() === field.value?.toString(),
                                        )

                                        return (
                                            <Select
                                                className="w-full"
                                                options={companyList}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option?.code?.toString() ?? ''}
                                                value={selectedCompany || null}
                                                placeholder="Select company"
                                                classNamePrefix="react-select"
                                                onChange={(newVal: any) => {
                                                    form.setFieldValue(`${fieldPath}.value`, newVal?.code ?? '')
                                                }}
                                            />
                                        )
                                    }

                                    if (dataType === 'Select' && key === 'fashion_style') {
                                        return (
                                            <Select
                                                isClearable
                                                className="w-full"
                                                options={FashionList}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.value}
                                                placeholder="Select fashion style"
                                                classNamePrefix="react-select"
                                                onChange={(newVal) => {
                                                    form.setFieldValue(`${fieldPath}.value`, newVal?.value)
                                                }}
                                            />
                                        )
                                    }

                                    if (dataType === 'MultiSelect' && options) {
                                        const fieldValueArray = Array.isArray(field?.value) ? field?.value : field?.value?.split(',') || []

                                        const selectedOptions = fieldValueArray
                                            .map((item: any) => {
                                                const selectedOption = options?.find((options: any) => {
                                                    return options?.name.toLowerCase() === item.toLowerCase()
                                                })
                                                return selectedOption
                                            })
                                            .filter(Boolean)

                                        return (
                                            <Select
                                                isMulti
                                                isClearable
                                                className="w-full"
                                                options={options}
                                                getOptionLabel={(option) => option?.name}
                                                getOptionValue={(option) => option?.id?.toString()}
                                                value={selectedOptions}
                                                placeholder="Select multiple options"
                                                classNamePrefix="react-select"
                                                onChange={(newVals) => {
                                                    const selectedValues = newVals?.map((val: any) => val.name) || []
                                                    form.setFieldValue(`${fieldPath}.value`, selectedValues)
                                                }}
                                            />
                                        )
                                    }

                                    if (dataType === 'Date') {
                                        return (
                                            <Field name={field.name}>
                                                {({ field, form }: FieldProps) => (
                                                    <DatePicker
                                                        placeholder=""
                                                        className="w-full mt-2"
                                                        value={field.value ? dayjs(field.value, 'YYYY-MM-DD') : null}
                                                        disabledDate={(current) => current && current.isAfter(dayjs().endOf('day'))}
                                                        onChange={(value) => {
                                                            form.setFieldValue(field.name, value ? value.format('YYYY-MM-DD') : '')
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        )
                                    }

                                    return (
                                        <Input
                                            type={dataType === 'Date' ? 'date' : 'text'}
                                            placeholder={dataType === 'Date' ? 'Select date' : 'Enter value'}
                                            {...field}
                                            className="w-full"
                                        />
                                    )
                                }}
                            </Field>
                        </div>
                    )}
                </div>
                {item.dataType !== 'Filter' && item.subFields && item.subFields.length > 0 && (
                    <div className="md:col-span-1 flex justify-end items-center">
                        <Button
                            type="button"
                            size="sm"
                            variant={isExpanded ? 'reject' : 'blue'}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? 'Remove Filter' : 'Set Filters'}
                        </Button>
                    </div>
                )}
            </div>

            {item.subFields && item.subFields.length > 0 && isExpanded && (
                <div className="space-y-3 mt-2">
                    {item.subFields.map((subField: any, subIndex: number) => (
                        <FieldRenderer
                            key={subIndex}
                            item={subField}
                            index={subIndex}
                            parentIndex={fieldPath}
                            reportQueryArray={reportQueryArray}
                            optionDataMap={optionDataMap}
                            showInfo={showInfo}
                            storeResults={storeResults}
                            companyList={companyList}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

const ReportFields = ({ values, reportQueryArray, optionDataMap, storeName }: ReportFieldsProps) => {
    const [showInfo, setShowInfo] = useState(false)
    const dispatch = useAppDispatch()
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowInfo(true)
            const hideTimer = setTimeout(() => {
                setShowInfo(false)
            }, 6000)
            return () => clearTimeout(hideTimer)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <FormContainer className="">
            <FormItem asterisk label="Required Fields" className="w-full">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <FieldArray name="required_fields">
                        {() => (
                            <div className="space-y-4">
                                {values?.map((item: any, index: number) => (
                                    <FieldRenderer
                                        key={index}
                                        item={item}
                                        index={index}
                                        parentIndex=""
                                        reportQueryArray={reportQueryArray}
                                        optionDataMap={optionDataMap}
                                        showInfo={showInfo}
                                        storeResults={storeResults}
                                        companyList={companyList}
                                        depth={0}
                                    />
                                ))}
                            </div>
                        )}
                    </FieldArray>

                    <FormContainer className="mt-10">
                        <FormItem label="Use Cache">
                            <Field type="checkbox" name="use_cache" component={Switcher} />
                        </FormItem>
                    </FormContainer>

                    {storeName && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex justify-center">
                                <Button
                                    variant="new"
                                    type="submit"
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 min-w-[180px]"
                                >
                                    Generate Report
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </FormItem>
        </FormContainer>
    )
}

export default ReportFields
