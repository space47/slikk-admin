/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import { useEffect, useMemo } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { Spinner, Button } from '@/components/ui'
import { notificationConfigService } from '@/store/services/sellerTemplateService'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { getChangedValues } from '@/utils/apiBodyUtility'
import PdfTemplateForm from '../pdfTemplateUtils/PdfTemplateForm'

const PdfTemplateEdit = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    useEffect(() => {
        if (!id) {
            notification.error({ message: 'Invalid template ID' })
            navigate(-1)
        }
    }, [id, navigate])
    const { data, isLoading, isError, error } = notificationConfigService.useGetSingleNotificationPdfDataQuery(
        { id: id as string },
        { skip: !id },
    )
    const [updateTemplate, updateResponse] = notificationConfigService.useUpdatePdfTemplateMutation()
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
            name: data?.data?.name,
            description: data?.data?.description ?? '',
            message: data?.data?.template_data ?? '',
            is_active: data?.data?.is_active,
        }),
        [data],
    )

    const handleSubmit = async (values: any) => {
        const body = {
            name: values.name?.trim() || '',
            description: values.description?.trim() || '',
            template_data: values.message?.trim() || '',
            is_active: values?.is_active ?? false,
        }

        const changedValues = getChangedValues(initialValues, body as any)

        await updateTemplate({
            id: id as string,
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

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Edit Template</h3>

            <Formik enableReinitialize initialValues={initialValues as any} onSubmit={handleSubmit}>
                {({ values, isSubmitting }) => (
                    <Form className="w-full p-5">
                        <PdfTemplateForm values={values} />

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

export default PdfTemplateEdit
