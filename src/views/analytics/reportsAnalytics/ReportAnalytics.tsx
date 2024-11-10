/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

    console.log('ReportData', reportData)

    useEffect(() => {
        if (storeName) {
            fetchApi()
        }
    }, [storeName])

    const initialValue = {}

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
            const data = response?.data?.data || {}
            if (reportData.hasOwnProperty(storeName)) {
            setDynamicReportTable(reportData[storeName])  // Set the specific report data
        } else {
                setDynamicReportTable([])
        }
            setTotalCount(reportData[storeName]?.length || 0)
            setShowTable(true)
            setShowSpinner(false)
        } catch (error) {
            console.log(error)
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
            return moment(item[xAxisValue]).utcOffset(330).format('YYYY-MM-DD');
        } else {
            return item[xAxisValue];
        }
    }).filter(Boolean)
    : [];

const yAxisData = Array.isArray(dynamicReportTable)
    ? dynamicReportTable.map((item) => {
        if (yAxisValue.toLowerCase().includes('date')) {
            return moment(item[yAxisValue]).utcOffset(330).format('YYYY-MM-DD');
        } else {
            return item[yAxisValue];
        }
    }).filter(Boolean)
    : [];

    console.log('XAxisData', yAxisData)

    const handleDownloadCsv = () => {}

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
                                                    options={Array.isArray(reportQueryNames) ? reportQueryNames : []}
                                                    value={reportQueryNames?.find((option) => option.value === field.value)}
                                                    onChange={(option: any) => {
                                                        form.setFieldValue(field.name, option?.value)
                                                        setStoreName(option?.value)
                                                    }}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                        </FormContainer>
                        {showDataBelow && (
                            <FormItem asterisk label="Required Fields" className="col-span-1 w-[60%] h-[80%]">
                                <FieldArray name="required_fields">
                                    {({ push, remove }) => (
                                        <div>
                                            {values.required_fields.map((item: any, index: number) => (
                                                <div key={index} className="flex space-x-4 mt-2">
                                                    <Field
                                                        name={`required_fields[${index}].key`}
                                                        placeholder="Key"
                                                        component={Input}
                                                        className="w-1/3"
                                                    />
                                                    <Field name={`required_fields[${index}].dataType`}>
                                                        {({ field, form }: FieldProps) => (
                                                            <Select
                                                                className="w-1/4"
                                                                placeholder="Select dataType"
                                                                options={Array.isArray(reportQueryArray) ? reportQueryArray : []}
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
                                                                        className="w-1/3"
                                                                        {...field}
                                                                        options={options}
                                                                        getOptionLabel={(option) => option.name}
                                                                        getOptionValue={(option) => option.id.toString()}
                                                                        value={selectedOption || null}
                                                                        onChange={(newVal) => {
                                                                            console.log('Data for Val', newVal?.name)
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
                                                                    className="w-1/3"
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
                        {storeName !== null && storeName !== undefined && storeName !== '' && (
                            <FormContainer className="flex justify-end mt-5 mb-9 xl:mb-0">
                                {/* <Button type="reset" className="mr-2 bg-gray-600" onClick={() => resetForm()}>
                                    Reset
                                </Button> */}
                                <Button variant="new" type="submit" className="text-white ">
                                    Generate
                                </Button>
                            </FormContainer>
                        )}
                    </Form>
                )}
            </Formik>
            <br />
            {showTable && dynamicReportTable.length > 0 ? (
                        <>
                            <div className="flex flex-col gap-7">
                                <div className="font-semibold text-xl">Report Table</div>
                                <div className="flex justify-start">
                                    <Button variant="new" onClick={handleDownloadCsv}>
                                        Download CSV
                                    </Button>
                                </div>
                    
                                <ReportTable
                                    tableData={dynamicReportTable}
                                    page={page}
                                    pageSize={pageSize}
                                    onPaginationChange={onPaginationChange}
                                    orderCount={totalCount} // Ensure this is named correctly
                                    setPage={setPage}
                                    setPageSize={setPageSize}
                                />
                            </div>
                        </>
                    ) : (
                        <div>No data available for the selected report.</div> // A fallback message if no data is present
                    )}

                    <br />
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-3">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="">X-Axis</label>
                                <Select
                                    className="w-[300px]"
                                    placeholder="Select X-Axis Value"
                                    options={
                                        Array.isArray(dynamicReportTable) && dynamicReportTable.length > 0 && typeof dynamicReportTable[0] === 'object'
                                            ? Object.keys(dynamicReportTable[0]).map((key) => ({
                                                  label: key,
                                                  value: key,
                                              }))
                                            : []
                                    }
                                    value={xAxisValue ? { label: xAxisValue, value: xAxisValue } : null}
                                    onChange={(option) => setXAxisvalue(option.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label>Y-Axis</label>
                                <Select
                                    className="w-[300px]"
                                    placeholder="Select Y-Axis Value"
                                    options={
                                        Array.isArray(dynamicReportTable) && dynamicReportTable.length > 0 && typeof dynamicReportTable[0] === 'object'
                                            ? Object.keys(dynamicReportTable[0]).map((key) => ({
                                                  label: key,
                                                  value: key,
                                              }))
                                            : []
                                    }
                                    value={yAxisValue ? { label: yAxisValue, value: yAxisValue } : null}
                                    onChange={(option) => setYAxisvalue(option.value)}
                                />
                            </div>
                        </div>
                        <ReportLineGraph xAxisData={xAxisData} yAxisData={yAxisData} />
                    </div>
                </>
            )}
        </div>
    )
}

export default ReportAnalytics
