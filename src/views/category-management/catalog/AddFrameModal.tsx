/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import CommonImageUpload from '@/common/CommonImageUpload'
import CommonFilterSelect from '@/common/ComonFilterSelect'
import { handleimage } from '@/common/handleImage'
import { Button, Checkbox, Dialog, FormItem } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { Field, Form, Formik } from 'formik'
import React, { useState, useEffect } from 'react'

interface props {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

interface initialValues {
    frame_array: File[] | []
}

const AddFrameModal = ({ isOpen, setIsOpen }: props) => {
    const [filterId, setFilterId] = useState<string | undefined>('')
    const [templates, setTemplates] = useState<any[]>([])

    const fetchTemplates = async () => {
        try {
            const res = await axioisInstance.get('/product/frame-style-templates/?is_active=true')
            setTemplates(res?.data?.results || res?.data || [])
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (isOpen) {
            fetchTemplates()
        }
    }, [isOpen])

    const handleDeleteTemplate = async (id: string) => {
        try {
            await axioisInstance.delete(`/product/frame-style-templates/${id}/`)
            notification.success({ message: 'Template Deleted', description: 'Template has been successfully removed.' })
            fetchTemplates()
        } catch (e: any) {
            notification.error({ message: 'Failed to delete template', description: e.message || 'Unknown error occurred.' })
        }
    }

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
                : await axioisInstance.post('/product/product/framed/task', body)
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
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-800">Add Frames</h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 transition">
                                ✕
                            </button>
                        </div>

                        {/* Body (scrollable area) */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                                {({ values }) => (
                                    <Form className="space-y-6">
                                        {/* Upload */}
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

                                        {/* Template Selector */}
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm relative">
                                            <h3 className="font-semibold text-gray-500 shadow-sm">Apply Saved Template</h3>
                                            <div className="flex gap-4 items-end">
                                               <div className="flex-1">
                                                <FormItem label="Select Template" className="mb-0">
                                                    <Field name="template_id" as="select" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-200 focus:border-gray-500">
                                                        <option value="">-- No Template (Manual Overlay) --</option>
                                                        {templates.map((t: any) => (
                                                            <option key={t.id} value={t.id}>{t.name}</option>
                                                        ))}
                                                    </Field>
                                                </FormItem>
                                               </div>
                                            </div>
                                            
                                            {/* Delete templates list under it for mock admin delete capability */}
                                            <div className="mt-4 pt-4 border-t border-indigo-200">
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Manage Templates</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {templates.map((t: any) => (
                                                        <div key={t.id} className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm text-sm border border-gray-200 hover:border-red-300 transition-colors group">
                                                            <span className="text-gray-700 font-medium">{t.name}</span>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => handleDeleteTemplate(t.id)}
                                                                className="text-gray-400 group-hover:text-red-500 font-bold transition-colors ml-1"
                                                            >×</button>
                                                        </div>
                                                    ))}
                                                    {templates.length === 0 && <span className="text-xs text-gray-400 italic">No templates available.</span>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Filter Select */}
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
