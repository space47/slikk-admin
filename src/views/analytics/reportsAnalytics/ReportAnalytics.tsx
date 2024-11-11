/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Dropdown, FormContainer, FormItem, Input, Select, Spinner } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { ReportQueryData } from '@/views/configurationsSlikk/reportConfigurations/reportCommon'
import { Field, FieldArray, FieldProps, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import ReportTable from './ReportTable'
import { DIVISION_STATE } from '@/store/types/division.types'
import { useAppDispatch, useAppSelector } from '@/store'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { BRAND_STATE } from '@/store/types/brand.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import ReportGraphInput from './ReportGraphInput'
import ReportFields from './ReportFields'

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
    const [showTable, setShowTable] = useState(false)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(100)
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
        } catch (error) {
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
        const offSetCount = (page - 1) * pageSize

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
            console.log('Data', data)

            const tablesData = Object.keys(data).map((key) => ({
                key,
                data: data[key],
            }))

            setDynamicReportTable(tablesData)
            setTotalCount(response?.data?.data?.total)
            setShowTable(true)
            setShowSpinner(false)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied(true)
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
    }, [page])

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    if (showSpinner) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
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
                            </FormContainer>
                        </FormContainer>
                        {showDataBelow && (
                            <ReportFields values={values} reportQueryArray={reportQueryArray} optionDataMap={optionDataMap} />
                        )}
                        {storeName !== null && storeName !== undefined && storeName !== '' && (
                            <FormContainer className="flex justify-end mt-5 mb-9 xl:mb-0">
                                <Button variant="new" type="submit" className="text-white ">
                                    Generate
                                </Button>
                            </FormContainer>
                        )}
                    </Form>
                )}
            </Formik>
            <br />
            {showTable &&
                dynamicReportTable.map((table, index) => {
                    console.log('key Name', table.key)
                    return (
                        <div key={index} className="mt-5 flex flex-col gap-4">
                            <div className="flex justify-end ">
                                <Button variant="new" onClick={() => handleDownloadCsv(table.key)}>
                                    Download CSV
                                </Button>
                            </div>

                            <ReportTable
                                tableData={table.data}
                                page={page}
                                pageSize={pageSize}
                                onPaginationChange={onPaginationChange}
                                orderCount={totalount}
                                setPage={setPage}
                                setPageSize={setPageSize}
                            />
                        </div>
                    )
                })}
            {showTable && (
                <>
                    <ReportGraphInput
                        selectedOption={selectedOption}
                        xAxisValue={xAxisValue}
                        yAxisValue={yAxisValue}
                        yAxisValue2={yAxisValue2}
                        setXAxisvalue={setXAxisvalue}
                        setYAxisvalue={setYAxisvalue}
                        setYAxisvalue2={setYAxisvalue2}
                        handleSelect={handleSelect}
                        dynamicReportTable={dynamicReportTable}
                    />
                </>
            )}

            {accessDenied && (
                <>
                    <div className="flex justify-center items-center h-screen">
                        <h4>Access Denied</h4>
                    </div>
                </>
            )}
        </div>
    )
}

export default ReportAnalytics
