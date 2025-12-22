/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, FormContainer, FormItem, Input, Select, Spinner } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { DIVISION_STATE } from '@/store/types/division.types'
import { useAppDispatch, useAppSelector } from '@/store'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { BRAND_STATE } from '@/store/types/brand.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import ReportGraphInput from './ReportGraphInput'
import AccessDenied from '@/views/pages/AccessDenied'
import InnternalError from '@/views/pages/InternalServerError/InternalError'
import ReportFields from './ReportFields'
import moment from 'moment'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { PRODUCTTYPE_STATE } from '@/store/types/productType.types'
import ReportCustomQuery from './ReportCustomQuery'
import { notification } from 'antd'
import { reportQueryArray } from '@/constants/commonArray.constant'
import { FaMagic, FaFileCsv, FaExclamationTriangle, FaChartBar, FaTable, FaSearch, FaTimes } from 'react-icons/fa'
import { HiSelector } from 'react-icons/hi'
import { commonDownload } from '@/common/commonDownload'

const ReportAnalytics = () => {
    const [storeName, setStoreName] = useState('')
    const [reportQueryNames, setReportQueryNames] = useState<{ label: string; value: string }[]>([])
    const [dynamicReportTable, setDynamicReportTable] = useState<any[]>([])
    const [showTable, setShowTable] = useState(false)
    const [xAxisValue, setXAxisvalue] = useState('')
    const [yAxisValue, setYAxisvalue] = useState('')
    const [yAxisValue2, setYAxisvalue2] = useState('')
    const [showSpinner, setShowSpinner] = useState(false)
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const subCategoryData = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)
    const productTypeData = useAppSelector<PRODUCTTYPE_STATE>((state) => state.product_type)
    const [selectedOption, setSelectedOption] = useState('line')
    const [accessDenied, setAccessDenied] = useState(false)
    const [badRequest, setBadRequest] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [isCustomQuery, setIsCustomQuery] = useState(false)
    const [errorQuery, setErrorQuery] = useState('')

    const fetchReportApi = async () => {
        try {
            setShowSpinner(true)
            const response = await axioisInstance.get(`/query/config?p=1&page_size=100`)
            const data = response?.data?.data
            setReportQueryNames(
                data?.results?.map((item: any) => ({
                    label: item.name,
                    value: item.name,
                })),
            )
            setShowSpinner(false)
        } catch (error) {
            console.log(error)
        }
    }

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [])

    useEffect(() => {
        fetchReportApi()
    }, [])

    const optionDataMap: { [key: string]: any } = {
        brand: brands?.brands,
        category: category?.categories,
        division: divisions?.divisions,
        subcategory: subCategoryData?.subcategories,
        productType: productTypeData?.product_types,
    }

    const [reportData, setReportData] = useState({
        name: '',
        value: '',
        required_fields: [{ key: '', value: '', dataType: 'String' }],
    })

    const fetchApi = async () => {
        try {
            const response = await axioisInstance.get(`/query/config?name=${storeName}`)
            const dataxx = response?.data?.data?.results
            const data = dataxx?.find((item: any) => item?.name.toLowerCase() === storeName?.toLowerCase())
            const formattedData = {
                name: data?.name || '',
                value: data?.value || '',
                required_fields: Object.entries(data?.required_fields || {})
                    ?.reverse()
                    ?.map(([key, fullValue]) => {
                        const [position, dataType, valueArray, prefix, suffix] = Array.isArray(fullValue) ? fullValue : []
                        let transformedValue = valueArray
                        if (key === 'start_date') {
                            transformedValue = moment().startOf('month').format('YYYY-MM-DD')
                        } else if (key === 'end_date') {
                            transformedValue = moment().endOf('month').format('YYYY-MM-DD')
                        }
                        return {
                            position: position,
                            key,
                            value: transformedValue,
                            prefix: prefix || '',
                            suffix: suffix || '',
                            dataType: dataType || 'String',
                        }
                    })
                    ?.sort((a, b) => a.position - b.position),
            }
            setReportData(formattedData)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            } else if (error.response && error.response.status === 500) {
                setServerError(true)
            }
        }
    }
    useEffect(() => {
        if (storeName) {
            fetchApi()
        }
    }, [storeName])

    const [currentValues, setCurrentValues] = useState<any>()

    const fetchTable = async (values?: any) => {
        let reportParameters = ''
        if (values?.required_fields) {
            reportParameters = values.required_fields
                .map((field: { key: string; value: any; prefix?: string; suffix?: string; dataType?: string; position?: number }) => {
                    const { key, value = '', prefix = '', suffix = '', dataType } = field
                    const val = encodeURIComponent(value)
                    if (dataType === 'MultiSelect' && Array.isArray(value)) {
                        if (value.length === 0 || value[0] === '') {
                            return `${key}= NOT IN ('')`
                        }

                        const formattedValues = value.map((item: any) => {
                            const itemsEncoded = encodeURIComponent(item)
                            const transformedValue = item
                                ? !['Date', 'Number', 'Boolean'].includes(dataType!)
                                    ? `${prefix.toUpperCase()}${itemsEncoded.toString().toUpperCase()}${suffix.toUpperCase()}`
                                    : `${prefix.toUpperCase()}${itemsEncoded}${suffix.toUpperCase()}`
                                : ''

                            return `'${transformedValue}'`
                        })

                        return `${key}= IN (${formattedValues.join(',')})`
                    }

                    if (value === undefined || value === null || value === '') {
                        return `${key}=`
                    }

                    let transformedValue = !['Date', 'Number', 'Boolean'].includes(dataType!)
                        ? `${prefix.toUpperCase()}${val.toString().toUpperCase()}${suffix.toUpperCase()}`
                        : `${prefix.toUpperCase()}${val}${suffix.toUpperCase()}`

                    if (key === 'store_code' || key === 'fashion_style') {
                        transformedValue = !['Date', 'Number', 'Boolean'].includes(dataType!)
                            ? `${prefix}${val.toString()}${suffix}`
                            : `${prefix}${val}${suffix}`
                    }
                    return `${key}=${transformedValue}`
                })
                .filter(Boolean)
                .join('&')
        }

        try {
            setBadRequest(false)
            setShowSpinner(true)
            const response = await axioisInstance.get(`/query/execute/${storeName}?${reportParameters}`)
            const data = response?.data?.data
            const tab = Object.keys(data).map((key) => {
                return { key, data: data[key] }
            })
            setDynamicReportTable(tab)
            setShowTable(true)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            } else if (error.response && error.response.status === 500) {
                setServerError(true)
            } else if (error.response && error.response.status === 400) {
                setBadRequest(true)
            }
            setShowTable(false)
            setErrorQuery(error?.response?.data?.message)
            console.log(error?.response?.data?.error_query)
        } finally {
            setShowSpinner(false)
        }
    }
    const handleSubmit = async (values: any) => {
        setCurrentValues(values)
        fetchTable(values)
    }

    useEffect(() => {
        if (currentValues) {
            fetchTable(currentValues)
        }
    }, [])

    const handleSelect = (value: string) => {
        setSelectedOption(value)
    }

    const handleDownloadCsv = async (queryName: any) => {
        notification.info({ message: 'Download ing Progress' })
        let reportParameters = ''
        if (currentValues?.required_fields) {
            reportParameters = currentValues.required_fields
                .map((field: { key: string; value: string }) => `${field.key}=${field.value}`)
                .join('&')
        }
        try {
            const response = await axioisInstance.get(
                `/query/execute/${storeName}?${reportParameters}&download=true&query_name=${queryName}`,
                { responseType: 'blob' },
            )
            commonDownload(response, `${queryName}.csv`)
        } catch (error) {
            console.log(error)
        }
    }
    if (accessDenied) {
        return <AccessDenied />
    }
    if (serverError) {
        return <InnternalError />
    }

    return (
        <div className="min-h-screen  dark:from-gray-900 dark:to-gray-800 p-2">
            <Formik enableReinitialize initialValues={reportData} onSubmit={handleSubmit}>
                {({ values, resetForm, setFieldValue }) => (
                    <Form className="w-full  ">
                        <div className="bg-white p-2 dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <div className="">
                                <div className="flex items-center gap-3 mb-2">
                                    <FaChartBar className=" text-2xl text-purple-500" />
                                    <h1 className="text-2xl font-bold ">Report Generator</h1>
                                </div>
                                <p className="">Create detailed reports with custom queries and visualization</p>
                            </div>
                            <div className="p-6">
                                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-600">
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                        <div className="flex-1">
                                            {!isCustomQuery ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <HiSelector className="text-indigo-500 text-xl" />
                                                        <label className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                            Select Target Page
                                                        </label>
                                                    </div>
                                                    <Field name="target_page">
                                                        {({ field, form }: FieldProps) => (
                                                            <Select
                                                                isClearable
                                                                placeholder={
                                                                    <div className="flex items-center gap-2 text-gray-500">
                                                                        <FaSearch className="text-sm" />
                                                                        <span>Search or select a page...</span>
                                                                    </div>
                                                                }
                                                                options={reportQueryNames}
                                                                value={reportQueryNames?.find((option) => option.value === field.value)}
                                                                onChange={(option: any) => {
                                                                    form.setFieldValue(field.name, option?.value)
                                                                    setStoreName(option?.value)
                                                                    setShowTable(false)
                                                                }}
                                                                className="w-full"
                                                            />
                                                        )}
                                                    </Field>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                                        <FaMagic className="text-indigo-600 dark:text-indigo-400 text-xl" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                                            Custom Query Editor
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                                            Write your own SQL query for advanced reporting
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-shrink-0">
                                            <Button
                                                type="button"
                                                variant={isCustomQuery ? 'reject' : 'accept'}
                                                disabled={!!storeName && !isCustomQuery}
                                                onClick={() => setIsCustomQuery((Prev) => !Prev)}
                                                className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                                            >
                                                {isCustomQuery ? (
                                                    <>
                                                        <FaTimes className="group-hover:rotate-90 transition-transform duration-300" />
                                                        Close Custom Query
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaMagic className="group-hover:rotate-12 transition-transform duration-300" />
                                                        Add Custom Query
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    {storeName && (
                                        <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-lg">
                                                    <FaChartBar className="text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-emerald-800 dark:text-emerald-300">
                                                        Selected: <span className="font-bold">{storeName}</span>
                                                    </p>
                                                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                                                        Configure report parameters below
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {isCustomQuery && (
                                    <div className="mt-6 animate-fadeIn">
                                        <ReportCustomQuery />
                                    </div>
                                )}
                                {!!storeName && (
                                    <div className="mt-6 animate-slideDown">
                                        <ReportFields
                                            storeName={storeName}
                                            optionDataMap={optionDataMap}
                                            values={values.required_fields}
                                            reportQueryArray={reportQueryArray}
                                        />
                                    </div>
                                )}

                                {!storeName && !isCustomQuery && (
                                    <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-500 rounded-xl shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-amber-100 dark:bg-amber-800/30 rounded-lg">
                                                <FaExclamationTriangle className="text-amber-600 dark:text-amber-400 text-xl" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-amber-800 dark:text-amber-300 text-lg">
                                                    Ready to Generate Reports
                                                </h4>
                                                <p className="text-amber-700 dark:text-amber-400 mt-2">
                                                    Select a target page from the dropdown above or enable custom query mode to start
                                                    generating reports.
                                                </p>
                                                <p className="text-sm text-amber-600 dark:text-amber-500 mt-2">
                                                    You can customize date ranges, filters, and visualization options.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
            {badRequest && (
                <div className="mt-6 mx-auto ">
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-l-4 border-red-500 rounded-xl p-5 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-100 dark:bg-red-800/30 rounded-lg">
                                <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold text-red-700 dark:text-red-300 text-lg">Error Generating Report</h3>
                                <p className="text-red-600 dark:text-red-400 mt-1">{errorQuery}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showSpinner && (
                <div className="mt-10 max-w-7xl mx-auto">
                    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-indigo-200 dark:border-indigo-800 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-indigo-500 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">Generating your report...</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait a moment</p>
                    </div>
                </div>
            )}

            {/* Results Section */}
            {showTable && (
                <div className="mt-8 ">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        {/* Results Header */}
                        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                        <FaTable className="text-indigo-600 dark:text-indigo-400 text-xl" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Report Results</h2>
                                        <p className="text-gray-600 dark:text-gray-400">Analyze and visualize your data</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Graph Input Section */}
                        <div className="p-6">
                            <ReportGraphInput
                                dynamicReportTable={dynamicReportTable}
                                xAxisValue={xAxisValue}
                                yAxisValue={yAxisValue}
                                yAxisValue2={yAxisValue2}
                                selectedOption={selectedOption}
                                setXAxisvalue={setXAxisvalue}
                                setYAxisvalue={setYAxisvalue}
                                setYAxisvalue2={setYAxisvalue2}
                                handleSelect={handleSelect}
                                handleDownloadCsv={handleDownloadCsv}
                                showSpinner={showSpinner}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReportAnalytics
