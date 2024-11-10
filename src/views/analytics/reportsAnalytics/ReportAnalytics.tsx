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
    const [xAxisValue, setXAxisvalue] = useState('')
    const [yAxisValue, setYAxisvalue] = useState('')
    const [showSpinner, setShowSpinner] = useState(false)
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    
    const dispatch = useAppDispatch()

    const fetchReportApi = async () => {
        try {
            setShowSpinner(true)
            const response = await axioisInstance.get('/query/config')
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
            const data = response?.data?.data || {}

            if (data) {
                const tables = Object.keys(data)
                
                const tableData = tables.map((tableName) => ({
                    name: tableName,
                    data: data[tableName],
                    total: data[tableName]?.length || 0,
                }))

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
                                        {({ field, form }: FieldProps) => (
                                            <Select
                                                placeholder="Select Target Page"
                                                options={reportQueryNames}
                                                value={reportQueryNames.find((option) => option.value === field.value)}
                                                onChange={(option: any) => {
                                                    form.setFieldValue(field.name, option?.value)
                                                    setStoreName(option?.value)
                                                }}
                                            />
                                        )}
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
                                                                options={reportQueryArray}
                                                                value={reportQueryArray.find((option) => option.value === field.value)}
                                                                onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                            />
                                                        )}
                                                    </Field>
                                                    <Field name={`required_fields[${index}].value`}>
                                                        {({ field, form }: FieldProps) => {
                                                            const { dataType, key } = values.required_fields[index]
                                                            const options = optionDataMap[key]

                                                            if ((dataType === 'Select' || dataType === 'MultiSelect') && options) {
                                                                const selectedOption = options.find(
                                                                    (option: any) => option.name.toLowerCase() === field.value.toLowerCase()
                                                                )

                                                                return (
                                                                    <Select
                                                                        className="w-1/2"
                                                                        isClearable
                                                                        isMulti={dataType === 'MultiSelect'}
                                                                        placeholder={`Select ${dataType === 'MultiSelect' ? 'values' : 'value'}`}
                                                                        options={options.map((item: any) => ({
                                                                            label: item.name,
                                                                            value: item.name,
                                                                        }))}
                                                                        value={selectedOption}
                                                                        onChange={(selected) =>
                                                                            form.setFieldValue(
                                                                                field.name,
                                                                                dataType === 'MultiSelect'
                                                                                    ? selected?.map((opt: any) => opt.value)
                                                                                    : selected?.value || ''
                                                                            )
                                                                        }
                                                                    />
                                                                )
                                                            }

                                                            return (
                                                                <Input
                                                                    className="w-1/2"
                                                                    placeholder="Value"
                                                                    value={field.value}
                                                                    onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                                                                />
                                                            )
                                                        }}
                                                    </Field>
                                                    {index > 0 && (
                                                        <Button
                                                            shape="circle"
                                                            color="red-500"
                                                            icon={<MdCancel />}
                                                            onClick={() => remove(index)}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                variant="plain"
                                                className="flex items-center mt-5 text-emerald-500"
                                                onClick={() =>
                                                    push({ key: '', value: '', dataType: 'String' })
                                                }
                                            >
                                                <IoIosAddCircle size={24} />
                                                Add Field
                                            </Button>
                                        </div>
                                    )}
                                </FieldArray>
                            </FormItem>
                        )}
                        <div className="flex items-center justify-end gap-3 mt-4">
                            <Button type="reset" onClick={() => resetForm()}>
                                Reset
                            </Button>
                            <Button type="submit" variant="solid" color="indigo">
                                Submit
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
            {showTable && (
                <div className="my-4">
                    <ReportTable tableData={dynamicReportTable} page={page} onPageChange={onPaginationChange} />
                </div>
            )}
        </div>
    )
}

export default ReportAnalytics
