/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormItem, Input, Select } from '@/components/ui'
import { useAppSelector } from '@/store'
import { departmentTypes } from '@/store/types/departments.types'
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import DepartmentsForm from './DepartmentsForm'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { handleimage } from '@/common/handleImage'

interface Props {
    setIsOpen: (value: boolean) => void
}

const EditDepartment = ({ setIsOpen }: Props) => {
    const [departmentName, setDepartmentName] = useState<number | undefined>()
    const [departmentDataList, setDepartmentDataList] = useState<Record<string, string | number | boolean>>()
    const { departmentsData } = useAppSelector<departmentTypes>((state) => state.departmentsData)

    const fetchDepartmentsData = async () => {
        try {
            const response = await axioisInstance.get(`/departments?department=${departmentName}`)
            const data = response?.data?.data
            setDepartmentDataList(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (departmentName) {
            fetchDepartmentsData()
        }
    }, [departmentName])

    console.log('Checkinh active', departmentName)

    const formattedData = departmentsData?.map((item) => ({
        label: item?.name,
        value: item?.id,
    }))

    const initialValue = {
        name: departmentDataList?.name,
        description: departmentDataList?.description,
        image: departmentDataList?.image,
        is_active: departmentDataList?.is_active,
    }

    const onDialogOk = async (values: any) => {
        const imageUpload = values?.imageList ? await handleimage('product', values?.imageList) : ''

        const body = {
            ...(values?.is_active && { is_active: values?.is_active }),
            ...(values?.name && { name: values?.name }),
            ...(values?.description && { description: values?.description }),
            ...(values?.imageList && { image: imageUpload }),
        }
        try {
            const response = await axioisInstance.patch(`/departments/${departmentName}`, body)
            notification.success({
                message: response?.data?.message || 'Successfully Updated department',
            })
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || 'Failed to update department',
            })
            console.error(error)
        } finally {
            setIsOpen(false)
        }
    }

    return (
        <div>
            <div>
                <label htmlFor="" className="mb-5">
                    Select Department
                </label>
                <Select
                    isClearable
                    className="xl:w-[300px]"
                    options={formattedData}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    onChange={(newVal) => {
                        return setDepartmentName(newVal?.value)
                    }}
                />
            </div>

            {departmentName !== undefined && (
                <>
                    <div>
                        <Formik
                            enableReinitialize
                            initialValues={initialValue}
                            // validationSchema={validationSchema}
                            onSubmit={onDialogOk}
                        >
                            {({ values }) => (
                                <Form className="w-3/4">
                                    <FormItem label="Acitve" className="mt-5">
                                        <Field name="is_active" type="checkbox" component={Input} />
                                    </FormItem>
                                    <DepartmentsForm values={values} />

                                    <Button variant="accept" type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </>
            )}
        </div>
    )
}

export default EditDepartment
