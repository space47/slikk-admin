/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductTypeForm from './productTypeUtils/ProductTypeForm'
import FormButton from '@/components/ui/Button/FormButton'
import { filterEmptyValues } from '@/utils/apiBodyUtility'
import { textParser } from '@/common/textParser'
import { handleimage } from '@/common/handleImage'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { errorMessage } from '@/utils/responseMessages'

const ProductTypeEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [productTypeData, setProductTypeData] = useState<any | null>(null)
    const [initialValue, setInitialValue] = useState<any>()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axioisInstance.get(`product-type?id=${id}`)
                const categoryData = response.data?.data[0] || {}
                setProductTypeData(categoryData)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [id])

    useEffect(() => {
        if (productTypeData) {
            setInitialValue({
                id: productTypeData.id || '',
                name: productTypeData.name || '',
                category: productTypeData.category || '',
                division: productTypeData.division || '',
                sub_category: productTypeData?.sub_category || '',
                title: productTypeData.title || '',
                description: productTypeData.description || '',
                image: productTypeData.image || '',
                footer: productTypeData.footer || '',
                quick_filter_tags: productTypeData.quick_filter_tags || [],
                position: productTypeData.position || '',
                gender: productTypeData.gender || '',
                is_active: productTypeData.is_active || false,
                create_date: productTypeData.create_date || '',
                update_date: productTypeData.update_date || '',
                is_try_and_buy: productTypeData.is_try_and_buy || false,
                last_updated_by: productTypeData.last_updated_by || null,
                image_array: [],
            })
        }
    }, [productTypeData])

    const handleSubmit = async (values: any) => {
        const desc = textParser(values.description)
        const footer = textParser(values.footer)
        const imageUpload = values?.image_array?.length
            ? await handleimage('category', values?.image_array)
            : values?.image
              ? values?.image
              : ''
        const body = {
            id: id,
            position: values?.position || '',
            title: values?.title || '',
            description: desc || '',
            footer: footer || '',
            name: values?.name || '',
            image: imageUpload,
            division: values?.division || values?.division[0]?.id,
            category: values?.category || values?.category[0]?.id,
            sub_category: values?.sub_category || values?.sub_category[0]?.id,
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

    if (!productTypeData) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div className="text-xl mb-10">EDIT PRODUCT TYPE</div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="">
                        <ProductTypeForm
                            editMode
                            values={values}
                            initialValue={initialValue}
                            setInitialValue={setInitialValue}
                            setFieldValue={setFieldValue}
                        />
                        <FormButton value="Submit" />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ProductTypeEdit
