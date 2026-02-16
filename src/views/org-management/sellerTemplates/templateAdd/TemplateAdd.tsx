/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { SellerTemplateData } from '@/store/types/sellerTemplate.types'
import { sellerTemplateService } from '@/store/services/sellerTemplateService'
import TemplateForm from '../templateUtils/TemplateForm'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'

const TemplateAdd = () => {
    const navigate = useNavigate()

    const [addTemplate, addResponse] = sellerTemplateService.useAddTemplateMutation()

    useEffect(() => {
        if (addResponse.isSuccess) {
            notification.success({
                message: 'Template updated successfully',
            })
            navigate(-1)
        }

        if (addResponse.isError) {
            notification.error({
                message: getApiErrorMessage(addResponse.error),
            })
        }
    }, [addResponse.isSuccess, addResponse.isError, addResponse.error])

    const initialValues = {
        name: '',
        email_subject: '',
        email_body: '',
    }

    const handleSubmit = async (values: SellerTemplateData) => {
        await addTemplate({
            name: values.name?.trim(),
            email_body: values.email_body?.trim(),
            email_subject: values.email_subject?.trim(),
        })
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Edit Template</h3>

            <Formik enableReinitialize initialValues={initialValues as SellerTemplateData} onSubmit={handleSubmit}>
                {({ values, isSubmitting }) => (
                    <Form className="w-full p-5">
                        <TemplateForm values={values} />

                        <div className="flex justify-end mt-6 gap-3">
                            <Button
                                type="submit"
                                variant="solid"
                                loading={addResponse.isLoading || isSubmitting}
                                disabled={addResponse.isLoading}
                            >
                                Update Template
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default TemplateAdd
