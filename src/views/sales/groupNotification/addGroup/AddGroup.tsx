/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Form, Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import Papa from 'papaparse'
import { form } from './commonTypesGroup/userProfile'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import AddGroupForm from './AddGroupForm'
import FormButton from '@/components/ui/Button/FormButton'

const AddGroup = () => {
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [spinner, setSpinner] = useState(false)
    const [csvFile, setCSVFile] = useState<any>()
    const [mobileNumbers, setMobileNumbers] = useState<string[]>([])
    const initialValue = {}

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
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
            const response = await axioisInstance.post(`/notification/groups`, form(values, csvFile, mobileNumbers as any))
            console.log(response.data)
            notification.success({ message: response.data.message || 'Successfully added group' })
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to add' })
            }
        } finally {
            setSpinner(false)
        }
    }
    return (
        <div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {() => (
                    <Form className="w-full p-6 bg-white rounded-xl shadow-xl space-y-8">
                        {/* Groups Section */}
                        <AddGroupForm
                            handleCSVFileChange={handleCSVFileChange}
                            setMobileNumbers={setMobileNumbers}
                            setCSVFile={setCSVFile}
                            filters={filters}
                        />

                        {/* Form Actions */}
                        <FormButton isSpinning={spinner} value="ADD" />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddGroup
