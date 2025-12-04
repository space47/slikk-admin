/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Select, Switcher, Tooltip } from '@/components/ui'
import { notification } from 'antd'
import { Field, Form, Formik, FieldArray, FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'
import { MdCloudUpload, MdDelete, MdOutlineFilterAltOff } from 'react-icons/md'
import Papa from 'papaparse'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { ConditionsForEvent, mapConditionToOperator, QuickFilterArray, TimeFrameArray } from '../notificationUtils/notificationGroupsCommon'
import FullDateForm from '@/common/FullDateForm'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import GetEvenNames from '@/common/GetEvenNames'
import { BiSolidDuplicate } from 'react-icons/bi'
import moment from 'moment'
import GetPropertiesFromEvent from '@/common/GetPropertiesFromEvent'
import { FiFilter } from 'react-icons/fi'
import FormButton from '@/components/ui/Button/FormButton'
import { useNavigate } from 'react-router-dom'
import GetAggregationFromEvents from '../newGroupsComponents/GetAggregationFromEvent'
import ConditonMapings from '../notificationUtils/ConditonMapings'
import { FaCheckCircle } from 'react-icons/fa'
import { successMessage } from '@/utils/responseMessages'

const NewGroupsAdd = () => {
    const navigate = useNavigate()
    const [spinner, setSpinner] = useState(false)
    const [groupData, setGroupData] = useState<any[]>([])
    const [csvFile, setCSVFile] = useState<any>()
    const [mobileNumbers, setMobileNumbers] = useState<string[]>([])
    const [searchInputs, setSearchInputs] = useState<{ [key: number]: string }>({})
    const [quickFilter, setQuickFilter] = useState<{ [key: number]: boolean }>({})

    const fetchGroupNotification = async (inputValue = '') => {
        const filter = inputValue ? `&group_name=${inputValue}` : ''
        try {
            const response = await axioisInstance.get(`/notification/groups?p=1&page_size=10&is_active=true${filter}`)
            const data = response?.data?.data
            setGroupData(data?.results)
        } catch (error: any) {
            console.log(error)
        }
    }

    const formattedData = groupData.map((group) => ({ value: group.id, label: group.name }))

    const handleSearch = (inputValue: string, index: number) => {
        setSearchInputs((prev) => ({ ...prev, [index]: inputValue }))
        fetchGroupNotification(inputValue)
    }

    useEffect(() => {
        fetchGroupNotification()
    }, [])

    const handleCSVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null
        if (file) {
            setCSVFile(file)
            parseCSV(file)
        }
    }

    const parseCSV = (file: File) => {
        Papa.parse(file, {
            complete: (result) => {
                const extractedMobileNumbers = result.data.map((row: any) => row.mobile).filter(Boolean)
                setMobileNumbers(extractedMobileNumbers)
            },
            header: true,
            skipEmptyLines: true,
        })
    }

    const handleSubmit = async (values: any) => {
        try {
            setSpinner(true)
            const requestBody = {
                name: values.cohort_name,
                rules: transformConditionsToRules(values.conditions),
                ...(values.user
                    ? { user: values.user }
                    : csvFile
                      ? { user: Array.isArray(mobileNumbers) ? mobileNumbers.join(',') : '' }
                      : {}),
            }
            const response = await axioisInstance.post('/notification/groups', requestBody)
            successMessage(response)
            navigate(-1)
        } catch (error) {
            notification.error({ message: 'Failed to create cohort' })
        } finally {
            setSpinner(false)
        }
    }

    const transformConditionsToRules = (conditions: any[]) => {
        if (conditions.length === 0) return { operations: [], rules: [] }
        if (conditions.length === 1) return { operations: [], rules: [transformConditionToRule(conditions[0])] }

        const operations: string[] = []
        const rules: any[] = []
        rules.push(transformConditionToRule(conditions[0]))
        for (let i = 1; i < conditions.length; i++) {
            const currentCondition = conditions[i]
            const previousRelation = conditions[i].relation || 'Error'
            operations.push(previousRelation)
            rules.push(transformConditionToRule(currentCondition))
        }
        return { operations, rules }
    }

    const transformConditionToRule = (condition: any) => {
        const normalizeValue = (val: any) => {
            if (val?.toLowerCase() === 'true' || val?.toLowerCase() === 'false') return val === 'true'
            if (!isNaN(val) && val !== '') return Number(val)
            return val
        }

        const propertyBuilder = (pathKey: string, condKey: string, fnc: string, valA: string, valB: string, valueKey: string) => {
            let value: any
            let result: any[] = []
            const property = condition[pathKey]?.toLowerCase()
            const operator = mapConditionToOperator(condition[condKey])
            if (condition[condKey]?.includes('BETWEEN') || condition[condKey]?.includes('Not Between')) {
                value = [condition[valA], condition[valB]]
            } else {
                value = normalizeValue(condition[valueKey])
            }

            if (condition[fnc]) {
                result.push({ path: property, op: operator, value, function: condition[fnc] })
            } else {
                result.push({ path: property, op: operator, value })
            }
            const lower = property?.toLowerCase() || ''
            const specialKeys = ['category', 'division', 'sub category', 'brand']
            if (specialKeys.some((k) => lower.includes(k)) && condition[valueKey]) {
                result = [{ path: property, op: operator, value: condition[valueKey] }]
            }
            return result
        }
        const properties = propertyBuilder('property', 'condition', '', 'value_a', 'value_b', 'value')
        const aggregation = propertyBuilder('aggregation', 'agg_condition', 'agg_function', 'agg_value_a', 'agg_value_b', 'agg_value')
        const range: any = {}
        if (condition.timeFrame && condition.timeFrame !== 'custom_range') {
            range.start = moment().startOf('isoWeek').format('YYYY-MM-DD')
            range.end = moment().endOf('isoWeek').format('YYYY-MM-DD')
        } else if (condition.timeFrame === 'custom_range' && condition.start_date && condition.end_date) {
            range.start = condition.start_date
            range.end = condition.end_date
        }
        const rule: any = {
            event: condition.event?.value || condition.event,
            properties: properties[0],
            aggregation: aggregation[0],
        }
        if (Object.keys(range).length > 0) rule.time_frame = { range }
        if (condition.includeExclude === true && condition.cohort_id) rule.include_cohort_id = [condition.cohort_id]
        if (condition.includeExclude === false && condition.cohort_id) rule.exclude_cohort_id = [condition.cohort_id]
        return rule
    }

    const handleAddCondition = (push: any, relation: string) => {
        push({ ...ConditionsForEvent, relation: relation })
    }

    return (
        <div className="w-full">
            <div className="mb-8 ">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Cohorts</h1>
                <p className="text-gray-500">Define rules to build targeted user groups</p>
            </div>
            <Formik enableReinitialize initialValues={{ conditions: [ConditionsForEvent] }} onSubmit={handleSubmit}>
                {({ values }) => (
                    <Form className="w-full shadow-xl p-3 rounded-2xl">
                        <FormItem label="" className="flex flex-col gap-2">
                            <div className="mb-8 p-4 flex justify-center rounded-lg border border-blue-100">
                                <FormItem label="" className="flex flex-col gap-2">
                                    <div className="flex items-center gap-4">
                                        <label className="flex flex-col items-center justify-center w-64 h-32 px-4 py-6 bg-white text-blue-500 rounded-lg border-2 border-dashed border-blue-300 cursor-pointer hover:bg-blue-50 transition-colors">
                                            <MdCloudUpload className="text-3xl" />
                                            <span className="text-sm font-medium">Click to upload CSV for Users</span>
                                            <span className="text-xs text-gray-500 mt-1">or drag and drop</span>
                                            <input type="file" accept=".csv" className="hidden" onChange={handleCSVFileChange} />
                                        </label>
                                        {csvFile && (
                                            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-md">
                                                <FaCheckCircle className="text-xl" />
                                                <span className="text-sm">{csvFile.name}</span>
                                                <MdDelete
                                                    className="text-xl text-red-500 cursor-pointer hover:text-red-700 ml-2"
                                                    onClick={() => {
                                                        setMobileNumbers([])
                                                        setCSVFile('')
                                                        notification.info({
                                                            message: 'CSV file cleared',
                                                        })
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </FormItem>
                            </div>
                        </FormItem>
                        <FormContainer className="grid grid-cols-2 gap-4 mb-4">
                            <FormItem label="Cohort Name" asterisk={true}>
                                <Field name="cohort_name" placeholder="Enter cohort name " component={Input} className="w-full" />
                            </FormItem>

                            <FormItem label="Users">
                                <Field name="user" placeholder="Enter user " component={Input} />
                            </FormItem>
                        </FormContainer>

                        <FieldArray name="conditions">
                            {({ push, remove }) => (
                                <>
                                    {values.conditions.map((cond, index) => {
                                        const nextConditionRelation =
                                            index < values.conditions.length - 1 ? values.conditions[index + 1]?.relation : null
                                        return (
                                            <div key={index} className="relative">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="font-bold text-sl">ADD RULES #{index + 1}</div>
                                                    <div className="flex gap-4 items-center">
                                                        <div>
                                                            {quickFilter[index] ? (
                                                                <MdOutlineFilterAltOff
                                                                    className="text-3xl"
                                                                    onClick={() => setQuickFilter((prev) => ({ ...prev, [index]: false }))}
                                                                />
                                                            ) : (
                                                                <FiFilter
                                                                    className="text-2xl"
                                                                    onClick={() => setQuickFilter((prev) => ({ ...prev, [index]: true }))}
                                                                />
                                                            )}
                                                        </div>
                                                        <div>
                                                            {quickFilter[index] && (
                                                                <CommonSelect
                                                                    needClassName
                                                                    name={`conditions[${index}].operator`}
                                                                    label="QuickFilter"
                                                                    className="w-[200px]"
                                                                    options={QuickFilterArray}
                                                                />
                                                            )}
                                                        </div>
                                                        <Tooltip title="Duplicate Rule">
                                                            <BiSolidDuplicate
                                                                className="text-2xl cursor-pointer hover:text-blue-500"
                                                                onClick={() => push({ ...cond })}
                                                            />
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                <FormContainer className="grid grid-cols-6 gap-3 bg-blue-50 p-4 rounded-lg mt-4">
                                                    <GetEvenNames
                                                        hideButtons
                                                        customClassName="w-full "
                                                        label="Event Names"
                                                        name={`conditions[${index}].event`}
                                                    />
                                                    <GetPropertiesFromEvent
                                                        eventId={(values.conditions[index]?.event as any)?.id}
                                                        customClassName="w-full "
                                                        label="Property"
                                                        name={`conditions[${index}].property`}
                                                        eventName={values.conditions[index]?.event}
                                                    />

                                                    <ConditonMapings
                                                        cond={cond}
                                                        condition_name={`conditions[${index}].condition`}
                                                        index={index}
                                                        value_name_A={`conditions[${index}].value_a`}
                                                        value_name_B={`conditions[${index}].value_b`}
                                                        value_name={`conditions[${index}].value`}
                                                    />

                                                    <GetAggregationFromEvents
                                                        eventId={(values.conditions[index]?.event as any)?.id}
                                                        customClassName="w-full "
                                                        label="Aggregation"
                                                        name={`conditions[${index}].aggregation`}
                                                        eventName={values.conditions[index]?.event}
                                                    />

                                                    {cond.aggregation && (
                                                        <ConditonMapings
                                                            isFunction
                                                            cond={cond}
                                                            condition_name={`conditions[${index}].agg_condition`}
                                                            index={index}
                                                            function_name={`conditions[${index}].agg_function`}
                                                            value_name_A={`conditions[${index}].agg_value_a`}
                                                            value_name_B={`conditions[${index}].agg_value_b`}
                                                            value_name={`conditions[${index}].agg_value`}
                                                        />
                                                    )}

                                                    <CommonSelect
                                                        label="Time Frame"
                                                        options={TimeFrameArray}
                                                        name={`conditions[${index}].timeFrame`}
                                                    />
                                                    {cond?.timeFrame === 'custom_range' && (
                                                        <FormContainer className="grid grid-cols-2 gap-2 items-center col-span-2">
                                                            <FullDateForm
                                                                name={`conditions[${index}].start_date`}
                                                                fieldname={`conditions[${index}].start_date`}
                                                                label="Start"
                                                            />
                                                            <FullDateForm
                                                                name={`conditions[${index}].end_date`}
                                                                fieldname={`conditions[${index}].end_date`}
                                                                label="End"
                                                            />
                                                        </FormContainer>
                                                    )}
                                                    <FormItem label="Include/Exclude" className="flex justify-center items-center">
                                                        <Field
                                                            type="checkbox"
                                                            name={`conditions[${index}].includeExclude`}
                                                            component={Switcher}
                                                        />
                                                    </FormItem>
                                                    <FormItem label="Cohorts" className="col-span-1 w-full">
                                                        <Field name={`conditions[${index}].cohort_id`}>
                                                            {({ form, field }: FieldProps) => {
                                                                return (
                                                                    <Select
                                                                        isSearchable
                                                                        isClearable
                                                                        inputValue={searchInputs[index] || ''}
                                                                        options={formattedData}
                                                                        value={formattedData?.find(
                                                                            (option) => option.value === field.value,
                                                                        )}
                                                                        onInputChange={(inputValue: string) =>
                                                                            handleSearch(inputValue, index)
                                                                        }
                                                                        onChange={(selectedOption: any) => {
                                                                            const value = selectedOption ? selectedOption.value : ''
                                                                            form.setFieldValue(field.name, value)
                                                                        }}
                                                                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                                                    />
                                                                )
                                                            }}
                                                        </Field>
                                                    </FormItem>
                                                </FormContainer>
                                                <div className="flex gap-4 mt-6 justify-center items-center relative z-10">
                                                    <Button
                                                        variant="twoTone"
                                                        type="button"
                                                        className={`relative px-6 py-2 transition-all ${
                                                            nextConditionRelation === 'AND'
                                                                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200'
                                                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                        }`}
                                                        onClick={() => handleAddCondition(push, 'AND')}
                                                    >
                                                        AND
                                                        {nextConditionRelation === 'AND' && (
                                                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                                                                <div className="w-1 h-4 bg-blue-500 rounded-t"></div>
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full rotate-45"></div>
                                                            </div>
                                                        )}
                                                    </Button>

                                                    <Button
                                                        variant="twoTone"
                                                        type="button"
                                                        className={`relative px-6 py-2 transition-all ${
                                                            nextConditionRelation === 'OR'
                                                                ? 'bg-orange-600 text-white shadow-md ring-2 ring-orange-200'
                                                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                                        }`}
                                                        onClick={() => handleAddCondition(push, 'OR')}
                                                    >
                                                        OR
                                                        {nextConditionRelation === 'OR' && (
                                                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                                                                <div className="w-1 h-4 bg-orange-500 rounded-t"></div>
                                                                <div className="w-2 h-2 bg-orange-500 rounded-full rotate-45"></div>
                                                            </div>
                                                        )}
                                                    </Button>

                                                    {index > 0 && (
                                                        <MdDelete
                                                            className="text-xl text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                                                            onClick={() => remove(index)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </>
                            )}
                        </FieldArray>
                        <FormButton isSpinning={spinner} value="Submit" />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default NewGroupsAdd
