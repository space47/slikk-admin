/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { Button, FormContainer, FormItem } from '@/components/ui'
import { pageSettingsType } from '@/store/types/pageSettings.types'
import { Form, Formik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { InitialValuesEdit } from '../newPageSettingsUtils/newpageConstants'
import NewPageCommonForms from '../newPageSettingsUtils/NewPageCommonForms'
import { PageSettingsBodyFile } from '../newPageSettingsUtils/usePageSettingsBodyFile'
import { AxiosError } from 'axios'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useFetchApi } from '@/commonHooks/useFetchApi'

const EditPageSettings = () => {
    const { section_id } = useParams()
    const [filterId, setFilterId] = useState<any>()
    const [barcodeData, setBarcodeData] = useState<any>()
    const location = useLocation()
    const { pageState } = location.state || {}

    const queryParams =
        useMemo(() => {
            if (!section_id) {
                return
            }
            return `/section?section_id=${section_id}`
        }, [section_id]) || ''

    const { data: pageSettingsData } = useFetchSingleData<pageSettingsType>({ url: queryParams })
    const [initialValue, setInitialValue] = useState<pageSettingsType>()

    const query = useMemo(() => {
        let page = ''
        if (pageState) {
            page = pageState
        }
        return `banners?p=1&page_size=1000&page=${page}`
    }, [])

    const { data: bannerDetails } = useFetchApi<any>({ url: query })

    useEffect(() => {
        const bannerData = bannerDetails?.filter((item) => pageSettingsData?.banners?.includes(item.id))
        console.log('banner data', bannerData)
        const editedValues = InitialValuesEdit(pageSettingsData) as pageSettingsType
        const filters = editedValues?.data_type?.filters || []
        const filterId = filters.find((item: string) => item.includes('filterID_'))?.split('_')[1]
        const division = filters.find((item: string) => item.includes('division'))?.split('_')[1]
        setInitialValue({ ...editedValues, division_select: division, banners: bannerData })
        setBarcodeData(editedValues?.data_type?.barcodes)
        setFilterId(filterId)
    }, [pageSettingsData, bannerDetails])

    const handleSubmit = async (values: any) => {
        const { componentConfig, backgroundConfig, footerConfig, headerConfig, subHeaderConfig, child_component_config, cta_config } =
            await PageSettingsBodyFile({
                values,
                initialValue,
            })
        const body = {
            ...values,
            banners: values?.banners?.map((item: any) => item?.id) || [],
            component_config: componentConfig,
            background_config: backgroundConfig,
            footer_config: footerConfig,
            header_config: headerConfig,
            sub_header_config: subHeaderConfig,
            extra_info: Object.fromEntries(
                Object.entries({
                    ...values?.extra_info,
                    ...(values?.extra_info?.timeout ? { timeout: values?.extra_info?.timeout } : {}),
                    ...(values?.extra_info?.page_size ? { page_size: values?.extra_info?.page_size } : {}),
                    ...(values?.extra_info?.child_data_type && { child_data_type: values?.extra_info?.child_data_type }),
                    is_product_filter: values?.extra_info?.is_product_filter || false,
                    cta_config: cta_config,
                    child_component_config: child_component_config,
                }).filter(([, value]) => value !== ''),
            ),
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
                    // ...(values?.data_type?.filters ?? []), // remove this after extra info is fixed
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
                notification.error({ message: error?.response?.data?.message || 'Failed to Edit' })
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
                                bannerDetails={bannerDetails}
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
