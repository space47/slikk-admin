/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { FormItem, Select } from '@/components/ui'
import { pageSettingsService } from '@/store/services/pageSettingService'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import { useNavigate } from 'react-router-dom'
import PageAddVideo from '../../pageSettings/PageAddVideo'
import { beforeUpload } from '@/common/beforeUpload'
import { handleimage } from '@/common/handleImage'
import MultiSelect from '@/common/MultiSelect'
import store, { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
}

const AddSubPageNameModal = ({ dialogIsOpen, setIsOpen }: Props) => {
    const [pageNamesData, setPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const navigate = useNavigate()

    const { data: pageNames, isSuccess: isPageNamesSuccess } = pageSettingsService.usePageNamesQuery({
        page: 1,
        pageSize: 500,
    })

    useEffect(() => {
        if (isPageNamesSuccess) {
            setPageNamesData(pageNames?.data?.results || [])
        }
    }, [pageNames, isPageNamesSuccess])

    const onDialogClose = (e?: any) => {
        console.log(e)
        setIsOpen(false)
    }

    const initialValues: any = {
        name: '',
        page: null as pageNameTypes | null,
    }

    const handleSubmit = async (values: any) => {
        const imageUpload = values?.image_array?.length > 0 ? await handleimage('product', values?.image_array) : ''

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
            },
        }

        const filteredBody = Object.fromEntries(Object.entries(body).filter(([, val]) => val !== ''))

        try {
            const response = await axioisInstance.post(`/subpage`, filteredBody)
            notification.success({
                message: response?.data?.message || 'Successfully added a new sub page',
            })
            navigate(0)
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to add new sub page',
            })
        } finally {
            setIsOpen(false)
        }
    }

    return (
        <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} width={1200} height={'80vh'}>
            <h5 className="mb-4 text-red-500">Add New Sub Page</h5>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ setFieldValue, values }) => (
                    <Form className="grid grid-cols-2 xl:grid-cols-2 gap-2 max-h-[70vh] overflow-y-auto ">
                        <FormItem label="Name">
                            <Field
                                name="name"
                                type="text"
                                placeholder="Enter Name"
                                className="rounded-xl px-3 py-2 w-full border border-gray-300"
                            />
                        </FormItem>
                        <FormItem label="Display Name">
                            <Field
                                name="display_name"
                                type="text"
                                placeholder="Enter Display Name"
                                className="rounded-xl px-3 py-2 w-full border border-gray-300"
                            />
                        </FormItem>
                        <FormItem label="Position">
                            <Field
                                name="position"
                                type="text"
                                placeholder="Enter Position"
                                className="rounded-xl px-3 py-2 w-full border border-gray-300"
                            />
                        </FormItem>
                        <FormItem label="Header Background Color">
                            <Field
                                name="extra_attributes.primary_color"
                                type="text"
                                placeholder="Enter Header Background Color"
                                className="rounded-xl px-3 py-2 w-full border border-gray-300"
                            />
                        </FormItem>
                        <FormItem label="Text Color">
                            <Field
                                name="extra_attributes.text_color"
                                type="text"
                                placeholder="Enter Text Color"
                                className="rounded-xl px-3 py-2 w-full border border-gray-300"
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
                        <FormItem label="Selected Background Color">
                            <Field
                                name="extra_attributes.accent_color"
                                type="text"
                                placeholder="Selected Background Color"
                                className="rounded-xl px-3 py-2 w-full border border-gray-300"
                            />
                        </FormItem>

                        <MultiSelect
                            label="Store Select"
                            name="store"
                            setFieldValue={setFieldValue}
                            customClass="w-full"
                            options={storeList}
                            compareKey="id"
                        />

                        <div>
                            <div className="font-semibold"> Select Page</div>
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

                        <PageAddVideo
                            label="Image"
                            name="image_array"
                            fieldName="image_array"
                            fileList={values.image_array}
                            beforeUpload={beforeUpload}
                        />

                        <FormItem label="Is Active">
                            <Field
                                name="is_active"
                                type="checkbox"
                                placeholder="Enter Accent Color"
                                className="rounded-xl px-3 py-2 border border-gray-300"
                            />
                        </FormItem>

                        <div className="flex justify-start mt-10 gap-6">
                            <Button className="" variant="reject" onClick={onDialogClose}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="solid">
                                Add
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default AddSubPageNameModal
