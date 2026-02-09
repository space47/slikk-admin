/* eslint-disable @typescript-eslint/no-explicit-any */
import Dialog from '@/components/ui/Dialog'
import { PickerTableData } from '@/store/types/picker.types'
import { Field, Form, Formik } from 'formik'
import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import FullTimePicker from '@/common/FullTimePicker'
import { useMemo } from 'react'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { AxiosError } from 'axios'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import StoreSelectForm from '@/common/StoreSelectForm'

interface initialValueProps {
    first_name?: string
    last_name?: string
    mobile?: string
    shift_start_time?: string
    shift_end_time?: string
    store?: { id: number; code: string }[]
}

interface props {
    isEdit?: boolean
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    rowDetails?: PickerTableData
}

const PickerDetailEditModal = ({ dialogIsOpen, setIsOpen, rowDetails, isEdit }: props) => {
    const mobile = rowDetails?.user?.mobile

    const query = useMemo(() => {
        return `/picker/profile?mobile=${mobile}`
    }, [mobile])

    const { data: pickerData } = useFetchSingleData<any>({ url: query || '', skip: !mobile })

    const initialValueEdit = {
        first_name: isEdit && pickerData ? pickerData[0]?.user?.first_name : '',
        last_name: isEdit && pickerData ? pickerData[0]?.user?.last_name : '',
        mobile: isEdit && pickerData ? pickerData[0]?.user?.mobile : '', //
        shift_start_time: isEdit && pickerData ? pickerData[0]?.shift_start_time : '',
        shift_end_time: isEdit && pickerData ? pickerData[0]?.shift_end_time : '',
        store: isEdit && pickerData ? pickerData[0]?.store?.map((item: any) => ({ id: item.id, code: item.code })) : [],
    }

    const handleSubmit = async (values: initialValueProps) => {
        const body = {
            first_name: values?.first_name,
            last_name: values?.last_name,
            mobile: values?.mobile,
            shift_start_time: values?.shift_start_time,
            shift_end_time: values?.shift_end_time,
            store_id: values?.store?.map((item: any) => item.id)?.join(','),
        }
        try {
            let res = null
            if (isEdit) {
                res = await axioisInstance.patch(`picker/profile/${mobile}`, body)
            } else {
                res = await axioisInstance.post(`picker/profile`, body)
            }
            notification.success({ message: res?.data?.message || 'successfully created' })
            setIsOpen(false)
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.message || 'Failed' })
            }
        }
    }

    return (
        <div>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={() => setIsOpen(false)}
                onRequestClose={() => setIsOpen(false)}
                width={900}
                height={'85vh'}
                className="overflow-hidden"
            >
                <div className="h-full flex flex-col">
                    <div className="px-8 py-6 border-b bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit picker' : 'Add New picker'}</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    {isEdit ? 'Update picker information' : 'Fill in the picker details below'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form content */}
                    <div className="flex-1 overflow-y-auto">
                        <Formik enableReinitialize initialValues={initialValueEdit} onSubmit={handleSubmit}>
                            {({ isSubmitting }) => (
                                <Form>
                                    <FormContainer className="p-8 space-y-8">
                                        {/* Personal Information Section */}
                                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                                            <div className="mb-6">
                                                <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                                                <div className="h-1 w-12 bg-blue-500 rounded-full mt-2"></div>
                                            </div>

                                            <FormContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <FormItem label="First Name" className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Field
                                                        type="text"
                                                        component={Input}
                                                        placeholder="Enter first name"
                                                        name="first_name"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    />
                                                </FormItem>

                                                <FormItem label="Last Name" className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Field
                                                        type="text"
                                                        component={Input}
                                                        placeholder="Enter last name"
                                                        name="last_name"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    />
                                                </FormItem>

                                                <FormItem label="Mobile Number" className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Field
                                                        type="text"
                                                        component={Input}
                                                        placeholder="Enter mobile number"
                                                        name="mobile"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    />
                                                </FormItem>
                                            </FormContainer>
                                        </div>

                                        {/* Store Details Section */}
                                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                                            <div className="mb-6">
                                                <h2 className="text-lg font-bold text-gray-900">Store Select</h2>
                                                <div className="h-1 w-12 bg-green-500 rounded-full mt-2"></div>
                                            </div>

                                            <div className="space-y-2">
                                                <StoreSelectForm label="" name="store" customCss="w-full xl:w-[600px]" />
                                            </div>
                                            <p className="text-sm text-gray-500 mt-3">
                                                Select the store where this picker will be assigned
                                            </p>
                                        </div>

                                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                                            <div className="mb-6">
                                                <h2 className="text-lg font-bold text-gray-900">Shift Timings</h2>
                                                <div className="h-1 w-12 bg-purple-500 rounded-full mt-2"></div>
                                            </div>

                                            <FormContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">Shift Start Time</label>
                                                    <FullTimePicker
                                                        needClass
                                                        label=""
                                                        name="shift_start_time"
                                                        fieldname="shift_start_time"
                                                        customClass="w-full"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-gray-700">Shift End Time</label>
                                                    <FullTimePicker
                                                        needClass
                                                        label=""
                                                        name="shift_end_time"
                                                        fieldname="shift_end_time"
                                                        customClass="w-full"
                                                    />
                                                </div>
                                            </FormContainer>
                                        </div>
                                        <div className="border-t border-gray-200 my-4"></div>
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        {isEdit ? 'Update picker information' : 'Add new picker to the system'}
                                                    </p>
                                                </div>

                                                <div className="flex gap-3">
                                                    <Button
                                                        variant="default"
                                                        type="button"
                                                        onClick={() => setIsOpen(false)}
                                                        className="px-6 py-3 border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-white rounded-lg font-medium transition-colors min-w-[100px]"
                                                    >
                                                        Cancel
                                                    </Button>

                                                    <Button
                                                        variant="accept"
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                                                    >
                                                        {isSubmitting ? (
                                                            <span className="flex items-center justify-center gap-2">
                                                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                                                Processing...
                                                            </span>
                                                        ) : isEdit ? (
                                                            'Update picker'
                                                        ) : (
                                                            'Add picker'
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            {isEdit && (
                                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                                                    Note: Updating picker details will affect their schedule and store assignments.
                                                </div>
                                            )}
                                        </div>
                                    </FormContainer>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default PickerDetailEditModal
