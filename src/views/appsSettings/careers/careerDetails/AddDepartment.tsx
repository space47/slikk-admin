/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleimage } from '@/common/handleImage'
import { Button } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Form, Formik } from 'formik'
import DepartmentsForm from './DepartmentsForm'

interface Props {
    setIsOpen: (value: boolean) => void
}

const AddDepartment = ({ setIsOpen }: Props) => {
    const initialValue = {
        name: '',
        description: '',
        imageList: [],
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
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={onDialogOk}
            >
                {({ values }) => (
                    <Form className="w-3/4">
                        <DepartmentsForm values={values} />
                        <Button variant="accept" type="submit">
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddDepartment
