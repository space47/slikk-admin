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

const NewGroupsAdd = () => {
    const [spinner, setSpinner] = useState(false)
    const [csvFile, setCSVFile] = useState<any>()
    const [mobileNumbers, setMobileNumbers] = useState<string[]>([])

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
        console.log('Form submitted', values)
    }

    return (
        <div className="w-full">
            <div>Create New Cohorts</div>
            <Formik
                enableReinitialize
                initialValues={{
                    conditions: [ConditionsForEvent],
                }}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className="w-full shadow-xl p-3 rounded-2xl">
                        {/* CSV Upload */}
                        <FormContainer className="grid grid-cols-2 gap-4">
                            <FormItem label="Users">
                                <Field name="user" placeholder="Enter user " component={Input} />
                            </FormItem>
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
                        </FormContainer>

                        {/* Dynamic Conditions */}
                        <FieldArray name="conditions">
                            {({ push, remove }) => (
                                <>
                                    {values.conditions.map((cond, index) => {
                                        console.log('Condition:', cond)
                                        return (
                                            <div key={index}>
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
                                                    <Button
                                                        variant="twoTone"
                                                        type="button"
                                                        onClick={() =>
                                                            push({
                                                                ...cond,
                                                                relation: 'AND',
                                                            })
                                                        }
                                                    >
                                                        AND
                                                    </Button>
                                                    <Button
                                                        variant="twoTone"
                                                        type="button"
                                                        onClick={() =>
                                                            push({
                                                                ...cond,
                                                                relation: 'OR',
                                                            })
                                                        }
                                                    >
                                                        OR
                                                    </Button>
                                                    {index > 0 && (
                                                        <MdDelete
                                                            className="text-xl text-red-500 cursor-pointer hover:text-red-700"
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
