import Dialog from '@/components/ui/Dialog'
import { pickerBoardData } from '@/store/types/picker.types'
import { Field, Formik } from 'formik'
import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import FullTimePicker from '@/common/FullTimePicker'

interface initialValueProps {
    name?: string
    mobile?: string
    shift_start_time?: string
    shift_end_time?: string
}

interface props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    rowDetails: pickerBoardData
}

const PickerDetailEditModal = ({ dialogIsOpen, setIsOpen, rowDetails }: props) => {
    const initialValue = {
        name: rowDetails?.name,
        mobile: rowDetails?.mobile,
    }

    const handleSubmit = async (values: initialValueProps) => {
        console.log('values', values)
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={() => setIsOpen(false)} onRequestClose={() => setIsOpen(false)}>
                <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                    {() => (
                        <FormContainer>
                            <FormItem label="Name">
                                <Field type="text" component={Input} placeholder="Enter Name" name="name" />
                            </FormItem>
                            <FormItem label="Mobile">
                                <Field type="text" component={Input} placeholder="Enter Mobile" name="mobile" />
                            </FormItem>
                            <FullTimePicker label="SHIFT START" name="shift_start_time" fieldname="shift_start_time" />
                            <FullTimePicker label="SHIFT END" name="shift_end_time" fieldname="shift_end_time" />

                            <FormItem className="flex mt-4">
                                <Button variant="accept">Edit</Button>
                            </FormItem>
                        </FormContainer>
                    )}
                </Formik>
            </Dialog>
        </div>
    )
}

export default PickerDetailEditModal
