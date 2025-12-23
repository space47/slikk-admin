/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { Form, Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import DivisionCommonForm from './divisionUtils/DivisionForm'
import { filterEmptyValues } from '@/utils/apiBodyUtility'
import { textParser } from '@/common/textParser'
import { handleimage } from '@/common/handleImage'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import { DivisionFormModel } from './divisionCommon'

const DivisionNew = () => {
    const navigate = useNavigate()

    const handleSubmit = async (values: DivisionFormModel) => {
        const desc = textParser(values.description as string) || ''
        const footer = textParser(values.footer as string) || ''
        const imageUpload = values?.image_array?.length
            ? await handleimage('category', values?.image_array)
            : values?.image
              ? values?.image
              : ''
        const body = {
            position: values?.position || '',
            title: values?.title || '',
            description: desc || '',
            footer: footer || '',
            name: values?.name || '',
            image: imageUpload,
            is_active: values?.is_active,
            is_try_and_buy: values?.is_try_and_buy,
            gender: values?.gender || '',
            quick_filter_tags: Array.isArray(values?.quick_filter_tags)
                ? values?.quick_filter_tags?.join(',')
                : values?.quick_filter_tags
                  ? values?.quick_filter_tags
                  : '',
        }
        const finalBody = filterEmptyValues(body)
        try {
            const response = await axioisInstance.post('division', finalBody)
            successMessage(response)
            navigate('/app/category/division')
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    return (
        <div>
            <h4 className="mb-4">Add New Division</h4>
            <Formik enableReinitialize initialValues={{} as any} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="w-full" onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}>
                        <FormContainer>
                            <DivisionCommonForm setFieldValue={setFieldValue} values={values} />

                            <div className="flex justify-end mt-5">
                                <Button variant="solid" type="submit">
                                    Submit
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default DivisionNew
