/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Dropdown, FormContainer, FormItem, Input, Select, Spinner } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { ReportQueryData } from '@/views/configurationsSlikk/reportConfigurations/reportCommon'
import { Field, FieldArray, FieldProps, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { DIVISION_STATE } from '@/store/types/division.types'
import { useAppDispatch, useAppSelector } from '@/store'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { BRAND_STATE } from '@/store/types/brand.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import ReportGraphInput from './ReportGraphInput'
import AccessDenied from '@/views/pages/AccessDenied'
import InnternalError from '@/views/pages/InternalServerError/InternalError'
import { table } from 'console'

const reportQueryArray = [
    { label: 'Date', value: 'Date' },
    { label: 'Number', value: 'Number' },
    { label: 'String', value: 'String' },
    { label: 'Boolean', value: 'Boolean' },
    { label: 'Select', value: 'Select' },
    { label: 'MulltiSelect', value: 'MultiSelect' },
]

const ReportAnalytics = () => {
    const [reportQueryData, setReportQueryData] = useState<ReportQueryData[]>([])
    const [storeName, setStoreName] = useState('')
    const [reportQueryNames, setReportQueryNames] = useState<{ label: string; value: string }[]>([])
    const [showDataBelow, setShowDataBelow] = useState(false)
    const [dynamicReportTable, setDynamicReportTable] = useState([])
    const [displayTableName, setDisplayTableName] = useState('')
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
    const [serverError, setServerError] = useState(false)
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
                    const [dataType, value] = fullValue?.split('_')
                    return { key, value, dataType: dataType || 'String' }
                }),
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
                .map((field: { key: string; value: string }) => `${field.key}=${field.value}`)
                .join('&')
        }

        try {
            setShowSpinner(true)
            const response = await axioisInstance.get(`/query/execute/${storeName}?${reportParameters}`)
            const data = response?.data?.data

            const displayTable = Object.keys(data).map((key) => ({
                key,
                data,
            }))

            const tab = Object.keys(data).map((key) => {
                return {
                    key,
                    data: data[key], //?.data
                }
            })

            console.log(
                'Data for DRT',
                tab.map((item) => item.data.data),
            )

            setDynamicReportTable(tab)
            setTotalCount(tab.length)
            setShowTable(true)
            setShowSpinner(false)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
            } else if (error.response && error.response.status === 500) {
                setServerError(true)
            }
            console.log(error)
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

    console.log('dymanic', dynamicReportTable)

    const handleSelect = (value: string) => {
        setSelectedOption(value)
    }

    const handleDownloadCsv = async (queryName: any) => {
        console.log('queryName', queryName)
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

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={reportData}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, resetForm, setFieldValue }) => (
                    <Form className="w-full lg:w-2/3 mx-auto xl:mx-0">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                                <FormItem label="Select Target Page" className="font-bold">
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
                                {storeName !== null && storeName !== undefined && storeName !== '' && (
                                    <FormContainer className="flex  mt-8 mb-9">
                                        <Button variant="new" type="submit" className="text-white ">
                                            Generate
                                        </Button>
                                    </FormContainer>
                                )}
                            </FormContainer>
                        </FormContainer>
                        {showDataBelow && (
                            <FormItem asterisk label="Required Fields" className="col-span-1 w-[60%] h-[80%]">
                                <FieldArray name="required_fields">
                                    {({ push, remove }) => (
                                        <div className="grid xl:grid-cols-1 grid-cols-2 gap-5  ">
                                            {values.required_fields.map((item: any, index: number) => (
                                                <div key={index} className="flex space-x-4 mt-2 xl:flex-row flex-col items-center">
                                                    <Field
                                                        name={`required_fields[${index}].key`}
                                                        placeholder="Key"
                                                        component={Input}
                                                        className="xl:w-1/3 w-full"
                                                    />
                                                    <Field name={`required_fields[${index}].dataType`}>
                                                        {({ field, form }: FieldProps) => (
                                                            <Select
                                                                className="xl:w-1/3 w-full"
                                                                placeholder="Select dataType"
                                                                options={reportQueryArray}
                                                                value={reportQueryArray.find((option) => option.value === field.value)}
                                                                onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Field name={`required_fields[${index}].value`}>
                                                        {({ field, form }: FieldProps) => {
                                                            const { dataType, key } = values.required_fields[index]
                                                            const fieldValue = Array.isArray(field.value) ? field.value : []
                                                            const options = optionDataMap[key]

                                                            if ((dataType === 'Select' || dataType === 'MultiSelect') && options) {
                                                                const selectedOption = options.find(
                                                                    (option: any) =>
                                                                        option.name.toLowerCase() === field.value.toLowerCase(),
                                                                )

                                                                return (
                                                                    <Select
                                                                        className="xl:w-1/3 w-full"
                                                                        {...field}
                                                                        options={options}
                                                                        getOptionLabel={(option) => option.name}
                                                                        getOptionValue={(option) => option.id.toString()}
                                                                        value={selectedOption || null}
                                                                        onChange={(newVal) => {
                                                                            form.setFieldValue(
                                                                                `required_fields[${index}].value`,
                                                                                newVal?.name,
                                                                            )
                                                                        }}
                                                                    />
                                                                )
                                                            }

                                                            return (
                                                                <Input
                                                                    type={dataType === 'Date' ? 'date' : 'text'}
                                                                    placeholder={dataType === 'Date' ? 'Select date' : 'Enter value'}
                                                                    {...field}
                                                                    className="xl:w-1/3 w-full"
                                                                />
                                                            )
                                                        }}
                                                    </Field>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </FieldArray>
                            </FormItem>
                        )}
                    </Form>
                )}
            </Formik>
            <br />

            {showTable && (
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
            )}
        </div>
    )
}

export default ReportAnalytics
