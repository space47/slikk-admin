/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import { useEffect, useMemo } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { Spinner, Button } from '@/components/ui'
import { NotificationConfigData } from '@/store/types/sellerTemplate.types'
import { notificationConfigService } from '@/store/services/sellerTemplateService'
import TemplateForm from '../templateUtils/TemplateForm'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { getChangedValues } from '@/utils/apiBodyUtility'

const TemplateEdit = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    useEffect(() => {
        if (!id) {
            notification.error({ message: 'Invalid template ID' })
            navigate(-1)
        }
    }, [id, navigate])
    const { data, isLoading, isSuccess, isError, error } = notificationConfigService.useGetSingleNotificationDataQuery(
        { id: id as string },
        { skip: !id },
    )
    const [updateTemplate, updateResponse] = notificationConfigService.useUpdateTemplateMutation()
    useEffect(() => {
        if (isError) {
            notification.error({
                message: getApiErrorMessage(error),
            })
        }
    }, [isError, error])
    useEffect(() => {
        if (updateResponse.isSuccess) {
            notification.success({ message: 'Template updated successfully' })
            navigate(-1)
        }

        if (updateResponse.isError) {
            notification.error({
                message: getApiErrorMessage(updateResponse.error),
            })
        }
    }, [updateResponse.isSuccess, updateResponse.isError, updateResponse.error])

    const initialValues = useMemo(
        () => ({
            event_name: data?.message?.event_name,
            title: data?.message?.title ?? '',
            message: data?.message?.message ?? '',
            is_active: data?.message?.is_active,
        }),
        [data],
    )

    const handleSubmit = async (values: NotificationConfigData) => {
        const body = {
            event_name: values.event_name?.trim() || '',
            title: values.title?.trim() || '',
            message: values.message?.trim() || '',
            is_active: values?.is_active ?? false,
        }

        const changedValues = getChangedValues(initialValues, body)

        await updateTemplate({
            id: id as string,
            notification_type: 'EMAIL',
            ...changedValues,
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center mt-10">
                <Spinner size={30} />
            </div>
        )
    }
    if (!isLoading && isSuccess && !data?.message) {
        return <div className="text-center mt-10 text-gray-500">Template not found.</div>
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Edit Template</h3>

            <Formik enableReinitialize initialValues={initialValues as NotificationConfigData} onSubmit={handleSubmit}>
                {({ values, isSubmitting }) => (
                    <Form className="w-full p-5">
                        <TemplateForm values={values} />

                        <div className="flex justify-end mt-6 gap-3">
                            <Button
                                type="submit"
                                variant="solid"
                                loading={updateResponse.isLoading || isSubmitting}
                                disabled={updateResponse.isLoading}
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

export default TemplateEdit
