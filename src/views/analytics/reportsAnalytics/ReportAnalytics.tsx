/* eslint-disable @typescript-eslint/no-explicit-any */

import { Select } from '@/components/ui'
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
import { FaChartBar } from 'react-icons/fa'
import { commonDownload } from '@/common/commonDownload'
import { GrDatabase } from 'react-icons/gr'
import { ReportUi } from './reportAnalysisComponents/ReportUi'

const ReportAnalytics = () => {
    const [storeName, setStoreName] = useState('')
    const [reportQueryNames, setReportQueryNames] = useState<{ label: string; value: string }[]>([])
    const [subReportsStore, setSubReportStore] = useState<{ label: string; value: string }[]>([])
    const [subReportName, setSubReportName] = useState('')
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
        use_cache: true,
        required_fields: [{ key: '', value: '', dataType: 'String' }],
    })

    const fetchApi = async () => {
        setSubReportStore([])
        setSubReportName('')
        try {
            const response = await axioisInstance.get(`/query/config?name=${storeName}`)
            const dataxx = response?.data?.data?.results
            const data = dataxx?.find((item: any) => item?.name.toLowerCase() === storeName?.toLowerCase())
            const formattedData = {
                name: data?.name || '',
                value: data?.value || '',
                use_cache: true,
                required_fields: Object.entries(data?.required_fields || {})
                    ?.reverse()
                    ?.map(([key, fullValue]) => {
                        const [position, dataType, valueArray, prefix, suffix] = Array.isArray(fullValue) ? fullValue : []
                        let transformedValue = valueArray
                        if (key === 'start_date') {
                            transformedValue = moment().startOf('month').format('YYYY-MM-DD')
                        } else if (key === 'end_date') {
                            transformedValue = moment().format('YYYY-MM-DD')
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
            setSubReportStore(
                data?.value?.map((item: any) => ({
                    label: item.name,
                    value: item.name,
                })),
            )
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
                    console.log('key is', key)
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
        if (!values.use_cache) {
            reportParameters += `&use_cache=false`
        }
        if (subReportName) {
            reportParameters += `&query_name=${subReportName}`
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

    const { ReportTypeAndName, ChartUi, GenerateUI, ErrorUi, SpinnerUi, TableUI } = ReportUi({
        isCustomQuery,
        reportQueryNames,
        setStoreName,
        setShowTable,
        storeName,
        setIsCustomQuery,
        errorQuery,
    })

    if (accessDenied) {
        return <AccessDenied />
    }
    if (serverError) {
        return <InnternalError />
    }

    return (
        <div className="min-h-screen  dark:from-gray-900 dark:to-gray-800 p-2">
            <Formik enableReinitialize initialValues={reportData} onSubmit={handleSubmit}>
                {({ values }) => (
                    <Form className="w-full  ">
                        <div className="bg-white p-2 dark:bg-gray-800 rounded-2xl shadow-2xl  border border-gray-200 dark:border-gray-700">
                            <div className="">
                                <div className="flex items-center gap-3 mb-2">
                                    <FaChartBar className=" text-2xl text-purple-500" />
                                    <h1 className="text-2xl font-bold ">Report Generator</h1>
                                </div>
                                <p className="">Create detailed reports with custom queries and visualization</p>
                            </div>
                            <div className="p-6">
                                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-600">
                                    {ReportTypeAndName()}
                                    {storeName && <>{ChartUi()}</>}
                                </div>
                                {isCustomQuery && (
                                    <div className="mt-6 animate-fadeIn">
                                        <ReportCustomQuery />
                                    </div>
                                )}
                                {!!storeName && (
                                    <div className="mt-6 animate-slideDown">
                                        <div className="mt-2 mb-8">
                                            <div className="flex items-center gap-2 mb-4 mt-10">
                                                <GrDatabase className="text-indigo-500 text-xl" />
                                                <label className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                                    Select Table
                                                </label>
                                            </div>
                                            <Field name="tables">
                                                {({ field, form }: FieldProps) => (
                                                    <Select
                                                        isMulti
                                                        isClearable
                                                        options={subReportsStore}
                                                        value={subReportsStore.filter((option) => field.value?.includes(option.value))}
                                                        onChange={(option) => {
                                                            const values = option?.map((item) => item.value) || []
                                                            form.setFieldValue('tables', values)
                                                            setSubReportName(values.join(','))
                                                            setShowTable(false)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <ReportFields
                                            storeName={storeName}
                                            optionDataMap={optionDataMap}
                                            values={values.required_fields}
                                            reportQueryArray={reportQueryArray}
                                        />
                                    </div>
                                )}

                                {!storeName && !isCustomQuery && <>{GenerateUI()}</>}
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
            {badRequest && <>{ErrorUi()}</>}
            {showSpinner && <>{SpinnerUi()}</>}
            {showTable && (
                <div className="mt-8 ">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <>{TableUI()}</>

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
