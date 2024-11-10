import { Button, FormContainer, FormItem, Input, Select, Spinner } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { ReportQueryData } from '@/views/configurationsSlikk/reportConfigurations/reportCommon'
import { Field, FieldArray, FieldProps, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { IoIosAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import ReportTable from './ReportTable'
import ReportLineGraph from './reportGraphs/ReportLineGraph'
import { DIVISION_STATE } from '@/store/types/division.types'
import { useAppDispatch, useAppSelector } from '@/store'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { BRAND_STATE } from '@/store/types/brand.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import moment from 'moment'

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
    const [pageSize, setPageSize] = useState(100)
    const [totalCount, setTotalCount] = useState(0)
    const [xAxisValue, setXAxisValue] = useState('')
    const [yAxisValue, setYAxisValue] = useState('')
    const [showSpinner, setShowSpinner] = useState(false)
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
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
            setShowSpinner(false)
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
            const data = response?.data?.data || {}

            if (data) {
                const tables = Object.keys(data) // Get the keys for each table (e.g., query, total, etc.)

                // Store each table's data dynamically
                const tableData = tables.map((tableName) => ({
                    name: tableName,
                    data: data[tableName], // Store the actual data for each table
                    total: data[tableName]?.length || 0, // Calculate total count (based on the table's length)
                }))

                // Set dynamic report table data for all tables
                setDynamicReportTable(tableData)
            } else {
                setDynamicReportTable([])
            }

            setShowTable(true)
            setShowSpinner(false)
        } catch (error) {
            console.log(error)
            setShowSpinner(false)
        }
    }

    const handleSubmit = async (values: any) => {
        fetchTable(values)
    }

    useEffect(() => {
        fetchTable(reportData)
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

    const xAxisData = Array.isArray(dynamicReportTable)
        ? dynamicReportTable.map((item) => {
            if (xAxisValue.toLowerCase().includes('date')) {
                return moment(item[xAxisValue]).utcOffset(330).format('YYYY-MM-DD')
            } else {
                return item[xAxisValue]
            }
        }).filter(Boolean)
        : []

    const yAxisData = Array.isArray(dynamicReportTable)
        ? dynamicReportTable.map((item) => {
            if (yAxisValue.toLowerCase().includes('date')) {
                return moment(item[yAxisValue]).utcOffset(330).format('YYYY-MM-DD')
            } else {
                return item[yAxisValue]
            }
        }).filter(Boolean)
        : []

    const handleDownloadCsv = () => {}

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={reportData}
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
                                                    {...field}
                                                    {...form}
                                                    options={reportQueryNames}
                                                    onChange={(e) => {
                                                        const targetPage = e?.target?.value
                                                        setStoreName(targetPage)
                                                    }}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>

                                <div className="flex justify-between items-center w-full col-span-2">
                                    <div className="flex space-x-5">
                                        <Button type="submit">Generate Report</Button>
                                    </div>
                                    <div>
                                        {showTable && dynamicReportTable.length && xAxisData.length && yAxisData.length ? (
                                            <div>
                                                <Button onClick={handleDownloadCsv}>Download CSV</Button>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </FormContainer>
                        </FormContainer>
                    </Form>
                )}
            </Formik>

            <div className="mt-5">
                {showDataBelow && (
                    <div>
                        {showTable && dynamicReportTable.length && xAxisData.length && yAxisData.length ? (
                            <>
                                <ReportLineGraph xAxisData={xAxisData} yAxisData={yAxisData} />
                                <ReportTable
                                    xAxisValue={xAxisValue}
                                    yAxisValue={yAxisValue}
                                    data={dynamicReportTable}
                                    onPaginationChange={onPaginationChange}
                                />
                            </>
                        ) : (
                            <div>No data to display</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReportAnalytics
