/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import { useEffect, useMemo } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { Spinner, Button } from '@/components/ui'
import { SellerTemplateData } from '@/store/types/sellerTemplate.types'
import { sellerTemplateService } from '@/store/services/sellerTemplateService'
import TemplateForm from '../templateUtils/TemplateForm'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'

const TemplateEdit = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    useEffect(() => {
        if (!id) {
            notification.error({ message: 'Invalid template ID' })
            navigate(-1)
        }
    }, [id, navigate])
    const { data, isLoading, isSuccess, isError, error } = sellerTemplateService.useGetSingleTemplateListQuery(
        { id: id as string },
        { skip: !id },
    )
    const [updateTemplate, updateResponse] = sellerTemplateService.useUpdateTemplateMutation()
    useEffect(() => {
        if (isError) {
            notification.error({
                message: getApiErrorMessage(error),
            })
        }
    }, [isError, error])
    useEffect(() => {
        if (updateResponse.isSuccess) {
            notification.success({
                message: 'Template updated successfully',
            })
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
            name: data?.message?.name ?? '',
            email_subject: data?.message?.email_subject ?? '',
            email_body: data?.message?.email_body ?? '',
        }),
        [data],
    )

    const handleSubmit = async (values: SellerTemplateData) => {
        await updateTemplate({
            id: id as string,
            name: values.name?.trim(),
            email_body: values.email_body?.trim(),
            email_subject: values.email_subject?.trim(),
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

            <Formik enableReinitialize initialValues={initialValues as SellerTemplateData} onSubmit={handleSubmit}>
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
