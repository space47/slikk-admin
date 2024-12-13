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
import BadRequest from '@/views/pages/BadRequest/BadRequest'

const reportQueryArray = [
    { label: 'Date', value: 'Date' },
    { label: 'Number', value: 'Number' },
    { label: 'String', value: 'String' },
    { label: 'Boolean', value: 'Boolean' },
    { label: 'Select', value: 'Select' },
    { label: 'MultiSelect', value: 'MultiSelect' },
]

const ReportAnalytics = () => {
    const [reportQueryData, setReportQueryData] = useState<ReportQueryData[]>([])
    const [storeName, setStoreName] = useState('')
    const [reportQueryNames, setReportQueryNames] = useState<{ label: string; value: string }[]>([])
    const [showDataBelow, setShowDataBelow] = useState(false)
    const [dynamicReportTable, setDynamicReportTable] = useState([])
    const [showTable, setShowTable] = useState(false)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalount, setTotalCount] = useState(0)
    const [xAxisValue, setXAxisvalue] = useState('')
    const [yAxisValue, setYAxisvalue] = useState('')
    const [yAxisValue2, setYAxisvalue2] = useState('')
    const [showSpinner, setShowSpinner] = useState(false)
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const [selectedOption, setSelectedOption] = useState('line')
    const [accessDenied, setAccessDenied] = useState(false)
    const [badRequest, setBadRequest] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [reportValue, setReportValue] = useState()
    const fetchReportApi = async () => {
        try {
            setShowSpinner(true)
            const response = await axioisInstance.get(`/query/config`)
            const data = response?.data?.data
            setReportQueryData(data?.results)
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
        brand: brands.brands,
        category: category.categories,
        division: divisions.divisions,
    }

    const [reportData, setReportData] = useState({
        name: '',
        value: '',
        required_fields: [{ key: '', value: '', dataType: 'String' }],
    })

    const fetchApi = async () => {
        try {
            const response = await axioisInstance.get(`/query/config?name=${storeName}`)
            const data = response?.data?.data
            const formattedData = {
                name: data?.results[0]?.name || '',
                value: data?.results[0]?.value || '',
                required_fields: Object.entries(data?.results[0]?.required_fields || {}).map(([key, fullValue]) => {
                    const [dataType, valueArray, prefix, suffix] = fullValue || []
                    console.log('Prefix', prefix)

                    let transformedValue = valueArray

                    if (key === 'start_date') {
                        transformedValue = moment().startOf('month').format('YYYY-MM-DD')
                    } else if (key === 'end_date') {
                        transformedValue = moment().endOf('month').format('YYYY-MM-DD')
                    }

                    return {
                        key,
                        value: transformedValue,
                        prefix: prefix || '',
                        suffix: suffix || '',
                        dataType: dataType || 'String',
                    }
                }),
            }
            setReportData(formattedData)
            setReportValue(formattedData?.value)
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

    console.log('reportValue', reportValue)

    const [currentValues, setCurrentValues] = useState<any>()

    const fetchTable = async (values?: any) => {
        let reportParameters = ''
        if (values?.required_fields) {
            reportParameters = values.required_fields
                .map((field: { key: string; value: any; prefix?: string; suffix?: string; dataType?: string }) => {
                    const { key, value, prefix = '', suffix = '', dataType } = field

                    if (dataType === 'MultiSelect' && Array.isArray(value)) {
                        console.log('value for muktiselect ', value)
                        if (value.length === 0 || value[0] === '') {
                            return `${key}= NOT IN ('')`
                        }

                        const formattedValues = value.map((item: any) => {
                            const transformedValue = item
                                ? !['Date', 'Number', 'Boolean'].includes(dataType!)
                                    ? `${prefix.toUpperCase()}${item.toString().toUpperCase()}${suffix.toUpperCase()}`
                                    : `${prefix.toUpperCase()}${item}${suffix.toUpperCase()}`
                                : ''

                            return `'${transformedValue}'`
                        })

                        return `${key}= IN (${formattedValues.join(',')})`
                    }

                    if (value === undefined || value === null || value === '') {
                        return null
                    }

                    const transformedValue = !['Date', 'Number', 'Boolean'].includes(dataType!)
                        ? `${prefix.toUpperCase()}${value.toString().toUpperCase()}${suffix.toUpperCase()}`
                        : `${prefix.toUpperCase()}${value}${suffix.toUpperCase()}`

                    return `${key}=${transformedValue}`
                })
                .filter(Boolean)
                .join('&')
        }

        console.log('object required for', reportParameters)

        try {
            setShowSpinner(true)
            const response = await axioisInstance.get(`/query/execute/${storeName}?${reportParameters}`)
            const data = response?.data?.data

            const tab = Object.keys(data).map((key) => {
                return {
                    key,
                    data: data[key],
                }
            })

            setDynamicReportTable(tab)
            setTotalCount(tab.length)
            setShowTable(true)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            } else if (error.response && error.response.status === 500) {
                setServerError(true)
            } else if (error.response && error.response.status === 400) {
                setBadRequest(true)
            }
            console.log(error)
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
    }, [page, pageSize])

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const handleSelect = (value: string) => {
        setSelectedOption(value)
    }

    const handleDownloadCsv = async (queryName: any) => {
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

    console.log('Bad', badRequest)

    return (
        <div>
            <Formik enableReinitialize initialValues={reportData} onSubmit={handleSubmit}>
                {({ values, resetForm, setFieldValue }) => (
                    <Form className="w-full lg:w-2/3 mx-auto xl:mx-0">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                                <FormItem label="Select Report" className="font-bold">
                                    <Field name="target_page">
                                        {({ field, form }: FieldProps) => {
                                            return (
                                                <Select
                                                    placeholder="Select Target Page"
                                                    options={reportQueryNames}
                                                    value={reportQueryNames?.find((option) => option.value === field.value)}
                                                    onChange={(option: any) => {
                                                        form.setFieldValue(field.name, option?.value)
                                                        setStoreName(option?.value)
                                                        setShowTable(false)
                                                    }}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                        </FormContainer>
                        {showDataBelow && (
                            <ReportFields
                                storeName={storeName}
                                optionDataMap={optionDataMap}
                                values={values.required_fields}
                                reportQueryArray={reportQueryArray}
                            />
                        )}
                    </Form>
                )}
            </Formik>
            <br />

            {badRequest && (
                <>
                    <div className="flex justify-center text-red-700 font-bold text-xl">
                        You have Passed wrong value or the data do not exist
                    </div>
                </>
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
                    page={page}
                    pageSize={pageSize}
                    onPaginationChange={onPaginationChange}
                    setPage={setPage}
                    setPageSize={setPageSize}
                    totalount={totalount}
                    showSpinner={showSpinner}
                />
            ) : (
                ''
            )}
        </div>
    )
}

export default ReportAnalytics
