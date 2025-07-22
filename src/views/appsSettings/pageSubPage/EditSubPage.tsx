/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import Button from '@/components/ui/Button'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { FormItem, Select } from '@/components/ui'
import { pageSettingsService } from '@/store/services/pageSettingService'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import { useNavigate, useParams } from 'react-router-dom'
import { beforeUpload } from '@/common/beforeUpload'
import { handleimage } from '@/common/handleImage'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import PageEditVideo from '../pageSettings/PageEditVideo'

const EditSubPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [pageNamesData, setPageNamesData] = useState<pageNameTypes[] | undefined>([])

    const query = `/subpage?sub_page_id=${id}`
    const { data: subPageData } = useFetchSingleData<any>({ url: query })

    const { data: pageNames, isSuccess: isPageNamesSuccess } = pageSettingsService.usePageNamesQuery({
        page: 1,
        pageSize: 500,
    })

    useEffect(() => {
        if (isPageNamesSuccess) {
            setPageNamesData(pageNames?.data?.results || [])
        }
    }, [pageNames, isPageNamesSuccess])

    const initialValues = {
        name: subPageData?.name || '',
        page: subPageData?.page || (null as pageNameTypes | null),
        display_name: subPageData?.display_name || '',
        position: subPageData?.position || '',
        image: subPageData?.image || '',
        extra_attributes: {
            primary_color: subPageData?.extra_attributes?.primaryColor || '',
            accent_color: subPageData?.extra_attributes?.accentColor || '',
        },
    }

    const handleSubmit = async (values: any) => {
        const imageUpload = values?.image_array ? await handleimage('product', values?.image_array) : ''
        console.log('here')
        const body = {
            name: values.name || '',
            page: values.page?.id || '',
            display_name: values?.display_name || '',
            position: values?.position || '',
            image: imageUpload || '',
            is_active: values?.is_active || false,
            extra_attributes: {
                primaryColor: values?.extra_attributes?.primary_color || '',
                accentColor: values?.extra_attributes?.accent_color || '',
            },
        }

        const filteredBody = Object.fromEntries(Object.entries(body).filter(([, val]) => val !== ''))

        try {
            const response = await axioisInstance.patch(`/subpage/${id}`, filteredBody)
            notification.success({
                message: response?.data?.message || 'Successfully updated sub page',
            })
            // navigate(0)
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to update sub page',
            })
        }
    }

    if (!subPageData) {
        return <div>Loading...</div>
    }

    return (
        <div className="p-6">
            <h5 className="mb-4 text-red-500">Edit Sub Page</h5>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
                {({ setFieldValue, values }) => (
                    <Form className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                        <FormItem label="Name">
                            <Field
                                name="name"
                                type="text"
                                placeholder="Enter Name"
                                className="rounded-xl px-3 py-2 border border-gray-300"
                            />
                        </FormItem>
                        <FormItem label="Display Name">
                            <Field
                                name="display_name"
                                type="text"
                                placeholder="Enter Display Name"
                                className="rounded-xl px-3 py-2 border border-gray-300"
                            />
                        </FormItem>
                        <FormItem label="Position">
                            <Field
                                name="position"
                                type="text"
                                placeholder="Enter Position"
                                className="rounded-xl px-3 py-2 border border-gray-300"
                            />
                        </FormItem>
                        <FormItem label="Primary Color">
                            <Field
                                name="extra_attributes.primary_color"
                                type="text"
                                placeholder="Enter Primary Color"
                                className="rounded-xl px-3 py-2 border border-gray-300"
                            />
                        </FormItem>
                        <FormItem label="Accent Color">
                            <Field
                                name="extra_attributes.accent_color"
                                type="text"
                                placeholder="Enter Accent Color"
                                className="rounded-xl px-3 py-2 border border-gray-300"
                            />
                        </FormItem>

                        <PageEditVideo
                            isImage
                            label="background Mobile Image"
                            rowName={initialValues.image}
                            name="mobile_background_array"
                            beforeVideoUpload={beforeUpload}
                            fileList={values.image_array as any}
                            fieldName="image_array"
                        />
                        <FormItem label="Is Active">
                            <Field
                                name="is_active"
                                type="checkbox"
                                placeholder="Enter Accent Color"
                                className="rounded-xl px-3 py-2 border border-gray-300"
                            />
                        </FormItem>

                        <div>
                            <Select
                                isClearable
                                className="w-full"
                                options={pageNamesData}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                value={values.page}
                                placeholder="Select Page"
                                onChange={(val) => setFieldValue('page', val)}
                            />
                        </div>

                        <div className="flex justify-end mt-10 col-span-full">
                            <Button className="ltr:mr-2 rtl:ml-2" variant="reject" onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="solid">
                                Update
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditSubPage
