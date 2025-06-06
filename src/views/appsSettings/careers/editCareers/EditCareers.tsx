/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { useAppDispatch } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import CareerForm from '../CareerForm'
import { useNavigate, useParams } from 'react-router-dom'
import { JobPostingTypes } from '../careersCommon'
import CareerPreview from '../CareerPreview'

const EditCareers = () => {
    const dispatch = useAppDispatch()
    const [jobDetails, setJobDetails] = useState<JobPostingTypes>([])
    const [departmentsData, setDepartmentsData] = useState<any[]>([])
    const [showPreview, setShowPreview] = useState(false)
    const navigate = useNavigate()

    const { job_id } = useParams()

    const fetchJobsDetails = async () => {
        try {
            const response = await axioisInstance.get(`/jobs?job_id=${job_id}`)
            const data = response?.data?.data
            setJobDetails(data)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchDepartments = async () => {
        try {
            const response = await axioisInstance.get(`/departments`)
            setDepartmentsData(response?.data?.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchDepartments()
        fetchJobsDetails()
    }, [])

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const initialValue = {
        title: jobDetails?.title || '',
        description: jobDetails?.description || '',
        location: jobDetails?.location || '',
        job_type: jobDetails?.job_type || '',
        min_experience: jobDetails?.min_experience || 0,
        // department_name: jobDetails?.department_name || '',
        responsibilities: jobDetails?.responsibilities || '',
        qualifications: jobDetails?.qualifications || '',
        how_to_apply: jobDetails?.how_to_apply || '',
        department: jobDetails?.department || '',
    }

    const handleSubmit = async (values: any) => {
        const body = {
            ...(values?.title && { title: values?.title || '' }),
            ...(values?.description && { description: values?.description || '' }),
            ...(values?.location && { location: values?.location || '' }),
            ...(values?.job_type && { job_type: values?.job_type || '' }),
            ...(values?.min_experience && { min_experience: values?.min_experience || 0 }),
            ...(values?.department && { department: values?.department || null }),
            ...(values?.responsibilities && { responsibilities: values?.responsibilities || '' }),
            ...(values?.qualifications && { qualifications: values?.qualifications || '' }),
            ...(values?.how_to_apply && { how_to_apply: values?.how_to_apply || '' }),
        }

        console.log('Body of the request', body)
        try {
            const response = await axioisInstance.patch(`/jobs/${jobDetails?.id}`, body)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Successfully Edited jobs',
            })
            navigate(-1)
        } catch (error: any) {
            notification.error({
                message: 'Error',
                description: error?.response?.data?.message || 'Failed to Edit',
            })
            console.error(error)
        }
    }

    console.log('setPreview', showPreview)

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className="w-3/4">
                        <FormContainer className="">
                            <CareerForm departmentsData={departmentsData} />
                        </FormContainer>
                        <div className="flex justify-between gap-3">
                            <Button variant="accept" type="submit">
                                Submit
                            </Button>
                            {showPreview ? (
                                <div
                                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white shadow-md transition-all duration-200"
                                    onClick={() => setShowPreview(false)}
                                >
                                    Close
                                </div>
                            ) : (
                                <div
                                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all duration-200"
                                    onClick={() => setShowPreview(true)}
                                >
                                    Preview
                                </div>
                            )}
                        </div>
                        {showPreview && <CareerPreview jobDetails={values} />}
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditCareers
