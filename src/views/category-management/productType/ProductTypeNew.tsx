/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import ProductTypeForm from './productTypeUtils/ProductTypeForm'
import FormButton from '@/components/ui/Button/FormButton'
import { filterEmptyValues } from '@/utils/apiBodyUtility'
import { textParser } from '@/common/textParser'
import { handleimage } from '@/common/handleImage'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { AxiosError } from 'axios'
import { errorMessage } from '@/utils/responseMessages'

const ProductTypeAdd = () => {
    const navigate = useNavigate()

    const handleSubmit = async (values: any) => {
        const desc = textParser(values.description)
        const footer = textParser(values.footer)
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
            category: values?.category[0]?.id,
            is_active: values?.is_active,
            is_try_and_buy: values?.is_try_and_buy,
            gender: values?.gender || '',
            quick_filter_tags: values?.quick_filter_tags?.join(','),
        }
        const finalBody = filterEmptyValues(body)
        try {
            await axioisInstance.post(`product-type`, finalBody)
            notification.success({ message: 'Product Type Changed Successfully' })
            navigate(-1)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    return (
        <div>
            <div className="text-xl mb-10">ADD PRODUCT TYPE</div>
            <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="">
                        <ProductTypeForm values={values} setFieldValue={setFieldValue} />
                        <FormButton value="Submit" />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ProductTypeAdd
