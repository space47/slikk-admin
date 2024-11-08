import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { ReportQueryData } from '@/views/configurationsSlikk/reportConfigurations/reportCommon'
import { Field, FieldArray, FieldProps, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { IoIosAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import ReportTable from './ReportTable'

const reportQueryArray = [
    { label: 'Date', value: 'Date' },
    { label: 'Number', value: 'Number' },
    { label: 'String', value: 'String' },
    { label: 'Boolean', value: 'Boolean' },
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
    const fetchReportApi = async () => {
        try {
            const response = await axioisInstance.get(`/query/config`)
            const data = response?.data?.data
            setReportQueryData(data?.results)
            setReportQueryNames(
                data?.results?.map((item) => ({
                    label: item.name,
                    value: item.name,
                })),
            )
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchReportApi()
    }, [])

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

    const initialValue = {}

    const [currentValues, setCurrentValues] = useState<any>() // State to store the current values

    const fetchTable = async (values?: any) => {
        const offSetCount = (page - 1) * pageSize

        let reportParameters = ''
        if (values?.required_fields) {
            reportParameters = values.required_fields
                .map((field: { key: string; value: string }) => `${field.key}=${field.value}`)
                .join('&')
        }
        try {
            const response = await axioisInstance.get(`/query/execute/${storeName}?${reportParameters}`)
            const data = response?.data?.data?.data
            setDynamicReportTable(data)
            setTotalCount(response?.data?.data?.total)
            setShowTable(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async (values: any) => {
        setCurrentValues(values) // Set the current values
        fetchTable(values) // Fetch table data with submitted values
    }

    useEffect(() => {
        if (currentValues) {
            fetchTable(currentValues) // Fetch table data when page changes
        }
    }, [page])

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={reportData}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, resetForm }) => (
                    <Form className="w-full lg:w-2/3 mx-auto xl:mx-0">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                                <FormItem label="Target Page">
                                    <Field name="target_page">
                                        {({ field, form }: FieldProps) => {
                                            return (
                                                <Select
                                                    placeholder="Select Target Page"
                                                    options={reportQueryNames}
                                                    value={reportQueryNames?.find((option) => option.value === field.value)}
                                                    onChange={(option) => {
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
                                                                placeholder="Select dataType"
                                                                options={reportQueryArray}
                                                                value={reportQueryArray.find((option) => option.value === field.value)}
                                                                onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Field name={`required_fields[${index}].value`}>
                                                        {({ field, form }: FieldProps) => {
                                                            const dataType = values.required_fields[index].dataType
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
                                                    <button type="button" className="bg-none border-none" onClick={() => remove(index)}>
                                                        <MdCancel className="text-xl text-red-600" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => push({ key: '', value: '', dataType: 'String' })}
                                                className="mt-3 bg-none border-none"
                                            >
                                                <IoIosAddCircle className="text-green-600 text-xl" />
                                            </button>
                                        </div>
                                    )}
                                </FieldArray>
                            </FormItem>
                        )}
                        <FormContainer className="flex justify-end mt-5 mb-9 xl:mb-0">
                            <Button type="reset" className="mr-2 bg-gray-600" onClick={() => resetForm()}>
                                Reset
                            </Button>
                            <Button variant="new" type="submit" className=" text-white">
                                Genertae
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
            <br />
            {showTable && (
                <>
                    <div className="flex flex-col gap-2">
                        <div className="font-semibold text-xl"> Report Table</div>
                        <ReportTable
                            tableData={dynamicReportTable}
                            page={page}
                            pageSize={pageSize}
                            onPaginationChange={onPaginationChange}
                            orderCount={totalount}
                            setPage={setPage}
                            setPageSize={setPageSize}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default ReportAnalytics
