import { Button, FormContainer, FormItem, Input, Select, Upload } from '@/components/ui'
import { Field, FieldProps, Formik } from 'formik'
import React, { useState } from 'react'
import { SingleUploadArray } from './GDNqcCommon'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { useAppSelector } from '@/store'
import { beforeUpload } from '@/common/beforeUpload'
import { handleimage } from '@/common/handleImage'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

const GDNSingleUpload = () => {
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)

    const [companyData, setCompanyData] = useState<number>()
    const initialValue: any = {}

    console.log('data')

    const handleSubmit = async (values: any) => {
        console.log('start', values)
        let imageUploadData
        if (values.image && values?.image?.length > 0) {
            imageUploadData = await handleimage('product', values?.image)
        }
        const body = {
            ...values,
            images: imageUploadData,
            company_id: companyData,
        }

        console.log('Body of', body)

        try {
            const response = await axioisInstance.post(`/goods/dispatchproduct`, body)
            notification.success({
                message: response?.data?.message || 'Successfully updated ',
            })
        } catch (error: any) {
            console.error(error)
            notification.error({
                message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to Update ',
            })
        }
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, touched, errors, resetForm }) => (
                    <FormContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4  rounded-lg shadow-md">
                        {SingleUploadArray.slice(0, 10).map((item, key) => (
                            <FormItem key={key} label={item.label} className="col-span-1">
                                <Field
                                    type={item.type}
                                    name={item?.name}
                                    placeholder={`Place ${item.label}`}
                                    component={Input}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                />
                            </FormItem>
                        ))}

                        <Field name="company">
                            {({ form }: FieldProps<any>) => {
                                const selectedCompany = companyList.find((option) => option.id === form.values.company)

                                return (
                                    <div className="flex flex-col gap-2 w-full max-w-md">
                                        <label className="font-semibold text-gray-700">Select Company</label>
                                        <Select
                                            className="w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                            options={companyList}
                                            getOptionLabel={(option) => option.name}
                                            getOptionValue={(option) => option.id}
                                            value={selectedCompany || null}
                                            onChange={(newVal) => {
                                                form.setFieldValue('company', newVal?.id)
                                                setCompanyData(newVal?.id)
                                            }}
                                        />
                                    </div>
                                )
                            }}
                        </Field>

                        <div>
                            <FormContainer className="col-span-2 bg-gray-100 p-4 rounded-lg shadow-inner flex flex-col gap-4 items-center justify-center">
                                <FormItem label="" className="w-1/2">
                                    <Field name="images">
                                        {({ form }: any) => (
                                            <Upload
                                                multiple
                                                beforeUpload={beforeUpload}
                                                fileList={values.image}
                                                onChange={(files) => form.setFieldValue('image', files)}
                                                onFileRemove={(files) => form.setFieldValue('image', files)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                        </div>

                        {SingleUploadArray.slice(10).map((item, key) => (
                            <FormItem key={key} label={item.label} className="">
                                <Field type={item.type} name={item?.name} placeholder={`Place ${item.label}`} component={Input} />
                            </FormItem>
                        ))}

                        <div className="flex justify-start gap-5">
                            <Button
                                type="reset"
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                onClick={() => resetForm()}
                            >
                                Reset
                            </Button>
                            <Button variant="solid" type="submit" onClick={() => handleSubmit(values)}>
                                Submit
                            </Button>
                        </div>
                    </FormContainer>
                )}
            </Formik>
        </div>
    )
}

export default GDNSingleUpload
