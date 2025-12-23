/* eslint-disable @typescript-eslint/no-explicit-any */

import { Form, Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import CategoryForm from './categoryUtils/CategoryForm'
import { textParser } from '@/common/textParser'
import { handleimage } from '@/common/handleImage'
import { filterEmptyValues } from '@/utils/apiBodyUtility'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import { Button } from '@/components/ui'

const CategoryAdd = () => {
    const navigate = useNavigate()

    const handleSubmit = async (values: any) => {
        console.log('here', values)
        const desc = textParser(values.description) || ''
        const footer = textParser(values.footer) || ''
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
            division: values?.division[0]?.id,
            division_name: values?.division[0]?.name,
            is_active: values?.is_active,
            is_try_and_buy: values?.is_try_and_buy,
            gender: values?.gender || '',
            quick_filter_tags: values?.quick_filter_tags?.join(','),
        }
        const finalBody = filterEmptyValues(body)

        try {
            const response = await axioisInstance.post('category', finalBody)
            successMessage(response)
            navigate('/app/category/category')
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    return (
        <div>
            <h4 className="mb-4">Add New Category</h4>
            <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="p-4 w-full shadow-xl rounded-xl">
                        <CategoryForm values={values} setFieldValue={setFieldValue} />
                        <div className="flex justify-end mt-4">
                            <Button type="submit" variant="solid" size="sm">
                                Add
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default CategoryAdd
