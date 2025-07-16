/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import NewPageCommonForms from '../newPageSettingsUtils/NewPageCommonForms'
import { PageSettingsBodyFile } from '../newPageSettingsUtils/usePageSettingsBodyFile'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'

const AddPageSettings = () => {
    const navigate = useNavigate()
    const [filterId, setFilterId] = useState<any>()
    const [barcodeData, setBarcodeData] = useState<any>()

    const handleSubmit = async (values: any) => {
        if (!values?.section_heading) {
            notification.error({ message: 'Please add section heading' })
            return
        }

        console.log('here 0')

        const { componentConfig, backgroundConfig, footerConfig, headerConfig, subHeaderConfig, child_component_config, cta_config } =
            await PageSettingsBodyFile({
                values,
            })
        console.log('here')
        const body = {
            ...values,
            component_config: componentConfig,
            background_config: backgroundConfig,
            footer_config: footerConfig,
            header_config: headerConfig,
            sub_header_config: subHeaderConfig,
            extra_info: Object.fromEntries(
                Object.entries({
                    ...values?.extra_info,
                    is_product_filter: values?.extra_info?.is_product_filter || false,
                    ...(values?.extra_info?.timeout ? { timeout: values?.extra_info?.timeout } : {}),
                    ...(values?.extra_info?.page_size ? { page_size: values?.extra_info?.page_size } : {}),
                    ...(values?.extra_info?.child_data_type && { child_data_type: values?.extra_info?.child_data_type }),
                    ...(values?.extra_info?.is_product_filter ? { is_product_filter: values.extra_info.is_product_filter } : {}),
                    cta_config: cta_config,
                    child_component_config: child_component_config,
                }).filter(([, value]) => value !== ''),
            ),
            banners: [],
            data_type: {
                ...(() => {
                    const { start_date, end_date, validation, ...rest } = values?.data_type || {}
                    console.log(start_date, end_date, validation)
                    return rest
                })(),

                ...(values?.data_type?.type ? { type: values?.data_type?.type } : {}),
                ...(!(values?.data_type?.validation > 0) && values?.data_type?.start_date
                    ? { start_date: values?.data_type?.start_date }
                    : {}),
                ...(!(values?.data_type?.validation > 0) && values?.data_type?.end_date ? { end_date: values?.data_type?.end_date } : {}),
                ...(values?.data_type?.validation > 0 ? { duration: values?.data_type?.validation } : {}),
                ...(Array.isArray(barcodeData)
                    ? { barcodes: barcodeData.join(',') }
                    : values?.data_type?.barcodes
                      ? { barcodes: values?.data_type?.barcodes }
                      : {}),
                filters: [
                    ...(values?.division_select ? [`division_${values.division_select}`] : []),
                    // ...(values?.data_type?.filters ?? []), // remove this after extra info is fixed
                    ...(filterId ? [`filterID_${filterId}`] : []),
                ]
                    .filter(Boolean)
                    .flat(),
            },
        }
        const filteredBody = Object.fromEntries(Object.entries(body || {}).filter(([, value]) => value !== undefined))

        console.log('filtered body', filteredBody)

        try {
            const response = await axioisInstance.post(`/section`, filteredBody)
            notification.success({ message: response?.data?.message || 'successfully updated' })
            navigate(`/app/appSettings/newPageSettings/assignSection`)
        } catch (error) {
            console.error(error)
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || 'failed to add' })
            }
        }
    }
    return (
        <div>
            <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                {({ values, resetForm, setFieldValue }) => {
                    return (
                        <Form>
                            <div className="text-xl mb-2">1. Create New Sections</div>
                            <NewPageCommonForms
                                values={values}
                                setFilterId={setFilterId}
                                filterId={filterId}
                                setBarcodeData={setBarcodeData}
                                setFieldValue={setFieldValue}
                                barcodeData={barcodeData}
                            />

                            <FormContainer className="flex gap-2 items-center justify-end mt-7">
                                <FormItem>
                                    <Button variant="reject" type="button" onClick={() => resetForm()}>
                                        clear
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button variant="accept">Add</Button>
                                </FormItem>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default AddPageSettings
