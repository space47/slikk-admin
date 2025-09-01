import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { notification } from 'antd'
import { Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { MdDelete } from 'react-icons/md'
import Papa from 'papaparse'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import {
    ConditionArray,
    DidAndNotArray,
    OperatorArray,
    PropertiesArray,
    TimeFrameArray,
} from '../notificationUtils/notificationGroupsCommon'
import FullTimePicker from '@/common/FullTimePicker'
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

    const handleSubmit = async (values: any) => {}

    return (
        <div className="w-full">
            <div>Create New Cohorts</div>
            <>
                <Formik
                    enableReinitialize
                    initialValues={{}}
                    // validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, resetForm }) => (
                        <Form className="w-full shadow-xl p-3 rounded-2xl ">
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
                                                notification.info({ message: 'CSV file cleared' })
                                            }}
                                        />
                                    </div>
                                </FormItem>
                            </FormContainer>

                            <FormContainer className="grid grid-cols-6 gap-3 bg-blue-50 p-4 rounded-lg mt-4">
                                <CommonSelect label="Did/Did Not" options={DidAndNotArray} name="didDidNot" />
                                <FormItem label="Action/Event">
                                    <Field name="event" placeholder="Action/Event" component={Input} />
                                </FormItem>
                                <CommonSelect label="Operator" options={OperatorArray} name="operator" />
                                <CommonSelect label="Property" options={PropertiesArray} name="property" />
                                <CommonSelect label="Condition" options={ConditionArray} name="condition" />
                                {values?.condition?.includes('Between') || values?.condition?.includes('Not Between') ? (
                                    <>
                                        <FormContainer className="grid grid-cols-2 gap-2">
                                            <FormItem label="value(A)">
                                                <Field name="value_a" placeholder="Value A" component={Input} />
                                            </FormItem>

                                            <FormItem label="value(B)">
                                                <Field name="value_b" placeholder="Value B" component={Input} />
                                            </FormItem>
                                        </FormContainer>
                                    </>
                                ) : (
                                    <>
                                        <FormItem label="value">
                                            <Field name="value" placeholder="Value " component={Input} />
                                        </FormItem>
                                    </>
                                )}

                                <CommonSelect label="Time Frame" options={TimeFrameArray} name="timeFrame" />
                                {values?.timeFrame === 'custom_range' && (
                                    <FormContainer className="grid grid-cols-2 gap-2 items-center">
                                        <FullDateForm
                                            name="start_date"
                                            fieldname="start_date"
                                            label="Start"
                                            needClass
                                            customClass="w-full"
                                        />
                                        <FullDateForm name="end_date" fieldname="end_date" label="end" needClass customClass="w-full" />
                                    </FormContainer>
                                )}
                            </FormContainer>

                            <FormContainer>
                                <Button variant="solid" type="submit" className="bg-blue-500 text-white">
                                    Submit
                                </Button>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </>
        </div>
    )
}

export default NewGroupsAdd
