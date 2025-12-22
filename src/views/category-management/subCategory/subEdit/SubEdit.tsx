/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import SubCategoryForm from '../subCategoryUtils/SubCategoryForm'
import FormButton from '@/components/ui/Button/FormButton'
import { textParser } from '@/common/textParser'
import { handleimage } from '@/common/handleImage'
import { filterEmptyValues } from '@/utils/apiBodyUtility'
import { AxiosError } from 'axios'
import { errorMessage } from '@/utils/responseMessages'

const SubEdit = () => {
    const { id } = useParams()
    const [sub_category_data, setSubCategoryData] = useState<any | null>(null)
    const [initialValue, setInitialValue] = useState<any>()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axioisInstance.get(`sub-category?id=${id}`)
                const subCategoryData = response.data?.data[0] || {}
                setSubCategoryData(subCategoryData)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [id])

    useEffect(() => {
        if (sub_category_data) {
            setInitialValue({
                id: sub_category_data.id || '',
                name: sub_category_data.name || '',
                category: sub_category_data.category || '',
                division: sub_category_data.division || '',
                title: sub_category_data.title || '',
                description: sub_category_data.description || '',
                image: sub_category_data.image || '',
                footer: sub_category_data.footer || '',
                quick_filter_tags: sub_category_data.quick_filter_tags || [],
                position: sub_category_data.position || '',
                gender: sub_category_data.gender || '',
                is_active: sub_category_data.is_active || false,
                create_date: sub_category_data.create_date || '',
                update_date: sub_category_data.update_date || '',
                is_try_and_buy: sub_category_data.is_try_and_buy || false,
                last_updated_by: sub_category_data.last_updated_by || null,
                image_array: [],
            })
        }
    }, [sub_category_data])

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
            category: values?.category || values?.category[0]?.id || '',
            is_active: values?.is_active,
            is_try_and_buy: values?.is_try_and_buy,
            gender: values?.gender || '',
            quick_filter_tags: values?.quick_filter_tags?.join(','),
        }
        const finalBody = filterEmptyValues(body)
        try {
            await axioisInstance.patch(`sub-category`, finalBody)
            notification.success({ message: 'Sub-Category Changed Successfully' })
            navigate(-1)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    if (!sub_category_data) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div className="text-xl mb-10">Edit SubCategory</div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="">
                        <SubCategoryForm
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

export default SubEdit
