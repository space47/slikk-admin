/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { Button, FormContainer, FormItem } from '@/components/ui'
import { pageSettingsType } from '@/store/types/pageSettings.types'
import { Form, Formik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { InitialValuesEdit } from '../newPageSettingsUtils/newpageConstants'
import NewPageCommonForms from '../newPageSettingsUtils/NewPageCommonForms'
import { PageSettingsBodyFile } from '../newPageSettingsUtils/usePageSettingsBodyFile'
import { AxiosError } from 'axios'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

const EditPageSettings = () => {
    const { section_id } = useParams()
    const [filterId, setFilterId] = useState<any>()
    const [barcodeData, setBarcodeData] = useState<any>()

    const queryParams =
        useMemo(() => {
            if (!section_id) {
                return
            }
            return `/section?section_id=${section_id}`
        }, [section_id]) || ''

    const { data: pageSettingsData } = useFetchSingleData<pageSettingsType>({ url: queryParams })
    const [initialValue, setInitialValue] = useState<pageSettingsType>()

    useEffect(() => {
        setInitialValue(InitialValuesEdit(pageSettingsData) as pageSettingsType)
        // setFilterId(initialValue?.extra_attributes?.filterIdToFetch)
        setBarcodeData(initialValue?.data_type?.barcodes)
    }, [pageSettingsData])

    const handleSubmit = async (values: any) => {
        console.log('values are ', values)
        const { componentConfig, backgroundConfig, footerConfig, headerConfig, subHeaderConfig, child_component_config, cta_config } =
            await PageSettingsBodyFile({
                values,
                initialValue,
            })
        const body = {
            ...values,
            component_config: componentConfig,
            background_config: backgroundConfig,
            footer_config: footerConfig,
            header_config: headerConfig,
            sub_header_config: subHeaderConfig,
            extra_attributes: Object.fromEntries(
                Object.entries({
                    ...values?.extra_info,
                    ...(values?.extra_info?.timeout ? { timeout: values?.extra_info?.timeout } : {}),
                    ...(values?.extra_info?.page_size ? { page_size: values?.extra_info?.page_size } : {}),
                    ...(values?.extra_info?.child_data_type && { child_data_type: values?.extra_info?.child_data_type }),
                    cta_config: cta_config,
                    filterIdToFetch: filterId,
                    child_component_config: child_component_config,
                }).filter(([, value]) => value !== ''),
            ),
            banners: [],
            data_type: {
                ...(() => {
                    const { start_date, end_date, validation, ...rest } = values?.data_type || {}
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
                    ...(values?.data_type?.filters ?? []), // remove this after extra info is fixed
                    ...(filterId ? [`filterID_${filterId}`] : []),
                ]
                    .filter(Boolean)
                    .flat(),
            },
        }
        const filteredBody = Object.fromEntries(Object.entries(body || {}).filter(([_, value]) => value !== undefined))

        try {
            const response = await axioisInstance.patch(`/section/${section_id}`, filteredBody)
            notification.success({ message: response?.data?.message || 'successfully updated' })
        } catch (error) {
            console.error(error)
            if (error instanceof AxiosError) {
                notification.error({ message: error?.message || 'failed to add' })
            }
        }
    }
    return (
        <div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, resetForm, setFieldValue }) => {
                    return (
                        <Form>
                            <NewPageCommonForms
                                isEdit
                                values={values}
                                initialValue={initialValue as pageSettingsType}
                                setInitialValue={setInitialValue}
                                setFilterId={setFilterId}
                                filterId={filterId}
                                setBarcodeData={setBarcodeData}
                                setFieldValue={setFieldValue}
                                barcodeData={barcodeData}
                            />
                            <FormContainer className="flex gap-2 mt-4 items-center justify-end">
                                <FormItem>
                                    <Button variant="reject" type="button" onClick={() => resetForm()}>
                                        clear
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button variant="accept">Edit</Button>
                                </FormItem>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default EditPageSettings
