/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import CommonImageUpload from '@/common/CommonImageUpload'
import CommonFilterSelect from '@/common/ComonFilterSelect'
import { handleimage } from '@/common/handleImage'
import { Button, Checkbox, Dialog, FormItem } from '@/components/ui'
import { frameService } from '@/store/services/frameTemplatesService'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { Field, Form, Formik } from 'formik'
import React, { useState, useEffect } from 'react'

interface props {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

const AddFrameModal = ({ isOpen, setIsOpen }: props) => {
    const [filterId, setFilterId] = useState<string | undefined>('')
    const [templates, setTemplates] = useState<any[]>([])

    const frameCall = frameService.useFrameListQuery({})

    useEffect(() => {
        if (frameCall.isSuccess && frameCall.data) {
            const formattedData = frameCall.data.map((item) => ({
                label: item.name,
                value: item.id,
            }))
            setTemplates(formattedData)
        }
    }, [frameCall.isSuccess, frameCall.data])

    const initialValues: any = {
        frame_array: [],
        template_id: '',
    }

    const handleSubmit = async (values: any) => {
        if (!values?.is_delete) {
            if (!values?.template_id) {
                notification.error({ message: 'Select a template before submitting.' })
                return
            }
            if (!values?.frame_array?.length) {
                notification.error({ message: 'Upload a frame image before submitting.' })
                return
            }
        }

        notification.info({
            message: 'Processing',
            description: 'Your request is being processed. Please wait...',
        })
        let image = ''
        if (values?.frame_array && values?.frame_array.length) {
            image = await handleimage('frame', values?.frame_array)
        }
        const filter_id = filterId
        const body = values?.is_delete
            ? {
                  filter_id: filter_id,
              }
            : {
                  is_price_tag_required: values?.is_price_tag_required || false,
                  filter_id: filter_id,
                  frame_path: image,
                  template_id: Number(values.template_id),
              }

        try {
            const res = values?.is_delete
                ? await axioisInstance.delete('/product/framed/task ', { data: body })
                : await axioisInstance.post('/product/framed/task', body)
            notification.success({
                message: 'Success',
                description: res?.data?.message || 'Frame added successfully',
            })
            setIsOpen(false)
        } catch (error) {
            console.log('error', error)
            if (error instanceof AxiosError) {
                notification.error({
                    message: 'Failure',
                    description: error?.response?.data?.message || 'Frame not added',
                })
            }
        }
    }

    return (
        <div>
            <div>
                <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={1200}>
                    <div className="flex flex-col h-[80vh] max-h-[80vh]">
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-800">Add Frames</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                                {({ values }) => (
                                    <Form className="space-y-6">
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                                            <CommonImageUpload
                                                label="Upload Frame Images"
                                                beforeUpload={beforeUpload}
                                                fileList={values?.frame_array as File[]}
                                                fieldNames="frame_array"
                                                name="frame_array"
                                            />
                                        </div>

                                        <FormItem label="Price Tag">
                                            <Field name="is_price_tag_required" component={Checkbox} />
                                        </FormItem>
                                        <FormItem label="Delete Existing Frames">
                                            <Field name="is_delete" component={Checkbox} />
                                        </FormItem>

                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm relative">
                                            <FormItem label="Select Template">
                                                <CommonSelect name="template_id" label="" options={templates} />
                                            </FormItem>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                                            <CommonFilterSelect
                                                isSku
                                                isCsv
                                                noExtra
                                                values={values}
                                                filterId={filterId}
                                                setFilterId={setFilterId}
                                            />
                                        </div>
                                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end bg-white">
                                            <Button
                                                variant="solid"
                                                type="submit"
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>

                        {/* Footer */}
                    </div>
                </Dialog>
            </div>
        </div>
    )
}

export default AddFrameModal
