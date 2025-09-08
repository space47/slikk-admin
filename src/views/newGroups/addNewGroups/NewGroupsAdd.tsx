/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { notification } from 'antd'
import { Field, Form, Formik, FieldArray } from 'formik'
import React, { useState } from 'react'
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

const NewGroupsAdd = () => {
    const [spinner, setSpinner] = useState(false)
    const [csvFile, setCSVFile] = useState<any>()
    const [mobileNumbers, setMobileNumbers] = useState<string[]>([])
    const [selectedRelation, setSelectedRelation] = useState<string | null>(null)

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

            ///
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

    // Recursive function to transform conditions into nested rules structure
    const transformConditionsToRules = (conditions: any[]) => {
        if (conditions.length === 0) {
            return {
                type: 'group',
                op: 'and',
                rules: [],
            }
        }

        // If there's only one condition, return it as a single rule
        if (conditions.length === 1) {
            return transformConditionToRule(conditions[0])
        }

        // Group consecutive conditions with the same relation
        const groupedRules: any[] = []
        let currentGroup: any = null

        conditions.forEach((condition, index) => {
            const relation = condition.relation || 'AND'

            // If this is the first condition or relation changed, start a new group
            if (index === 0 || (currentGroup && currentGroup.op !== relation.toLowerCase())) {
                currentGroup = {
                    type: 'group',
                    op: relation.toLowerCase(),
                    rules: [transformConditionToRule(condition)],
                }
                groupedRules.push(currentGroup)
            } else {
                // Add to current group
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

        // Otherwise, nest the groups under an AND operation
        return {
            type: 'group',
            op: 'and',
            rules: groupedRules,
        }
    }

    // Transform a single condition to rule format
    const transformConditionToRule = (condition: any) => {
        // Handle different value formats based on condition type
        let propertyValue: any

        if (condition.condition?.includes('BETWEEN') || condition.condition?.includes('Not Between')) {
            // For between conditions, create an array of values
            propertyValue = [condition.value_a, condition.value_b]
        } else if (condition.value === 'true' || condition.value === 'false') {
            // Convert string boolean to actual boolean
            propertyValue = condition.value === 'true'
        } else if (!isNaN(condition.value) && condition.value !== '') {
            // Convert numeric strings to numbers
            propertyValue = Number(condition.value)
        } else {
            // Keep as string for other cases
            propertyValue = condition.value
        }

        // Handle time frame if present
        const timeFrame: any = {}
        if (condition.timeFrame && condition.timeFrame !== 'custom_range') {
            timeFrame.time_frame = condition.timeFrame
        } else if (condition.timeFrame === 'custom_range' && condition.start_date && condition.end_date) {
            timeFrame.start_date = condition.start_date
            timeFrame.end_date = condition.end_date
        }

        const rule: any = {
            type: 'rule',
            include: condition.didDidNot === 'did', // true for "did", false for "did not"
            event: condition.event,
            properties: [
                {
                    path: condition.property,
                    op: mapConditionToOperator(condition.condition),
                    value: propertyValue,
                },
            ],
        }

        // Add time frame if it exists
        if (Object.keys(timeFrame).length > 0) {
            rule.time_frame = timeFrame
        }

        return rule
    }

    // Helper function to map condition values to operator strings
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
            'Not Between': 'not_between',
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
                        {/* CSV Upload */}
                        <FormItem label="Cohort Name" asterisk={true}>
                            <Field name="cohort_name" placeholder="Enter cohort name " component={Input} className="w-2/3" />
                        </FormItem>
                        <FormContainer className="grid grid-cols-2 gap-4">
                            <FormItem label="Users">
                                <Field name="user" placeholder="Enter user " component={Input} />
                            </FormItem>
                        </FormContainer>

                        {/* Dynamic Conditions */}
                        <FieldArray name="conditions">
                            {({ push, remove }) => (
                                <>
                                    {values.conditions.map((cond, index) => {
                                        console.log('Condition:', cond)
                                        return (
                                            <div key={index}>
                                                <div className="font-bold text-sl">ADD RULES</div>
                                                <FormContainer className="grid grid-cols-6 gap-3 bg-blue-50 p-4 rounded-lg mt-4">
                                                    <CommonSelect
                                                        label="Did/Did Not"
                                                        options={DidAndNotArray}
                                                        name={`conditions[${index}].didDidNot`}
                                                    />
                                                    <FormItem label="Action/Event">
                                                        <Field
                                                            name={`conditions[${index}].event`}
                                                            placeholder="Action/Event"
                                                            component={Input}
                                                        />
                                                    </FormItem>
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

                                                    {cond?.condition?.includes('BETWEEN') || cond?.condition?.includes('Not Between') ? (
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
