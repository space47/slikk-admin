/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'
import { NotificationConfigData } from '@/store/types/sellerTemplate.types'
import { notificationConfigService } from '@/store/services/sellerTemplateService'
import TemplateForm from '../templateUtils/TemplateForm'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'

const TemplateAdd = () => {
    const navigate = useNavigate()

    const [addTemplate, addResponse] = notificationConfigService.useAddTemplateMutation()

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

    const handleSubmit = async (values: NotificationConfigData) => {
        await addTemplate({
            event_name: values.event_name?.trim() || '',
            title: values.title?.trim() || '',
            message: values.message?.trim() || '',
            is_active: values?.is_active ?? false,
            notification_type: 'EMAIL',
        })
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Edit Template</h3>

            <Formik enableReinitialize initialValues={{} as NotificationConfigData} onSubmit={handleSubmit}>
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
