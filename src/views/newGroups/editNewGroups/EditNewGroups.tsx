/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input } from '@/components/ui'
import { notification } from 'antd'
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { MdCloudUpload, MdDelete } from 'react-icons/md'
import Papa from 'papaparse'
import { ConditionsForEvent, transformConditionsToRules, transformRulesToConditions } from '../notificationUtils/notificationGroupsCommon'

import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useAppDispatch } from '@/store'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { useNavigate, useParams } from 'react-router-dom'
import FormButton from '@/components/ui/Button/FormButton'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { FaCheckCircle } from 'react-icons/fa'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import { HiDuplicate } from 'react-icons/hi'
import GroupForm from '../notificationUtils/GroupForm'

const EditNewGroups = () => {
    const dispatch = useAppDispatch()
    const { id } = useParams()
    const navigate = useNavigate()
    const [spinner, setSpinner] = useState(false)
    const [csvFile, setCSVFile] = useState<any>()
    const [mobileNumbers, setMobileNumbers] = useState<string[]>([])
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
    const { data: apiData, loading } = useFetchSingleData<any>({ url: urlReq })
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
                const extractedMobileNumbers = result.data
                    .map((row: any) => {
                        // Fix keys with extra spaces
                        const cleanedRow: any = {}

                        Object.keys(row).forEach((key) => {
                            cleanedRow[key.trim()] = row[key]
                        })

                        return cleanedRow.mobile ? String(cleanedRow.mobile).trim().replace(/\s+/g, '') : ''
                    })
                    .filter(Boolean)

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
                ...(csvFile ? { user: Array.isArray(mobileNumbers) ? mobileNumbers?.join(',') : '' } : {}),
                rules: {
                    ...transformConditionsToRules(values.conditions),
                    ...(values.user ? { user: values.user?.split(',') } : {}),
                },
            }

            const response = await axioisInstance.patch(`/notification/groups/${id}`, requestBody)
            successMessage(response)
            navigate(`/app/appsCommuncication/cohorts`)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        } finally {
            setSpinner(false)
        }
    }

    const initialValues = useMemo(
        () => ({
            cohort_name: initialGroupData?.name ?? '',
            user: initialGroupData?.rules?.user?.join(',') ?? '',
            conditions: initialGroupData?.rules ? transformRulesToConditions(initialGroupData.rules) : [ConditionsForEvent],
        }),
        [initialGroupData],
    )

    const handleAddCondition = (push: any, relation: string) => {
        push({ ...ConditionsForEvent, relation: relation })
    }

    if (loading || !initialGroupData) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 text-lg">Loading cohort details...</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="mb-8 ">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Update Existing Cohorts</h1>
                <p className="text-gray-500">
                    Define rules to update targeted user groups and all the field marked <span className="text-red-500">*</span> are
                    mandatory
                </p>
            </div>
            <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
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
                            isEdit
                            formattedData={formattedData}
                            handleAddCondition={handleAddCondition}
                            handleSearch={handleSearch}
                            searchInputs={searchInputs}
                            values={values}
                        />

                        <FormButton isSpinning={spinner} value="Update" />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditNewGroups
