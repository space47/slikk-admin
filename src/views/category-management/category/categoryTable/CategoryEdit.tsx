/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { textParser } from '@/common/textParser'
import { handleimage } from '@/common/handleImage'
import { filterEmptyValues } from '@/utils/apiBodyUtility'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import CategoryForm from './categoryUtils/CategoryForm'
import { Button } from '@/components/ui'

type FormModel = {
    id: number | undefined
    name: string | undefined
    division: number | undefined
    title: string | undefined
    description: string | undefined
    image: string | undefined
    footer: string | undefined
    quick_filter_tags: string | undefined
    position: number | undefined
    gender: string | undefined
    is_active: boolean | undefined
    create_date: string | undefined
    update_date: string | undefined
    is_try_and_buy: boolean | undefined
    last_updated_by: string | undefined
    image_array: File[]
    division_name: string
}

const CategoryEdit = () => {
    const [categoryData, setCategoryData] = useState<FormModel | null>(null)
    const [initialValue, setInitialValue] = useState<any>()
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axioisInstance.get(`category?id=${id}`)
                const categoryData = response.data?.data[0] || {}
                setCategoryData(categoryData)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [id])

    useEffect(() => {
        if (categoryData) {
            setInitialValue({
                id: categoryData.id,
                name: categoryData.name,
                division: categoryData.division,
                title: categoryData.title,
                description: categoryData.description,
                image: categoryData.image,
                footer: categoryData.footer,
                quick_filter_tags: categoryData.quick_filter_tags,
                position: categoryData.position,
                gender: categoryData.gender,
                is_active: categoryData.is_active,
                create_date: categoryData.create_date,
                update_date: categoryData.update_date,
                division_name: categoryData?.division_name,
                is_try_and_buy: categoryData.is_try_and_buy,
                last_updated_by: categoryData.last_updated_by,
                image_array: [],
            })
        }
    }, [categoryData])

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
            division: Array.isArray(values.division) ? values?.division[0]?.id : values?.division || '',
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
            const response = await axioisInstance.patch('category', finalBody)
            successMessage(response)
            navigate('/app/category/category')
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    if (!categoryData) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h4 className="mb-4">Update Existing Category</h4>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="w-full">
                        <CategoryForm
                            editMode
                            values={values}
                            initialValue={initialValue}
                            setInitialValue={setInitialValue}
                            setFieldValue={setFieldValue}
                        />
                        <div className="flex justify-end mt-4">
                            <Button type="submit" variant="solid" size="sm">
                                Update
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default CategoryEdit
