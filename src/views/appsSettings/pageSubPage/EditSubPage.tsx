/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import Button from '@/components/ui/Button'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Checkbox, FormItem, Input, Select } from '@/components/ui'
import { pageSettingsService } from '@/store/services/pageSettingService'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import { useNavigate, useParams } from 'react-router-dom'
import { beforeUpload } from '@/common/beforeUpload'
import { handleimage } from '@/common/handleImage'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import PageEditVideo from '../pageSettings/PageEditVideo'
import { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import MultiSelect from '@/common/MultiSelect'
import { Extra_Fields_Subpage } from './pageSubPageUtils/subPageCommon'

const EditSubPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [pageNamesData, setPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
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
        page: pageNamesData?.find((page) => page.id === subPageData?.page) || null,
        display_name: subPageData?.display_name || '',
        position: subPageData?.position || '',
        image: subPageData?.image || '',
        is_active: subPageData?.is_active || false,
        extra_attributes: {
            primary_color: subPageData?.extra_attributes?.primaryColor || '',
            accent_color: subPageData?.extra_attributes?.accentColor || '',
            text_color: subPageData?.extra_attributes?.textColor || '',
            text_color_inactive: subPageData?.extra_attributes?.textColorInactive || '',
            icon_color: subPageData?.extra_attributes?.icon_color || '',
            icon_color_web: subPageData?.extra_attributes?.icon_color_web || '',
            address_header_color_web: subPageData?.extra_attributes?.address_header_color_web || '',
            address_header_color: subPageData?.extra_attributes?.address_header_color || '',
            address_description_color: subPageData?.extra_attributes?.address_description_color || '',
            address_description_color_web: subPageData?.extra_attributes?.address_description_color_web || '',
        },
        store: subPageData?.stores?.map((item: any) => item?.id) || [],
    }

    const handleSubmit = async (values: any) => {
        const imageUpload = values?.image_array?.length > 0 ? await handleimage('product', values?.image_array) : ''
        console.log('here', values)
        const body = {
            name: values.name || '',
            page: values.page?.id || '',
            display_name: values?.display_name || '',
            position: Number(values?.position) || '',
            image: imageUpload || '',
            is_active: values?.is_active || false,
            stores: values?.store || [],
            extra_attributes: {
                primaryColor: values?.extra_attributes?.primary_color || '',
                accentColor: values?.extra_attributes?.accent_color || '',
                textColor: values?.extra_attributes?.text_color || '',
                textColorInactive: values?.extra_attributes?.text_color_inactive || '',
                icon_color: values?.extra_attributes?.icon_color || '',
                icon_color_web: values?.extra_attributes?.icon_color_web || '',
                address_header_color_web: values?.extra_attributes?.address_header_color_web || '',
                address_header_color: values?.extra_attributes?.address_header_color || '',
                address_description_color: values?.extra_attributes?.address_description_color || '',
                address_description_color_web: values?.extra_attributes?.address_description_color_web || '',
            },
        }

        const filteredBody = Object.fromEntries(Object.entries(body).filter(([, val]) => val !== ''))

        try {
            const response = await axioisInstance.patch(`/subpage/${id}`, filteredBody)
            notification.success({
                message: response?.data?.message || 'Successfully updated sub page',
            })
            navigate(-1)
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to update sub page',
            })
        }
    }

    const handleRemove = (setFieldValue: (field: string, value: any) => void) => {
        setFieldValue('image_array', [])
        setFieldValue('image', '')
    }

    if (!subPageData) {
        return <div>Loading...</div>
    }

    return (
        <div className="bg-white p-8 shadow-lg rounded-xl border border-gray-100">
            <h5 className="text-xl font-semibold text-red-500 mb-6">Edit Sub Page</h5>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
                {({ setFieldValue, values }) => (
                    <Form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                            <FormItem label="Name" className="space-y-1">
                                <Field
                                    name="name"
                                    type="text"
                                    placeholder="Enter Name"
                                    className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                                />
                            </FormItem>

                            <FormItem label="Display Name" className="space-y-1">
                                <Field
                                    name="display_name"
                                    type="text"
                                    placeholder="Enter Display Name"
                                    className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                                />
                            </FormItem>

                            <FormItem label="Is Active" className="flex items-center space-x-2">
                                <Field
                                    name="is_active"
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </FormItem>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
                                <Select
                                    isClearable
                                    className="w-full text-sm rounded-lg border-gray-300 focus:border-blue-400 focus:ring-blue-100"
                                    options={pageNamesData}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id?.toString()}
                                    value={values.page}
                                    placeholder="Select Page"
                                    onChange={(val) => setFieldValue('page', val)}
                                />
                            </div>

                            <MultiSelect
                                label="Store Select"
                                name="store"
                                setFieldValue={setFieldValue}
                                customClass="w-full"
                                options={storeList}
                                compareKey="id"
                            />

                            <FormItem label="Position" className="space-y-1">
                                <Field
                                    name="position"
                                    type="text"
                                    placeholder="Enter Position"
                                    className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                                />
                            </FormItem>

                            <FormItem label="Header Background Color" className="space-y-1">
                                <Field
                                    name="extra_attributes.primary_color"
                                    type="text"
                                    placeholder="Enter Header Background  Color"
                                    className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                                />
                            </FormItem>
                            <FormItem label="Text Color" className="space-y-1">
                                <Field
                                    name="extra_attributes.text_color"
                                    type="text"
                                    placeholder="Enter Text Color"
                                    className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                                />
                            </FormItem>

                            <FormItem label="Text Color Inactive">
                                <Field
                                    name="extra_attributes.text_color_inactive"
                                    type="text"
                                    placeholder="Enter Text Color Inactive"
                                    className="rounded-xl px-3 py-2 w-full border border-gray-300"
                                />
                            </FormItem>

                            <FormItem label="Selected Background Color" className="space-y-1">
                                <Field
                                    name="extra_attributes.accent_color"
                                    type="text"
                                    placeholder="Enter Selected Background Color"
                                    className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                                />
                            </FormItem>

                            {Extra_Fields_Subpage?.map((item, key) => {
                                return (
                                    <FormItem label={item?.label} className="space-y-1" key={key}>
                                        <Field
                                            name={item?.name}
                                            type={item?.type}
                                            placeholder={`Enter ${item?.label}`}
                                            component={item?.type === 'checkbox' ? Checkbox : Input}
                                            className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                                        />
                                    </FormItem>
                                )
                            })}

                            <div className="space-y-1">
                                <PageEditVideo
                                    isImage
                                    label="Image"
                                    rowName={values.image}
                                    name="image_array"
                                    handleRemoveVideo={() => handleRemove(setFieldValue)}
                                    beforeVideoUpload={beforeUpload}
                                    fileList={values?.image_array as any}
                                    fieldName="image_array"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                            <Button
                                variant="reject"
                                onClick={() => navigate(-1)}
                                className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="solid"
                                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-100 transition"
                            >
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
