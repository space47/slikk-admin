/* eslint-disable @typescript-eslint/no-explicit-any */

import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { DIVISION_STATE } from '@/store/types/division.types'
import { useAppDispatch, useAppSelector } from '@/store'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { BRAND_STATE } from '@/store/types/brand.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import AccessDenied from '@/views/pages/AccessDenied'
import InnternalError from '@/views/pages/InternalServerError/InternalError'
import moment from 'moment'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { PRODUCTTYPE_STATE } from '@/store/types/productType.types'
import { notification } from 'antd'
import { reportQueryArray } from '@/constants/commonArray.constant'
import { FaChartBar, FaExclamationTriangle } from 'react-icons/fa'
import { commonDownload } from '@/common/commonDownload'
import { errorMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import ReportGraphInput from '@/views/analytics/reportsAnalytics/ReportGraphInput'
import ReportFields from '@/views/analytics/reportsAnalytics/ReportFields'
import { processField } from '@/views/analytics/reportsAnalytics/reportAnalyticsUtils'

const SalesOverview = () => {
    const [storeName] = useState('Top_Performers')
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

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllBrandsAPI())
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
            const dataFromResponse = response?.data?.data?.results
            const data = dataFromResponse?.find((item: any) => item?.name.toLowerCase() === storeName?.toLowerCase())
            let requiredFields = data?.required_fields || []
            if (Array.isArray(requiredFields)) {
                requiredFields = requiredFields.map((field) => {
                    let value = field.value
                    if (field.key === 'start_date' && !value) {
                        value = moment().startOf('month').format('YYYY-MM-DD')
                    } else if (field.key === 'end_date' && !value) {
                        value = moment().format('YYYY-MM-DD')
                    }

                    return { ...field, value: value }
                })
            } else {
                requiredFields = Object.entries(requiredFields || {})
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
            }

            if (requiredFields.length > 0 && requiredFields[0]?.position !== undefined) {
                requiredFields.sort((a: any, b: any) => a.position - b.position)
            }

            const formattedData = {
                name: data?.name || '',
                value: data?.value || '',
                required_fields: requiredFields,
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

        if (values?.required_fields && Array.isArray(values.required_fields)) {
            const processedQueries = values.required_fields.map((field: any) => processField(field)).filter(Boolean)
            reportParameters = processedQueries.join('&')
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
        } finally {
            setShowSpinner(false)
        }
    }
    const handleSubmit = async (values: any) => {
        const processedQueries = values.required_fields.map((field: any) => processField(field)).filter(Boolean)
        setCurrentValues(processedQueries.join('&'))
        fetchTable(values)
    }

    const handleSelect = (value: string) => {
        setSelectedOption(value)
    }

    const handleDownloadCsv = async (queryName: any) => {
        notification.info({ message: 'Download in Progress' })
        try {
            const response = await axioisInstance.get(
                `/query/execute/${storeName}?${currentValues}&download=true&query_name=${queryName}`,
                { responseType: 'blob' },
            )
            commonDownload(response, `${queryName}.csv`)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
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
                {({ values }) => (
                    <Form className="w-full  ">
                        <div className="bg-white p-2 dark:bg-gray-800 rounded-2xl shadow-2xl  border border-gray-200 dark:border-gray-700">
                            <div className="">
                                <div className="flex items-center gap-3 mb-2">
                                    <FaChartBar className=" text-2xl text-purple-500" />
                                    <h1 className="text-2xl font-bold ">Top Performers</h1>
                                </div>
                                <p className="">Top Performers detailed reports with custom queries and visualization</p>
                            </div>
                            <div className="p-6">
                                <ReportFields
                                    storeName={storeName}
                                    optionDataMap={optionDataMap}
                                    values={values.required_fields}
                                    reportQueryArray={reportQueryArray}
                                />
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
                        <p className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-300">Generating Top Performers Data...</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait a moment</p>
                    </div>
                </div>
            )}

            {showTable && (
                <div className="mt-8 ">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="p-6">
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
                </div>
            )}
        </div>
    )
}

export default SalesOverview
