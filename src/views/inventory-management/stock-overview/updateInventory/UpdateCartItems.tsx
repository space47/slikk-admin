/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import { UpdateCartArray } from './updateCommon'
import { useAppDispatch, useAppSelector } from '@/store'
import { BRAND_STATE } from '@/store/types/brand.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

const UpdateCartItems = () => {
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [dispatch])
    const initialValue = {}
    const handleSubmit = async (values: any) => {
        const body = {
            task_name: 'update_product_inventory_using_qc',
            brand: values?.brand,
            barcodes: values?.barcodes,
            update_quantity: values?.update_quantity,
        }
        console.log('body', body)

        try {
            const response = await axioisInstance.post(`/backend/task/create`, body)
            notification.success({
                message: response?.data?.message || response?.data?.data?.message || 'Successfully Updated',
            })
        } catch (error) {
            console.error(error)
            notification.error({
                message: 'Failed to Update',
            })
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
                {({ resetForm, setFieldValue }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10">
                                <FormItem label="Brand">
                                    <Field name="brand">
                                        {({ field }: FieldProps<any>) => (
                                            <Select
                                                isClearable
                                                {...field}
                                                options={brands?.brands || []}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.name}
                                                value={brands?.brands.find((option) => option.name === field.value) || null}
                                                placeholder="Select a brand"
                                                onChange={(newVal) => {
                                                    setFieldValue('brand', newVal ? newVal.name : null)
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {UpdateCartArray.map((item, key) => (
                                    <FormItem key={key} label={item.label} className="col-span-1 w-full">
                                        <Field type={item.type} name={item.name} placeholder={item.Placeholder} component={Input} />
                                    </FormItem>
                                ))}
                            </FormContainer>
                            <FormContainer className="flex justify-end mt-5">
                                <Button type="reset" className="mr-2 bg-gray-600" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="accept" type="submit" className=" text-white">
                                    Submit
                                </Button>
                            </FormContainer>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default UpdateCartItems
