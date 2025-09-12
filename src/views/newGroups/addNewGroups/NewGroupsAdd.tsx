/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Tooltip } from '@/components/ui'
import { notification } from 'antd'
import { Field, Form, Formik, FieldArray } from 'formik'
import React, { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import Papa from 'papaparse'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import {
    ConditionArray,
    ConditionsForEvent,
    DidAndNotArray,
    OperatorArray,
    PropertiesArray,
    TimeFrameArray,
} from '../notificationUtils/notificationGroupsCommon'
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

const NewGroupsAdd = () => {
    const dispatch = useAppDispatch()
    const [spinner, setSpinner] = useState(false)
    const [csvFile, setCSVFile] = useState<any>()
    const [mobileNumbers, setMobileNumbers] = useState<string[]>([])
    const [selectedRelation, setSelectedRelation] = useState<string | null>(null)
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const subCategoryData = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)

    useEffect(() => {
        dispatch(getAllBrandsAPI())
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

            console.log('Transformed request body:', JSON.stringify(requestBody, null, 2))
            const response = await axioisInstance.post('/notification/groups', requestBody)

            notification.success({
                message: response?.data?.data?.message || response?.data?.message || 'Cohort created successfully',
            })
        } catch (error) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failed to create cohort',
            })
        } finally {
            setSpinner(false)
        }
    }

    const transformConditionsToRules = (conditions: any[]) => {
        if (conditions.length === 0) {
            return {
                type: 'group',
                op: 'and',
                rules: [],
            }
        }
        if (conditions.length === 1) {
            return transformConditionToRule(conditions[0])
        }
        const groupedRules: any[] = []
        let currentGroup: any = null

        conditions.forEach((condition, index) => {
            const relation = condition.relation || 'AND'
            if (index === 0 || (currentGroup && currentGroup.op !== relation.toLowerCase())) {
                currentGroup = {
                    type: 'group',
                    op: relation.toLowerCase(),
                    rules: [transformConditionToRule(condition)],
                }
                groupedRules.push(currentGroup)
            } else {
                currentGroup.rules.push(transformConditionToRule(condition))
            }
        })

        const allSameRelation = groupedRules.every((group) => group.op === groupedRules[0].op)
        if (allSameRelation) {
            return {
                type: 'group',
                op: groupedRules[0].op,
                rules: groupedRules.flatMap((group) => group.rules),
            }
        }
        return {
            type: 'group',
            op: 'and',
            rules: groupedRules,
        }
    }

    const transformConditionToRule = (condition: any) => {
        let propertyValue: any
        if (condition.condition?.includes('BETWEEN') || condition.condition?.includes('Not Between')) {
            propertyValue = [condition.value_a, condition.value_b]
        } else if (condition.value === 'true' || condition.value === 'false') {
            propertyValue = condition.value === 'true'
        } else if (!isNaN(condition.value) && condition.value !== '') {
            propertyValue = Number(condition.value)
        } else {
            propertyValue = condition.value
        }

        const range: any = {}
        if (condition.timeFrame && condition.timeFrame !== 'custom_range') {
            range.start = moment().startOf('isoWeek').format('YYYY-MM-DD')
            range.end = moment().endOf('isoWeek').format('YYYY-MM-DD')
        } else if (condition.timeFrame === 'custom_range' && condition.start_date && condition.end_date) {
            range.start = condition.start_date
            range.end = condition.end_date
        }

        const timeFrame: any = { range }

        const rule: any = {
            type: 'rule',
            include: condition.didDidNot === 'Did',
            event: condition.event,
            properties: [
                {
                    path: condition.property,
                    op: mapConditionToOperator(condition.condition),
                    value: propertyValue,
                },
            ],
        }
        if (Object.keys(timeFrame).length > 0) {
            rule.time_frame = timeFrame
        }
        return rule
    }

    const mapConditionToOperator = (condition: string): string => {
        const operatorMap: { [key: string]: string } = {
            equals: '=',
            not_equals: '!=',
            contains: 'contains',
            not_contains: 'not_contains',
            starts_with: 'starts_with',
            ends_with: 'ends_with',
            greater_than: '>',
            less_than: '<',
            greater_than_equal: '>=',
            less_than_equal: '<=',
            BETWEEN: 'between',
            NOT_BETWEEN: 'not_between',
            exists: 'exists',
            not_exists: 'not_exists',
        }

        return operatorMap[condition] || '='
    }

    const handleAddCondition = (push: any, relation: string) => {
        push({
            ...ConditionsForEvent,
            relation: relation,
        })
    }

    return (
        <div className="w-full">
            <div className="font-semibold">Create New Cohorts</div>
            <Formik
                enableReinitialize
                initialValues={{
                    conditions: [ConditionsForEvent],
                }}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className="w-full shadow-xl p-3 rounded-2xl">
                        <FormItem label="" className="flex flex-col gap-2">
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept=".csv"
                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    onChange={handleCSVFileChange}
                                />
                                <MdDelete
                                    className="text-xl text-red-500 cursor-pointer hover:text-red-700"
                                    onClick={() => {
                                        setMobileNumbers([])
                                        setCSVFile('')
                                        notification.info({
                                            message: 'CSV file cleared',
                                        })
                                    }}
                                />
                            </div>
                        </FormItem>
                        <FormItem label="Cohort Name" asterisk={true}>
                            <Field name="cohort_name" placeholder="Enter cohort name " component={Input} className="w-1/2" />
                        </FormItem>
                        <FormContainer className="grid grid-cols-2 gap-4">
                            <FormItem label="Users">
                                <Field name="user" placeholder="Enter user " component={Input} />
                            </FormItem>
                        </FormContainer>

                        <FieldArray name="conditions">
                            {({ push, remove }) => (
                                <>
                                    {values.conditions.map((cond, index) => {
                                        console.log('Condition:', cond)
                                        return (
                                            <div key={index}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="font-bold text-sl">ADD RULES</div>
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
                                                    <CommonSelect
                                                        label="Did/Did Not"
                                                        options={DidAndNotArray}
                                                        name={`conditions[${index}].didDidNot`}
                                                    />

                                                    <GetEvenNames
                                                        hideButtons
                                                        customClassName="w-full "
                                                        label="Event Names"
                                                        name={`conditions[${index}].event`}
                                                    />
                                                    <CommonSelect
                                                        label="Operator"
                                                        options={OperatorArray}
                                                        name={`conditions[${index}].operator`}
                                                    />
                                                    <CommonSelect
                                                        label="Property"
                                                        options={PropertiesArray}
                                                        name={`conditions[${index}].property`}
                                                    />
                                                    <CommonSelect
                                                        label="Condition"
                                                        options={ConditionArray}
                                                        name={`conditions[${index}].condition`}
                                                    />

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
                                                </FormContainer>

                                                {/* AND / OR Buttons */}
                                                <div className="flex gap-4 mt-4 justify-center items-center">
                                                    <Button variant="twoTone" type="button" onClick={() => handleAddCondition(push, 'AND')}>
                                                        AND
                                                    </Button>
                                                    <Button variant="twoTone" type="button" onClick={() => handleAddCondition(push, 'OR')}>
                                                        OR
                                                    </Button>
                                                    {index > 0 && (
                                                        <MdDelete
                                                            className="text-xl text-red-500 cursor-pointer hover:text-red-700"
                                                            onClick={() => {
                                                                // If we're removing the last condition, reset the relation type
                                                                if (values.conditions.length === 2) {
                                                                    setSelectedRelation(null)
                                                                }
                                                                remove(index)
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </>
                            )}
                        </FieldArray>

                        {/* Submit */}
                        <FormContainer>
                            <Button variant="solid" type="submit" className="bg-blue-500 text-white mt-4">
                                Submit
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default NewGroupsAdd
