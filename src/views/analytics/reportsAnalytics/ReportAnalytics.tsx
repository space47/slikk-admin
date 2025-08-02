/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormContainer, FormItem, Input, Select, Spinner } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { ReportQueryData } from '@/views/configurationsSlikk/reportConfigurations/reportCommon'
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

const ReportAnalytics = () => {
    const [storeName, setStoreName] = useState('')
    const [reportQueryNames, setReportQueryNames] = useState<{ label: string; value: string }[]>([])
    const [showDataBelow, setShowDataBelow] = useState(false)
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
                        console.log('full value', fullValue)
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
            setShowDataBelow(true)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            } else if (error.response && error.response.status === 500) {
                setServerError(true)
            }
            console.log(error)
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
                            console.log('Items is', item)
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
            setErrorQuery(error?.response?.data?.error_query)
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
                {
                    responseType: 'blob',
                },
            )

            const blob = new Blob([response.data], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `${queryName}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            notification.success({ message: 'Downloaded Successfully' })
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
        <div>
            <Formik enableReinitialize initialValues={reportData} onSubmit={handleSubmit}>
                {({ values, resetForm, setFieldValue }) => (
                    <Form className=" w-full p-6  bg-white dark:bg-slate-900 shadow-lg rounded-lg">
                        <FormContainer className="">
                            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 p-4 bg-white dark:bg-slate-700 shadow-md rounded-2xl">
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                                    {!isCustomQuery ? (
                                        <FormItem className="font-medium text-gray-800 dark:text-gray-300">
                                            <label className="text-lg xl:text-xl font-semibold text-gray-800 mb-2 dark:text-gray-300">
                                                Select Target Page
                                            </label>
                                            <Field name="target_page">
                                                {({ field, form }: FieldProps) => (
                                                    <Select
                                                        isClearable
                                                        placeholder="Select Target Page"
                                                        options={reportQueryNames}
                                                        value={reportQueryNames?.find((option) => option.value === field.value)}
                                                        onChange={(option: any) => {
                                                            form.setFieldValue(field.name, option?.value)
                                                            setStoreName(option?.value)
                                                            setShowTable(false)
                                                        }}
                                                        className="w-full mt-3 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                    ) : (
                                        <>
                                            <div className="text-xl font-bold">Add the Custom Query</div>
                                        </>
                                    )}
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        className={`px-5 py-2 text-base font-semibold rounded-xl transition-all duration-200 shadow-sm text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                                            isCustomQuery
                                                ? 'bg-red-500 hover:bg-red-400 focus:ring-2 focus:ring-red-300'
                                                : 'bg-green-500 hover:bg-green-400 focus:ring-2 focus:ring-green-300'
                                        }`}
                                        onClick={() => setIsCustomQuery((Prev) => !Prev)}
                                        disabled={showDataBelow}
                                    >
                                        {isCustomQuery ? 'Close Custom Query' : 'Add Custom Query'}
                                    </button>
                                </div>
                            </div>
                        </FormContainer>

                        {isCustomQuery && <ReportCustomQuery />}

                        {showDataBelow && (
                            <div className="mt-6">
                                <ReportFields
                                    storeName={storeName}
                                    optionDataMap={optionDataMap}
                                    values={values.required_fields}
                                    reportQueryArray={reportQueryArray}
                                />
                            </div>
                        )}
                        {!showDataBelow && !isCustomQuery ? (
                            <div className="mt-10 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-sm">
                                <p className="text-sm">Please select the required page to generate the report.</p>
                            </div>
                        ) : (
                            ''
                        )}
                    </Form>
                )}
            </Formik>
            <br />

            {badRequest ? (
                <>
                    <div className="flex justify-center text-red-700 font-bold text-xl gap-2">
                        ⚠️Error - <span className="font-normal text-black"> {errorQuery}</span>{' '}
                    </div>
                </>
            ) : (
                ''
            )}

            {showSpinner ? (
                <div className="flex justify-center items-center h-auto">
                    <Spinner size={40} />
                </div>
            ) : showTable ? (
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
            ) : (
                ''
            )}
        </div>
    )
}

export default ReportAnalytics
