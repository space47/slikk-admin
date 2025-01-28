/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { FormContainer, FormItem, Input, Upload } from '@/components/ui'
import { RichTextEditor } from '@/components/shared'
import { beforeUpload } from '@/common/beforeUpload'
import { handleimage } from '@/common/handleImage'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (value: boolean) => void
}

const NewDeptModal = ({ dialogIsOpen, setIsOpen }: Props) => {
    const initialValue = {}
    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = async (values: any) => {
        const imageUpload = values?.imageList ? await handleimage('product', values?.imageList) : ''

        const body = {
            name: values?.name,
            description: values?.description,
            image: imageUpload,
        }
        try {
            const response = await axioisInstance.post(`/departments`, body)
            notification.success({
                message: response?.data?.message || 'Successfully added department',
            })
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || 'Failed to add department',
            })
            console.error(error)
        } finally {
            setIsOpen(false)
        }
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose} width={1300}>
                <h5 className="mb-4">Dialog Title</h5>
                <Formik
                    enableReinitialize
                    initialValues={initialValue}
                    // validationSchema={validationSchema}
                    onSubmit={onDialogOk}
                >
                    {({ values }) => (
                        <Form className="w-3/4">
                            <FormContainer className="">
                                <FormItem label="Name">
                                    <Field name="name" type="text" placeholder="Enter Name" component={Input} />
                                </FormItem>

                                <FormItem label="Description">
                                    <Field name="description">
                                        {({ field, form }: FieldProps) => (
                                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem label="" className="grid grid-rows-2">
                                    <Field name="imageList">
                                        {({ form }: FieldProps<any>) => (
                                            <>
                                                <div className="font-semibold flex justify-center">Image</div>
                                                <Upload
                                                    beforeUpload={beforeUpload}
                                                    fileList={values.imageList}
                                                    className="flex justify-center"
                                                    onFileRemove={(files) => form.setFieldValue('imageList', files)}
                                                    onChange={(files) => form.setFieldValue('imageList', files)}
                                                />
                                            </>
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                            <Button variant="accept" type="submit">
                                Submit
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    )
}

export default NewDeptModal
