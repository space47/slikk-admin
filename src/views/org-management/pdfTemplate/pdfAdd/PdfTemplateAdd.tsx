/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { notificationConfigService } from '@/store/services/sellerTemplateService'

import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import PdfTemplateForm from '../pdfTemplateUtils/PdfTemplateForm'

const TemplateAdd = () => {
    const navigate = useNavigate()

    const [addTemplate, addResponse] = notificationConfigService.useAddPdfTemplateMutation()

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

    const handleSubmit = async (values: any) => {
        await addTemplate({
            name: values.name?.trim() || '',
            description: values.description || '',
            template_data: values.message?.trim() || '',
            is_active: values?.is_active ?? false,
        })
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Edit Template</h3>

            <Formik enableReinitialize initialValues={{} as any} onSubmit={handleSubmit}>
                {({ values, isSubmitting }) => (
                    <Form className="w-full p-5">
                        <PdfTemplateForm values={values} />

                        <div className="flex justify-end mt-6 gap-3">
                            <Button
                                type="submit"
                                variant="solid"
                                loading={addResponse.isLoading || isSubmitting}
                                disabled={addResponse.isLoading}
                            >
                                Add PDF Template
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default TemplateAdd
