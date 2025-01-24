/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { useAppDispatch } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import CareerForm from '../CareerForm'
import { useNavigate } from 'react-router-dom'

const AddCareers = () => {
    const dispatch = useAppDispatch()
    const [departmentsData, setDepartmentsData] = useState<any[]>([])
    const navigate = useNavigate()

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
    }, [])

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])
    const initialValue = {}

    const handleSubmit = async (values: any) => {
        const body = {
            title: values?.title || '',
            description: values?.description || '',
            location: values?.location || '',
            job_type: values?.job_type || '',
            min_experience: values?.min_experience || 0,
            department: values?.department || null,
            responsibilities: values?.responsibilities || '',
            qualifications: values?.qualifications || '',
            how_to_apply: values?.how_to_apply || '',
        }

        console.log('Body of the request', body)
        try {
            const response = await axioisInstance.post(`/jobs`, body)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Successfully added  jobs',
            })
            navigate(-1)
        } catch (error: any) {
            notification.error({
                message: 'Error',
                description: error?.response?.data?.message || 'Failed to add',
            })
            console.error(error)
        }
    }

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
                        <Button variant="accept" type="submit">
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddCareers
