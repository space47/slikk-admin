/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input } from '@/components/ui'
import { notification } from 'antd'
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { MdCloudUpload, MdDelete } from 'react-icons/md'
import Papa from 'papaparse'
import { ConditionsForEvent, transformConditionsToRules } from '../notificationUtils/notificationGroupsCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import FormButton from '@/components/ui/Button/FormButton'
import { useNavigate } from 'react-router-dom'
import { FaCheckCircle } from 'react-icons/fa'
import { successMessage } from '@/utils/responseMessages'
import GroupForm from '../notificationUtils/GroupForm'
import { HiDuplicate } from 'react-icons/hi'

const NewGroupsAdd = () => {
    const navigate = useNavigate()
    const [spinner, setSpinner] = useState(false)
    const [groupData, setGroupData] = useState<any[]>([])
    const [csvFile, setCSVFile] = useState<any>()
    const [mobileNumbers, setMobileNumbers] = useState<string[]>([])
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
                rules: {
                    ...transformConditionsToRules(values.conditions),
                    ...(values.user
                        ? { user: values.user?.split(',') }
                        : csvFile
                          ? { user: Array.isArray(mobileNumbers) ? mobileNumbers : [] }
                          : {}),
                },
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
                    <Form className="w-full">
                        <FormItem label="" className="flex flex-col gap-2">
                            <div className="mb-8 p-4 flex justify-center shadow-xl  rounded-lg border border-blue-100">
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
                        <div className=" shadow-xl rounded-lg p-3 border-black">
                            <div className="flex gap-2 items-center">
                                <HiDuplicate className="text-xl text-purple-400" />
                                <h5>Cohort Name and User Selection</h5>
                            </div>
                            <p>Select the cohort name and the user </p>
                            <FormContainer className="grid xl:grid-cols-2 grid-cols-1 gap-4 mb-4 mt-5">
                                <FormItem label="Cohort Name" asterisk={true}>
                                    <Field name="cohort_name" placeholder="Enter cohort name " component={Input} className="w-full" />
                                </FormItem>

                                <FormItem label="Users">
                                    <Field name="user" placeholder="Enter user " component={Input} />
                                </FormItem>
                            </FormContainer>
                        </div>

                        <GroupForm
                            formattedData={formattedData}
                            handleAddCondition={handleAddCondition}
                            handleSearch={handleSearch}
                            searchInputs={searchInputs}
                            values={values}
                        />

                        <FormButton isSpinning={spinner} value="Create" />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default NewGroupsAdd
