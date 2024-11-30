import React, { useEffect, useState } from 'react'
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import DialogcheckBox from '@/common/DialogCheckbox'

const UpdateCartItems = () => {
    const [showDialogBox, setShowDialogBox] = useState(false)
    const [pendingFieldName, setPendingFieldName] = useState<string | null>(null)
    const brands = useAppSelector((state) => state.brands)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [dispatch])

    const initialValue = {
        update_quantity: false,
        brand: null,
        barcodes: '',
    }

    const handleSubmit = async (values: any) => {
        const body = {
            task_name: 'update_product_inventory_using_qc',
            brand: values?.brand,
            barcodes: values?.barcodes,
            update_quantity: values?.update_quantity,
        }

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

    const handleDialogConfirm = (form: any) => {
        if (pendingFieldName) {
            form.setFieldValue(pendingFieldName, true)
        }
        setShowDialogBox(false)
        setPendingFieldName(null)
    }

    const handleDialogCancel = (form: any) => {
        if (pendingFieldName) {
            form.setFieldValue(pendingFieldName, false)
        }
        setShowDialogBox(false)
        setPendingFieldName(null)
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ resetForm, setFieldValue, values }) => (
                    <>
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
                                                    isDisabled={!!values.barcodes}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>

                                    <FormItem label="Barcode" className="col-span-1 w-full">
                                        <Field name="barcodes">
                                            {({ field }: FieldProps<any>) => (
                                                <Input
                                                    type="text"
                                                    {...field}
                                                    placeholder="Enter Barcodes comma separated"
                                                    onChange={(e) => {
                                                        setFieldValue('barcodes', e.target.value)
                                                    }}
                                                    disabled={!!values.brand}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                    <FormItem label="Update quantity" className="col-span-1 w-full">
                                        <Field name="update_quantity">
                                            {({ field, form }: any) => (
                                                <input
                                                    type="checkbox"
                                                    {...field}
                                                    checked={field.value}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        if (!field.value && e.target.checked) {
                                                            setShowDialogBox(true)
                                                            setPendingFieldName(field.name)
                                                        } else {
                                                            form.setFieldValue(field.name, false)
                                                        }
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
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

                        {showDialogBox && (
                            <DialogcheckBox
                                IsOpen={showDialogBox}
                                setIsOpen={setShowDialogBox}
                                onDialogOk={() => handleDialogConfirm({ setFieldValue })}
                                onDialogClose={() => handleDialogCancel({ setFieldValue })}
                                IsConfirm
                                headingName="Update Quantity"
                            />
                        )}
                    </>
                )}
            </Formik>
        </div>
    )
}

export default UpdateCartItems
