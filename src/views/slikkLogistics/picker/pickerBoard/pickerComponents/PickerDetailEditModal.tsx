/* eslint-disable @typescript-eslint/no-explicit-any */
import Dialog from '@/components/ui/Dialog'
import { pickerBoardData } from '@/store/types/picker.types'
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
    rowDetails?: pickerBoardData
}

const PickerDetailEditModal = ({ dialogIsOpen, setIsOpen, rowDetails, isEdit }: props) => {
    const mobile = rowDetails?.mobile

    const query = useMemo(() => {
        return `/picker/profile?mobile=${mobile}`
    }, [])

    const { data: pickerData } = useFetchSingleData<any>({ url: query })

    const initialValueEdit = {
        first_name: isEdit && pickerData ? pickerData[0]?.user?.first_name : '',
        last_name: isEdit && pickerData ? pickerData[0]?.user?.last_name : '',
        mobile: isEdit && pickerData ? pickerData[0]?.user?.mobile : '', //
        shift_start_time: isEdit && pickerData ? pickerData[0]?.shift_start_time : '',
        shift_end_time: isEdit && pickerData ? pickerData[0]?.shift_end_time : '',
        store: isEdit && pickerData ? pickerData[0]?.stores?.map((item: any) => ({ id: item.id, code: item.code })) : [],
    }

    const handleSubmit = async (values: initialValueProps) => {
        console.log('values', values)
        const body = {
            first_name: values?.first_name,
            last_name: values?.last_name,
            mobile: values?.mobile,
            shift_start_time: values?.shift_start_time,
            shift_end_time: values?.shift_end_time,
            store_id: values?.store?.map((item: any) => item.id),
        }
        console.log('body', body)

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
            <Dialog isOpen={dialogIsOpen} onClose={() => setIsOpen(false)} onRequestClose={() => setIsOpen(false)}>
                <Formik enableReinitialize initialValues={initialValueEdit} onSubmit={handleSubmit}>
                    {({ values }) => (
                        <Form>
                            <FormContainer>
                                <FormContainer className="grid grid-cols-2 gap-2">
                                    <FormItem label="First Name">
                                        <Field type="text" component={Input} placeholder="Enter Name" name="first_name" />
                                    </FormItem>
                                    <FormItem label="Last Name">
                                        <Field type="text" component={Input} placeholder="Enter Name" name="last_name" />
                                    </FormItem>
                                    <FormItem label="Mobile">
                                        <Field type="text" component={Input} placeholder="Enter Name" name="mobile" />
                                    </FormItem>
                                </FormContainer>
                                <StoreSelectForm label="Store" name="store" />
                                <FormContainer className="grid grid-cols-2 gap-2">
                                    <FullTimePicker
                                        needClass
                                        label="SHIFT START"
                                        name="shift_start_time"
                                        fieldname="shift_start_time"
                                        customClass="w-full"
                                    />
                                    <FullTimePicker
                                        needClass
                                        label="SHIFT END"
                                        name="shift_end_time"
                                        fieldname="shift_end_time"
                                        customClass="w-full"
                                    />
                                </FormContainer>
                                <FormItem className="flex mt-4">
                                    <Button variant="accept" type="submit">
                                        {isEdit ? 'Edit' : 'Add'}
                                    </Button>
                                </FormItem>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    )
}

export default PickerDetailEditModal
