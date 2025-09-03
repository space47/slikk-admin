/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Select, Tabs, Upload } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FILTER_STATE } from '@/store/types/filters.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Field, FieldProps, useFormikContext } from 'formik'
import React, { useEffect, useMemo, useReducer, useState } from 'react'
import { IoMdAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import { beforeUpload } from './beforeUpload'
import { FaSearch } from 'react-icons/fa'
import EasyTable from './EasyTable'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabList from '@/components/ui/Tabs/TabList'
import TabContent from '@/components/ui/Tabs/TabContent'
import { HiMinusSm, HiPlusSm } from 'react-icons/hi'

interface props {
    setFilterId: (x: any) => void
    isEdit?: boolean
    filterId?: string
    customClass?: string
    isOnchange?: (x: any) => void
    isExclude?: boolean
    isCsv?: boolean
    noExtra?: boolean
    values?: any
    isSku?: boolean
    fieldName: string
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

const MultiFilterSelect = ({ setFilterId, filterId, customClass, isOnchange, isExclude, isCsv, values, isSku, fieldName }: props) => {
    const dispatch = useAppDispatch()
    // All state is now local to each instance
    const [showAddFilter, setShowAddFilter] = useState<number[]>([])
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [filtersData, setFiltersData] = useState<any[]>([])
    const [localState, localDispatchState] = useReducer(reducer, initialState)
    const [csvFile, setCsvFile] = useState<File[]>([])
    const { setFieldValue } = useFormikContext()
    const [skuInput, setSkuInput] = useState('')
    // Defensive: clone values if passed, so each instance gets its own copy
    const instanceValues = useMemo(() => (values ? JSON.parse(JSON.stringify(values)) : {}), [values])
    const [extraFields, setExtraFields] = useState(false)

    const TabsArray = [
        { label: `SELECT ${isExclude ? 'EXCLUDE' : ''} FILTERS`, value: 'method_1' },
        { label: 'SEARCH SKU', value: 'method_2' },
        { label: 'CSV UPLOAD', value: 'method_3' },
    ]

    const [skuSearchData, setSkuSearchData] = useState<any[]>([])
    const handleRemoveSku = (sku: string) => {
        setSkuSearchData((prev) => prev.filter((item) => item.sku !== sku))
    }
    const fetchSkuData = async () => {
        try {
            const response = await axioisInstance.get(`/merchant/products?sku=${skuInput}`)
            const data = response?.data?.data?.results

            setSkuSearchData((prev) => {
                const newData = Array.isArray(data) ? data : [data]
                return [...prev, ...newData.filter((item) => !prev.some((prevItem) => prevItem.sku === item.sku))]
            })
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddSku = () => {
        fetchSkuData()
    }

    const columns = useMemo(
        () => [
            {
                header: 'SKU',
                accessorKey: 'sku',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.sku}</div>
                },
            },
            { header: 'Barcode', accessorKey: 'barcode' },
            { header: 'Brand', accessorKey: 'brand' },
            { header: 'Category', accessorKey: 'category' },
            { header: 'Color', accessorKey: 'color' },
            { header: 'Size', accessorKey: 'size' },
            {
                header: 'Actions',
                cell: ({ row }: any) => (
                    <button className="text-red-500" onClick={() => handleRemoveSku(row.original.sku)}>
                        Remove
                    </button>
                ),
            },
        ],
        [skuSearchData],
    )

    useEffect(() => {
        const fetchCriteria = async () => {
            if (!filterId) return
            try {
                const res = await axioisInstance.get(`/product/search/criteria?id=${filterId}`)
                const searchData = res?.data?.data?.search_data
                if (!searchData) return
                let initialValues: any[] = []
                if (Array.isArray(searchData)) {
                    initialValues = [...searchData]
                } else if (typeof searchData === 'string') {
                    try {
                        const parsed = JSON.parse(searchData)
                        initialValues = Array.isArray(parsed) ? parsed : [parsed]
                    } catch (error) {
                        console.error('Invalid JSON in search_data:', error)
                        return
                    }
                }
                if (initialValues.length === 0) return
                setShowAddFilter(initialValues.map((_, i) => i))
                initialValues.forEach((val: string[], index: number) => {
                    setFieldValue(`${fieldName}[${index}]`, JSON.parse(JSON.stringify(val)))
                })
            } catch (error) {
                console.error('Failed to fetch criteria:', error)
            }
        }
        fetchCriteria()
    }, [filterId, setFieldValue, isExclude])

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const handleAddFilter = () => {
        setShowAddFilter([...showAddFilter, showAddFilter.length])
    }

    const handleRemoveFilter = (index: number) => {
        const updatedFilters = showAddFilter.filter((_, i) => i !== index)
        setShowAddFilter(updatedFilters)
        setFieldValue(`${fieldName}[${index}]`, [])
    }
    const handleRemoveExcludeFilter = (index: number) => {
        const updatedFilters = showAddFilter.filter((_, i) => i !== index)
        setShowAddFilter(updatedFilters)
        setFieldValue(`filtersRemove[${index}]`, undefined)
    }

    const handleAddFilters = async (values: any) => {
        // Use local instanceValues to avoid shared reference
        const newFilterData = showAddFilter.map((_, index) => values?.[fieldName]?.[index] || [])
        setFiltersData((prev) => {
            const updatedFilters = [...prev, newFilterData]
            const lastElement = updatedFilters.at(-1)
            sendFilterData(lastElement)
            return updatedFilters
        })
    }

    const handleRemoveAllFilters = () => {
        setShowAddFilter([])
        setFiltersData([])
        setFilterId('')
        if (isExclude) {
            setFieldValue('filtersRemove', [])
        } else {
            setFieldValue(`${fieldName}`, [])
        }
    }

    const sendFilterData = async (filterData: any) => {
        const additionalData = Object.fromEntries(
            Object.entries({
                max_discount: localState.max_discount || '',
                min_discount: localState.min_discount || '',
                max_price: localState.max_price || '',
                min_price: localState.min_price || '',
            }).filter(([, value]) => value !== ''),
        )

        const formData = new FormData()
        if (filterData && filterData.length > 0) {
            formData.append('filter_data', JSON.stringify(filterData))
        } else {
            formData.append('filter_data', '')
        }
        formData.append('extra_filters', JSON.stringify(additionalData))
        if (isCsv && csvFile && csvFile.length > 0) {
            formData.append('skus', csvFile[0])
        } else {
            formData.append('skus', '')
        }
        if (skuSearchData && skuSearchData.length > 0) {
            formData.append('barcodes', skuSearchData?.map((item) => item.barcode).join(','))
        } else {
            formData.append('barcodes', '')
        }

        try {
            const response = await axioisInstance.post(`/product/search/criteria`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
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
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="font-bold text-xl text-gray-800 mb-6 pb-2 border-b border-gray-200">
                {isExclude ? 'Exclude Filters' : 'Filters'}
            </div>

            <Tabs defaultValue="method_1">
                <TabList className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 mb-8 sticky z-10 top-16">
                    {TabsArray.filter((tab) => {
                        if (tab.value === 'method_3' && !isCsv) return false
                        if (tab.value === 'method_2' && !isSku) return false
                        return true
                    }).map((tab, index) => (
                        <TabNav
                            key={index}
                            value={tab.value}
                            className="relative px-5 py-3 text-sm font-medium rounded-md transition-all duration-300 flex-1 text-center data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold text-gray-600 hover:text-gray-900"
                        >
                            {tab.label}
                        </TabNav>
                    ))}
                </TabList>

                <div className="bg-gray-50 rounded-xl p-5 mb-6">
                    <TabContent value="method_1">
                        <div className="flex justify-between items-center mb-4">
                            <button
                                type="button"
                                onClick={handleAddFilter}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                                <IoMdAddCircle className="text-xl" />
                                Add Filter
                            </button>
                            <Button
                                type="button"
                                variant="reject"
                                size="sm"
                                onClick={handleRemoveAllFilters}
                                className="flex items-center gap-1"
                            >
                                <MdCancel className="text-lg" />
                                Remove All
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {showAddFilter.map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                                >
                                    <div className="flex-grow">
                                        <Field name={`${fieldName}[${index}]`}>
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
                                                        placeholder={`Select filter tags ${index + 1}`}
                                                        options={filters.filters || []}
                                                        value={selectedOptions}
                                                        getOptionLabel={(option) => option.label}
                                                        getOptionValue={(option) => option.value}
                                                        className="w-full"
                                                        styles={{
                                                            control: (base) => ({
                                                                ...base,
                                                                borderRadius: '0.5rem',
                                                                borderColor: '#e5e7eb',
                                                                padding: '0.2rem',
                                                                '&:hover': {
                                                                    borderColor: '#93c5fd',
                                                                },
                                                            }),
                                                        }}
                                                        onChange={
                                                            isOnchange
                                                                ? isOnchange
                                                                : (newVal) => {
                                                                      const newValues = newVal ? newVal.map((val) => val.value) : []
                                                                      form.setFieldValue(field.name, JSON.parse(JSON.stringify(newValues)))
                                                                  }
                                                        }
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={isExclude ? () => handleRemoveExcludeFilter(index) : () => handleRemoveFilter(index)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                                        aria-label="Remove filter"
                                    >
                                        <MdCancel className="text-xl" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </TabContent>

                    <TabContent value="method_2">
                        <div className="mb-6">
                            <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
                                <div className="relative flex-grow">
                                    <input
                                        name="sku"
                                        type="search"
                                        placeholder="Enter SKU code"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow shadow-sm hover:shadow-md"
                                        value={skuInput}
                                        onChange={(e) => setSkuInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleAddSku()
                                            }
                                        }}
                                    />
                                </div>
                                <button
                                    className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-5 py-3 rounded-lg flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                                    onClick={handleAddSku}
                                >
                                    <FaSearch className="text-lg" /> Search
                                </button>
                            </div>

                            {/* SKU Table */}
                            {skuSearchData.length > 0 && (
                                <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-4">
                                    <EasyTable mainData={skuSearchData} columns={columns} overflow />
                                </div>
                            )}
                        </div>
                    </TabContent>

                    <TabContent value="method_3">
                        {isCsv && (
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="font-medium text-gray-700 mb-4">Upload CSV File</h3>
                                <Field name="csvList">
                                    {({ form }: FieldProps<any>) => (
                                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors bg-gray-50">
                                            <Upload
                                                beforeUpload={beforeUpload}
                                                fileList={values.csvList || []}
                                                className="w-full"
                                                onFileRemove={(files) => {
                                                    form.setFieldValue('csvList', files)
                                                }}
                                                onChange={(files) => {
                                                    form.setFieldValue('csvList', files)
                                                    setCsvFile(files as any)
                                                }}
                                            />
                                            <p className="text-sm text-gray-500 mt-3">Supported formats: .csv, .xlsx</p>
                                        </div>
                                    )}
                                </Field>
                            </div>
                        )}
                    </TabContent>
                </div>

                <div className="mb-6">
                    <Button
                        variant="yellow"
                        size="sm"
                        onClick={() => setExtraFields(!extraFields)}
                        className="flex items-center gap-2 mx-auto"
                    >
                        {extraFields ? (
                            <>
                                <HiMinusSm className="text-lg" /> Hide Extra Filters
                            </>
                        ) : (
                            <>
                                <HiPlusSm className="text-lg" /> Show Extra Filters
                            </>
                        )}
                    </Button>

                    {extraFields && (
                        <div className="mt-6 bg-gray-50 p-5 rounded-xl border border-gray-200">
                            <h3 className="font-semibold text-gray-700 mb-4">Price & Discount Filters</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormItem label="Max Discount (%)" className="mb-0">
                                    <Field name="max_discount">
                                        {({ field }: FieldProps<any>) => (
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    placeholder="Enter maximum discount"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow shadow-sm hover:shadow-md"
                                                    {...field}
                                                    onChange={(e) =>
                                                        localDispatchState({
                                                            type: 'SET_MAX_DISCOUNT',
                                                            payload: e.target.value ? parseFloat(e.target.value) : null,
                                                        })
                                                    }
                                                />
                                            </div>
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem label="Min Discount (%)" className="mb-0">
                                    <Field name="min_discount">
                                        {({ field }: FieldProps<any>) => (
                                            <input
                                                type="number"
                                                placeholder="Enter minimum discount"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow shadow-sm hover:shadow-md"
                                                {...field}
                                                onChange={(e) =>
                                                    localDispatchState({
                                                        type: 'SET_MIN_DISCOUNT',
                                                        payload: e.target.value ? parseFloat(e.target.value) : null,
                                                    })
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem label="Max Price ($)" className="mb-0">
                                    <Field name="max_price">
                                        {({ field }: FieldProps<any>) => (
                                            <input
                                                type="number"
                                                placeholder="Enter maximum price"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow shadow-sm hover:shadow-md"
                                                {...field}
                                                onChange={(e) =>
                                                    localDispatchState({
                                                        type: 'SET_MAX_PRICE',
                                                        payload: e.target.value ? parseFloat(e.target.value) : null,
                                                    })
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem label="Min Price ($)" className="mb-0">
                                    <Field name="min_price">
                                        {({ field }: FieldProps<any>) => (
                                            <input
                                                type="number"
                                                placeholder="Enter minimum price"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow shadow-sm hover:shadow-md"
                                                {...field}
                                                onChange={(e) =>
                                                    localDispatchState({
                                                        type: 'SET_MIN_PRICE',
                                                        payload: e.target.value ? parseFloat(e.target.value) : null,
                                                    })
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-8 pt-4 border-t border-gray-200">
                    <Field>
                        {({ form }: FieldProps<any>) => (
                            <Button
                                type="button"
                                variant="new"
                                onClick={() => handleAddFilters(form.values)}
                                className="px-8 py-3 text-lg font-medium shadow-md hover:shadow-lg transition-shadow"
                            >
                                Apply Filters
                            </Button>
                        )}
                    </Field>
                </div>
            </Tabs>
        </div>
    )
}

export default MultiFilterSelect
