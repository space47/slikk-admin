/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { Form, Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DivisionCommonForm from './divisionUtils/DivisionForm'
import { filterEmptyValues } from '@/utils/apiBodyUtility'
import { textParser } from '@/common/textParser'
import { handleimage } from '@/common/handleImage'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import { DivisionFormModel } from './divisionCommon'
import { Spinner } from '@/components/ui'

const DivisionEdit = () => {
    const [divisionData, setDivisionData] = useState<DivisionFormModel | null>(null)
    const [initialValue, setInitialValue] = useState<any>()
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axioisInstance.get(`division?id=${id}&dashboard=true`)
                const categoryData = response.data?.data[0] || {}
                setDivisionData(categoryData)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [id])

    useEffect(() => {
        if (divisionData) {
            setInitialValue({
                id: divisionData.id,
                name: divisionData.name,
                division: divisionData.division,
                title: divisionData.title,
                description: divisionData.description,
                image: divisionData.image,
                footer: divisionData.footer,
                quick_filter_tags: divisionData.quick_filter_tags,
                position: divisionData.position,
                gender: divisionData.gender,
                is_active: divisionData.is_active,
                create_date: divisionData.create_date,
                update_date: divisionData.update_date,
                is_try_and_buy: divisionData.is_try_and_buy,
                last_updated_by: divisionData.last_updated_by,
                images_array: [],
            })
        }
    }, [divisionData])

    const handleSubmit = async (values: DivisionFormModel) => {
        const desc = textParser(values.description as string) || ''
        const footer = textParser(values.footer as string) || ''
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
            const response = await axioisInstance.patch('division', finalBody)
            successMessage(response)
            navigate('/app/category/division')
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    if (!divisionData) {
        return (
            <div className="flex items-center justify-center mt-4">
                <div className="flex flex-col gap-2 items-center justify-center">
                    <Spinner size={30} />
                    <div>Loading Division Details</div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h4 className="mb-4">Division Edit</h4>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="w-full" onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}>
                        <FormContainer>
                            <DivisionCommonForm
                                editMode
                                setFieldValue={setFieldValue}
                                initialValue={initialValue}
                                setInitialValue={setInitialValue}
                                values={values}
                            />

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

export default DivisionEdit
