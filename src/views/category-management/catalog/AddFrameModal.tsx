/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import CommonImageUpload from '@/common/CommonImageUpload'
import CommonFilterSelect from '@/common/ComonFilterSelect'
import { handleimage } from '@/common/handleImage'
import { Button, Dialog, FormContainer } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'

interface props {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

interface initialValues {
    frame_array: File[] | []
}

const AddFrameModal = ({ isOpen, setIsOpen }: props) => {
    const [filterId, setFilterId] = useState<string | undefined>('')

    const initialValues: initialValues = {
        frame_array: [],
    }

    const handleSubmit = async (values: any) => {
        let image = ''
        if (values?.frame_array && values?.frame_array.length) {
            image = await handleimage('frame', values?.frame_array)
        }
        const filter_id = filterId
        const body = {
            task_name: 'add_frame_to_product_images',
            filter_id: filter_id,
            frame_path: image || '',
        }

        try {
            const res = await axioisInstance.post('https://dev-api.slikk.club/backend/task/process', body)
            console.log('res of add frame to product images', res)
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
            return 'Error'
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
                                    </Form>
                                )}
                            </Formik>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end bg-white">
                            <Button
                                variant="solid"
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}

export default AddFrameModal
