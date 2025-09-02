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

const CommonFilterSelect = ({ setFilterId, filterId, customClass, isOnchange, isExclude, isCsv, values, isSku }: props) => {
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
        <div>
            <div className="font-bold mb-7">{isExclude ? 'Exclude Filters:' : 'Filters:'}</div>

            <Tabs defaultValue="method_1">
                <TabList className="flex items-center justify-center gap-4 bg-blue-50 rounded-xl shadow-md p-3 mb-10 sticky z-10 top-16">
                    {TabsArray.filter((tab) => {
                        if (tab.value === 'method_3' && !isCsv) return false
                        if (tab.value === 'method_2' && !isSku) return false
                        return true
                    }).map((tab, index) => (
                        <TabNav
                            key={index}
                            value={tab.value}
                            className="relative px-4 py-2 text-sm sm:text-base font-semibold text-gray-700 rounded-xl transition-all duration-300 hover:text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            {tab.label}
                        </TabNav>
                    ))}
                </TabList>

                <TabContent value="method_1">
                    <FormContainer className="items-center mt-4 justify-between flex">
                        <button type="button" onClick={handleAddFilter}>
                            <IoMdAddCircle className="text-3xl text-green-500" />
                        </button>
                        <Button type="button" variant="reject" size="sm" onClick={handleRemoveAllFilters}>
                            Remove
                        </Button>
                    </FormContainer>
                    {showAddFilter.map((_, index: any) => (
                        <FormItem key={index} className="flex gap-2">
                            <div className="flex gap-3 items-center">
                                <Field key={index} name={isExclude ? `filtersRemove[${index}]` : `filtersAdd[${index}]`}>
                                    {({ field, form }: FieldProps<any>) => {
                                        console.log('field', field, filterId)
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
                                    <button
                                        type="button"
                                        className=""
                                        onClick={isExclude ? () => handleRemoveExcludeFilter(index) : () => handleRemoveFilter(index)}
                                    >
                                        <MdCancel className="text-xl text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </FormItem>
                    ))}
                </TabContent>

                <TabContent value="method_2">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        <input
                            name="sku"
                            type="search"
                            placeholder="Enter SKU"
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={skuInput}
                            onChange={(e) => setSkuInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleAddSku()
                                }
                            }}
                        />
                        <button
                            className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-xl flex items-center gap-2"
                            onClick={handleAddSku}
                        >
                            <FaSearch className="text-lg" /> Search
                        </button>
                    </div>

                    {/* SKU Table */}
                    {skuSearchData.length > 0 && (
                        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-2">
                            <EasyTable mainData={skuSearchData} columns={columns} overflow />
                        </div>
                    )}
                </TabContent>
                <TabContent value="method_3">
                    {isCsv && (
                        <>
                            <FormItem label="CSV File" className="mt-10">
                                <Field name="csvList">
                                    {({ form }: FieldProps<any>) => (
                                        <>
                                            <Upload
                                                beforeUpload={beforeUpload}
                                                fileList={values.csvList || []}
                                                className="flex justify-center mt-6"
                                                onFileRemove={(files) => {
                                                    form.setFieldValue('csvList', files)
                                                }}
                                                onChange={(files) => {
                                                    form.setFieldValue('csvList', files)
                                                    setCsvFile(files as any)
                                                }}
                                            />
                                        </>
                                    )}
                                </Field>
                            </FormItem>
                        </>
                    )}
                </TabContent>
            </Tabs>

            <Button variant="twoTone" size="sm" onClick={() => setExtraFields(!extraFields)} type="button">
                {extraFields ? 'Hide' : 'Show'} Extra Filters
            </Button>

            {extraFields && (
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
                </>
            )}
            <div className="flex flex-col gap-3 xl:flex-row  mt-4 justify-center">
                <Field>
                    {({ form }: FieldProps<any>) => (
                        <Button type="button" variant="new" onClick={() => handleAddFilters(form.values)}>
                            Search Strings
                        </Button>
                    )}
                </Field>
            </div>
        </div>
    )
}

export default CommonFilterSelect
