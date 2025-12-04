/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Select, Switcher, Tooltip } from '@/components/ui'
import { notification } from 'antd'
import { Field, Form, Formik, FieldArray, FieldProps } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { MdCloudUpload, MdDelete } from 'react-icons/md'
import Papa from 'papaparse'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { ConditionArray, ConditionsForEvent, TimeFrameArray } from '../notificationUtils/notificationGroupsCommon'
import FullDateForm from '@/common/FullDateForm'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import GetEvenNames from '@/common/GetEvenNames'
import { useAppDispatch, useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { BRAND_STATE } from '@/store/types/brand.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import FiltersSelect from '../notificationUtils/FiltersSelect'
import { BiSolidDuplicate } from 'react-icons/bi'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import moment from 'moment'
import GetPropertiesFromEvent from '@/common/GetPropertiesFromEvent'
import { useNavigate, useParams } from 'react-router-dom'
import FormButton from '@/components/ui/Button/FormButton'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { FaCheckCircle } from 'react-icons/fa'

const EditNewGroups = () => {
    const dispatch = useAppDispatch()
    const { id } = useParams()
    const navigate = useNavigate()
    const [spinner, setSpinner] = useState(false)
    const [csvFile, setCSVFile] = useState<any>()
    const [mobileNumbers, setMobileNumbers] = useState<string[]>([])
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const subCategoryData = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)
    const [groupData, setGroupData] = useState<any[]>([])
    const [searchInputs, setSearchInputs] = useState<{ [key: number]: string }>({})

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

    const urlReq = useMemo(() => {
        return `/notification/groups/${id}`
    }, [id])
    const { data: apiData } = useFetchSingleData<any>({ url: urlReq })
    const initialGroupData = useMemo(() => {
        const d: any = apiData as any
        if (!d) return undefined
        if (Array.isArray(d)) return d
        if (Array.isArray(d?.data)) return d.data
        return d?.data || d
    }, [apiData])

    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [dispatch])

    const transformSingleRuleToCondition = (rule: any) => {
        const isBetween = rule.properties?.[0]?.op === 'BETWEEN' || rule.properties?.[0]?.op === 'NOT BETWEEN'
        const propertyValue = rule.properties?.[0]?.value
        return {
            didDidNot: rule.exclude ? 'Did Not' : 'Did',
            event: {
                id: '',
                value: rule.event,
                label: rule.event,
            },
            property: rule.properties?.[0]?.path || '',
            condition: rule.properties?.[0]?.op,
            operator: rule.properties?.[0]?.op,
            value: isBetween ? '' : Array.isArray(propertyValue) ? propertyValue[0] : propertyValue,
            value_a: isBetween && Array.isArray(propertyValue) ? propertyValue[0] : '',
            value_b: isBetween && Array.isArray(propertyValue) ? propertyValue[1] : '',
            timeFrame: rule.time_frame ? 'custom_range' : '',
            start_date: rule.time_frame?.range?.start || '',
            end_date: rule.time_frame?.range?.end || '',
            relation: 'AND',
            includeExclude: rule.include_cohort_id ? true : rule.exclude_cohort_id ? false : undefined,
            cohort_id: rule.include_cohort_id?.[0] || rule.exclude_cohort_id?.[0] || '',
        }
    }

    const transformRulesToConditions = (rules: any) => {
        if (!rules) return [ConditionsForEvent]
        if (rules.operations && Array.isArray(rules.rules)) {
            const conditions: any[] = []

            rules.rules.forEach((rule: any, index: number) => {
                const condition = transformSingleRuleToCondition(rule)
                if (index > 0 && rules.operations[index - 1]) {
                    condition.relation = rules.operations[index - 1]
                } else {
                    condition.relation = 'AND'
                }
                conditions.push(condition)
            })

            return conditions
        }
        if (rules.type === 'group' && Array.isArray(rules.rules)) {
            return rules.rules.flatMap((rule: any) => {
                const arr = transformRulesToConditions(rule)
                return arr.map((c: any) => ({ ...c, relation: (rules.op || 'and').toUpperCase() }))
            })
        }

        if (rules.type === 'rule') {
            const condition = transformSingleRuleToCondition(rules)
            condition.relation = 'AND'
            return [condition]
        }
        return [ConditionsForEvent]
    }

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

            console.log('Transformed request body:', JSON.stringify(requestBody, null, 2))
            const response = await axioisInstance.patch(`/notification/groups/${id}`, requestBody)

            notification.success({
                message: response?.data?.data?.message || response?.data?.message || 'Cohort updated successfully',
            })
            navigate(-1)
        } catch (error) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failed to update cohort',
            })
        } finally {
            setSpinner(false)
        }
    }
    const transformConditionsToRules = (conditions: any[]) => {
        if (conditions.length === 0) {
            return {
                operations: [],
                rules: [],
            }
        }

        if (conditions.length === 1) {
            return {
                operations: [],
                rules: [transformConditionToRule(conditions[0])],
            }
        }

        const operations: string[] = []
        const rules: any[] = []
        rules.push(transformConditionToRule(conditions[0]))
        for (let i = 1; i < conditions.length; i++) {
            const currentCondition = conditions[i]
            const previousRelation = conditions[i].relation || 'Error'
            operations.push(previousRelation)
            rules.push(transformConditionToRule(currentCondition))
        }

        return {
            operations,
            rules,
        }
    }

    const transformConditionToRule = (condition: any) => {
        const normalizeValue = (val: any) => {
            if (val === 'true' || val === 'false') return val === 'true'
            if (!isNaN(val) && val !== '') return Number(val)
            return val
        }

        const buildBlock = (pathKey: string, condKey: string, fnc: string, valA: string, valB: string, valueKey: string) => {
            console.log('fnc is', fnc)
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

        const properties = buildBlock('property', 'condition', '', 'value_a', 'value_b', 'value')
        const aggregation = buildBlock('aggregation', 'agg_condition', 'agg_function', 'agg_value_a', 'agg_value_b', 'agg_value')

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

        if (condition.didDidNot === 'Did Not') rule.exclude = true
        if (Object.keys(range).length > 0) rule.time_frame = { range }
        if (condition.includeExclude === true && condition.cohort_id) rule.include_cohort_id = [condition.cohort_id]
        if (condition.includeExclude === false && condition.cohort_id) rule.exclude_cohort_id = [condition.cohort_id]

        return rule
    }
    const mapConditionToOperator = (condition: string): string => {
        const operatorMap: { [key: string]: string } = {
            '=': '=',
            '!=': '!=',
            '>': '>',
            '<': '<',
            '>=': '>=',
            '<=': '<=',
            BETWEEN: 'BETWEEN',
            'Not Between': 'NOT BETWEEN',
            Contains: 'CONTAINS',
            'Not Contains': 'NOT CONTAINS',
            'Starts With': 'STARTS WITH',
            'Ends With': 'ENDS WITH',
        }

        return operatorMap[condition] || condition
    }
    const handleAddCondition = (push: any, relation: string) => {
        push({
            ...ConditionsForEvent,
            relation: relation,
        })
    }

    return (
        <div className="w-full">
            <div className="mb-8 ">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Update Existing Cohorts</h1>
                <p className="text-gray-500">Define rules to update targeted user groups</p>
            </div>
            <Formik
                enableReinitialize
                initialValues={{
                    cohort_name: initialGroupData?.name || '',
                    user: '',
                    conditions: initialGroupData?.rules ? transformRulesToConditions(initialGroupData.rules) : [ConditionsForEvent],
                }}
                onSubmit={handleSubmit}
            >
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
                                    {values.conditions.map((cond: any, index: any) => {
                                        const nextConditionRelation =
                                            index < values.conditions.length - 1 ? values.conditions[index + 1]?.relation : null
                                        return (
                                            <div key={index}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="font-bold text-sl">ADD RULES #{index + 1}</div>
                                                    <div>
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
                                                        name={`conditions[${index}].event.value`}
                                                    />

                                                    <GetPropertiesFromEvent
                                                        eventId={values.conditions[index]?.event?.value?.id}
                                                        customClassName="w-full "
                                                        label="Property"
                                                        name={`conditions[${index}].property`}
                                                        eventName={values.conditions[index]?.event?.value}
                                                    />

                                                    <FormItem label="Condition" className={'col-span-1 w-full'}>
                                                        <Field name={`conditions[${index}].condition`}>
                                                            {({ field, form }: FieldProps<any>) => {
                                                                return (
                                                                    <Select
                                                                        isClearable
                                                                        isSearchable
                                                                        options={ConditionArray}
                                                                        value={ConditionArray?.find(
                                                                            (option) => option.value?.toLocaleLowerCase() === field.value,
                                                                        )}
                                                                        onChange={(option) => {
                                                                            const value = option ? option.value : ''
                                                                            form.setFieldValue(field.name, value)
                                                                        }}
                                                                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                                                    />
                                                                )
                                                            }}
                                                        </Field>
                                                    </FormItem>

                                                    {cond?.property?.toLocaleLowerCase()?.includes('category') && (
                                                        <FormItem label="value">
                                                            <FiltersSelect index={index} filter={category?.categories} />
                                                        </FormItem>
                                                    )}

                                                    {cond?.property?.toLocaleLowerCase()?.includes('division') && (
                                                        <FormItem label="value">
                                                            <FiltersSelect index={index} filter={divisions?.divisions} />
                                                        </FormItem>
                                                    )}

                                                    {cond?.property?.toLocaleLowerCase()?.includes('sub category') && (
                                                        <FormItem label="value">
                                                            <FiltersSelect index={index} filter={subCategoryData?.subcategories} />
                                                        </FormItem>
                                                    )}
                                                    {cond?.property?.toLocaleLowerCase()?.includes('brand') && (
                                                        <FormItem label="value">
                                                            <FiltersSelect index={index} filter={brands?.brands} />
                                                        </FormItem>
                                                    )}

                                                    {!(
                                                        cond?.property?.toLocaleLowerCase()?.includes('category') ||
                                                        cond?.property?.toLocaleLowerCase()?.includes('division') ||
                                                        cond?.property?.toLocaleLowerCase()?.includes('sub category') ||
                                                        cond?.property?.toLocaleLowerCase()?.includes('brand')
                                                    ) &&
                                                        (cond?.condition?.includes('BETWEEN') ||
                                                        cond?.condition?.includes('Not Between') ? (
                                                            <FormContainer className="grid grid-cols-2 gap-2 col-span-2">
                                                                <FormItem label="value(A)">
                                                                    <Field
                                                                        name={`conditions[${index}].value_a`}
                                                                        placeholder="Value A"
                                                                        component={Input}
                                                                    />
                                                                </FormItem>
                                                                <FormItem label="value(B)">
                                                                    <Field
                                                                        name={`conditions[${index}].value_b`}
                                                                        placeholder="Value B"
                                                                        component={Input}
                                                                    />
                                                                </FormItem>
                                                            </FormContainer>
                                                        ) : (
                                                            <FormItem label="value">
                                                                <Field
                                                                    name={`conditions[${index}].value`}
                                                                    placeholder="Value "
                                                                    component={Input}
                                                                />
                                                            </FormItem>
                                                        ))}

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

                        <FormButton isSpinning={spinner} value="Update" />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditNewGroups
