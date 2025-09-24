/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormItem, Select, Tabs, Upload } from '@/components/ui'
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

const CommonFilterSelect = ({ setFilterId, filterId, isOnchange, isExclude, isCsv, values, isSku }: props) => {
    const dispatch = useAppDispatch()
    const [showAddFilter, setShowAddFilter] = useState<number[]>([])
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [filtersData, setFiltersData] = useState<any[]>([])
    const [state, dispatchState] = useReducer(reducer, initialState)
    const [csvFile, setCsvFile] = useState<File[]>([])
    const { setFieldValue } = useFormikContext()
    const [extraFields, setExtraFields] = useState(false)
    const [skuInput, setSkuInput] = useState('')

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
                const fieldPrefix = isExclude ? 'filtersRemove' : 'filtersAdd'
                initialValues.forEach((val: string[], index: number) => {
                    setFieldValue(`${fieldPrefix}[${index}]`, val)
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
        setFieldValue(`filtersAdd[${index}]`, [])
    }
    const handleRemoveExcludeFilter = (index: number) => {
        const updatedFilters = showAddFilter.filter((_, i) => i !== index)
        setShowAddFilter(updatedFilters)
        setFieldValue(`filtersRemove[${index}]`, undefined)
    }

    const handleAddFilters = async (values: any) => {
        const newFilterData = isExclude
            ? showAddFilter.map((_, index) => values.filtersRemove[index] || [])
            : showAddFilter.map((_, index) => values.filtersAdd[index] || [])
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
            setFieldValue('filtersAdd', [])
        }
    }

    const sendFilterData = async (filterData: any) => {
        const additionalData = Object.fromEntries(
            Object.entries({
                max_discount: state.max_discount || '',
                min_discount: state.min_discount || '',
                max_price: state.max_price || '',
                min_price: state.min_price || '',
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
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="font-bold text-lg mb-7 text-gray-800 border-b pb-2">{isExclude ? 'Exclude Filters' : 'Filters'}</div>

            <Tabs defaultValue="method_1">
                <TabList className="flex items-center justify-center gap-2 bg-gray-50 rounded-lg p-1 mb-8 sticky z-10 top-16 shadow-sm">
                    {TabsArray.filter((tab) => {
                        if (tab.value === 'method_3' && !isCsv) return false
                        if (tab.value === 'method_2' && !isSku) return false
                        return true
                    }).map((tab, index) => (
                        <TabNav
                            key={index}
                            value={tab.value}
                            className="relative px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 text-gray-600 hover:text-blue-500"
                        >
                            {tab.label}
                        </TabNav>
                    ))}
                </TabList>

                <TabContent value="method_1" className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={handleAddFilter}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                            <IoMdAddCircle className="text-xl" />
                            Add Filter
                        </button>
                        <Button type="button" variant="reject" size="sm" onClick={handleRemoveAllFilters} className="px-3 py-1.5">
                            Remove All
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {showAddFilter.map((_, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Field name={isExclude ? `filtersRemove[${index}]` : `filtersAdd[${index}]`}>
                                    {({ field, form }: FieldProps<any>) => {
                                        const selectedOptions =
                                            field.value?.flatMap((value: any) =>
                                                filters?.filters?.flatMap((filterGroup) =>
                                                    filterGroup?.options?.filter((option: any) => option.value === value),
                                                ),
                                            ) || []

                                        return (
                                            <div className="flex-grow">
                                                <Select
                                                    isMulti
                                                    placeholder={`Select filter tags ${index + 1}`}
                                                    options={filters.filters || []}
                                                    value={selectedOptions}
                                                    getOptionLabel={(option) => option.label}
                                                    getOptionValue={(option) => option.value}
                                                    className="w-full"
                                                    classNamePrefix="select"
                                                    onChange={
                                                        isOnchange
                                                            ? isOnchange
                                                            : (newVal) => {
                                                                  const newValues = newVal ? newVal.map((val) => val.value) : []
                                                                  form.setFieldValue(field.name, newValues)
                                                              }
                                                    }
                                                />
                                            </div>
                                        )
                                    }}
                                </Field>

                                <button
                                    type="button"
                                    onClick={isExclude ? () => handleRemoveExcludeFilter(index) : () => handleRemoveFilter(index)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    aria-label="Remove filter"
                                >
                                    <MdCancel className="text-xl" />
                                </button>
                            </div>
                        ))}
                    </div>
                </TabContent>

                <TabContent value="method_2" className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative flex-grow">
                            <input
                                name="sku"
                                type="search"
                                placeholder="Enter SKU code"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-shadow"
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
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
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
                </TabContent>

                <TabContent value="method_3" className="space-y-4">
                    {isCsv && (
                        <>
                            <FormItem label="Upload CSV File" className="mt-4">
                                <Field name="csvList">
                                    {({ form }: FieldProps<any>) => (
                                        <div className="mt-3">
                                            <Upload
                                                beforeUpload={beforeUpload}
                                                fileList={values.csvList || []}
                                                className="flex justify-center"
                                                onFileRemove={(files) => {
                                                    form.setFieldValue('csvList', files)
                                                }}
                                                onChange={(files) => {
                                                    form.setFieldValue('csvList', files)
                                                    setCsvFile(files as any)
                                                }}
                                            />
                                        </div>
                                    )}
                                </Field>
                            </FormItem>
                        </>
                    )}
                </TabContent>
            </Tabs>

            <div className="mt-8 pt-5 border-t border-gray-100">
                <Button
                    variant="twoTone"
                    size="sm"
                    onClick={() => setExtraFields(!extraFields)}
                    type="button"
                    className="flex items-center gap-2"
                >
                    {extraFields ? (
                        <>
                            <span>Hide Extra Filters</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </>
                    ) : (
                        <>
                            <span>Show Extra Filters</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </>
                    )}
                </Button>

                {extraFields && (
                    <div className="mt-5 bg-blue-50 p-5 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormItem label="Max Discount (%)" className="m-0">
                                <Field name="max_discount">
                                    {({ field }: FieldProps<any>) => (
                                        <input
                                            type="number"
                                            placeholder="e.g. 30"
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min="0"
                                            max="100"
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
                            <FormItem label="Min Discount (%)" className="m-0">
                                <Field name="min_discount">
                                    {({ field }: FieldProps<any>) => (
                                        <input
                                            type="number"
                                            placeholder="e.g. 10"
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min="0"
                                            max="100"
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
                            <FormItem label="Max Price ($)" className="m-0">
                                <Field name="max_price">
                                    {({ field }: FieldProps<any>) => (
                                        <input
                                            type="number"
                                            placeholder="e.g. 100"
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min="0"
                                            step="0.01"
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
                            <FormItem label="Min Price ($)" className="m-0">
                                <Field name="min_price">
                                    {({ field }: FieldProps<any>) => (
                                        <input
                                            type="number"
                                            placeholder="e.g. 20"
                                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min="0"
                                            step="0.01"
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
                    </div>
                )}
            </div>

            <div className="mt-8 flex justify-center">
                <Field>
                    {({ form }: FieldProps<any>) => (
                        <Button
                            type="button"
                            variant="solid"
                            onClick={() => handleAddFilters(form.values)}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
                        >
                            Apply Filters
                        </Button>
                    )}
                </Field>
            </div>
        </div>
    )
}

export default CommonFilterSelect
