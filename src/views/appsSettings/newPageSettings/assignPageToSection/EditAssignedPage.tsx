/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { Button, Checkbox, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { pageSettingsService } from '@/store/services/pageSettingService'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { companyStore } from '@/store/types/companyStore.types'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface valueProps {
    page: any
    sub_page: any
    store: { id: number; name: string }[]
    section?: number
    position: number
    is_active: boolean
}

const EditAssignedPage = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { section_id } = useParams()
    const [pageNamesData, setPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [subPageNamesData, setSubPageNamesData] = useState<pageNameTypes[] | undefined>([])

    const { data: pageNames, isSuccess: isPageNamesSuccess } = pageSettingsService.usePageNamesQuery({
        page: 1,
        pageSize: 100,
    })
    const { data: SubPageNames, isSuccess: isSubPageNamesSuccess } = pageSettingsService.useSubPageNamesQuery({})

    useEffect(() => {
        if (isPageNamesSuccess) {
            setPageNamesData(pageNames?.data?.results || [])
        }
    }, [dispatch, pageNames, isPageNamesSuccess])

    useEffect(() => {
        if (isSubPageNamesSuccess) {
            setSubPageNamesData(SubPageNames?.data || [])
        }
    }, [dispatch, isSubPageNamesSuccess])

    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    const query = useMemo(() => {
        return `/page-sections?section_id=${section_id}`
    }, [section_id])
    const { data } = useFetchApi<any>({ url: query })

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const initialValue = {
        page: data[0]?.page,
        sub_page: data[0]?.sub_page,
        is_active: data[0]?.is_active,
        position: data[0]?.position,
        store: data[0]?.store?.map(({ code, id }: { code: string; id: number }) => ({ code, id })) || [],
    }

    console.log(pageNamesData, subPageNamesData)

    const handleSubmit = async (values: valueProps) => {
        const changedFields: Partial<valueProps> = {}
        if (JSON.stringify(values.page) !== JSON.stringify(initialValue.page)) {
            changedFields.page = values.page
        }

        if (JSON.stringify(values.sub_page) !== JSON.stringify(initialValue.sub_page)) {
            changedFields.sub_page = values.sub_page
        }

        if (JSON.stringify(values.store) !== JSON.stringify(initialValue.store)) {
            changedFields.store = values.store
        }

        if (values.position !== initialValue.position) {
            changedFields.position = values.position
        }

        if (values.is_active !== initialValue.is_active) {
            changedFields.is_active = values.is_active
        }
        if (Object.keys(changedFields).length === 0) {
            notification.info({ message: 'No changes were made' })
            return
        }
        const subPageComparator = typeof changedFields?.sub_page === 'object' ? changedFields?.sub_page?.name : changedFields?.sub_page
        const pageComparator = typeof changedFields?.page === 'object' ? changedFields?.page?.name : changedFields?.page

        const body: any = {
            section: Number(section_id),
        }
        if (changedFields.page !== undefined) {
            body.page = pageNamesData?.find((item) => item?.name === pageComparator)?.id
        }

        if (changedFields.sub_page !== undefined) {
            body.sub_page = subPageNamesData?.find((item) => item?.name === subPageComparator)?.id
        }

        if (changedFields.store !== undefined) {
            body.store = changedFields.store?.map((item) => item?.id) || []
        }

        if (changedFields.position !== undefined) {
            body.position = changedFields.position
        }

        if (changedFields.is_active !== undefined) {
            body.is_active = changedFields.is_active
        }

        try {
            const res = await axioisInstance.patch(`/page-sections/${section_id}`, body)
            notification.success({ message: res?.data?.message || 'Successfully updated' })
            navigate('/app/appSettings/newPageSettings')
        } catch (error) {
            console.error(error)
            if (error instanceof AxiosError) {
                notification.error({ message: 'Failed to update' })
            }
        }
    }
    return (
        <div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ resetForm }) => {
                    return (
                        <Form>
                            <FormContainer>
                                <FormItem label="Store">
                                    <Field name="store">
                                        {({ form, field }: FieldProps) => {
                                            console.log('fields of store', field)
                                            const selectedStores = storeResults.filter((option) =>
                                                field.value?.some((store: any) => store?.id === option.id),
                                            )
                                            return (
                                                <div className="flex flex-col gap-1  xl:items-baseline w-full max-w-md">
                                                    <Select
                                                        isMulti
                                                        className="w-full"
                                                        options={storeResults}
                                                        getOptionLabel={(option) => option.code}
                                                        getOptionValue={(option) => option.id}
                                                        value={selectedStores || null}
                                                        onChange={(newVal) => {
                                                            form.setFieldValue('store', newVal)
                                                        }}
                                                    />
                                                </div>
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                            <FormContainer>
                                <FormItem label="Page">
                                    <Field name="page">
                                        {({ form, field }: FieldProps) => {
                                            console.log(field)

                                            const selectedPage =
                                                typeof field?.value === 'object'
                                                    ? pageNamesData?.find((option) => option.name === field?.value?.name)
                                                    : pageNamesData?.find((option) => option.name === field?.value)
                                            return (
                                                <div className="flex flex-col gap-1  xl:items-baseline w-full max-w-md">
                                                    <Select
                                                        isClearable
                                                        className="w-full"
                                                        options={pageNamesData}
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id}
                                                        value={selectedPage || null}
                                                        onChange={(newVal) => {
                                                            form.setFieldValue('page', newVal)
                                                        }}
                                                    />
                                                </div>
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                            <FormContainer>
                                <FormItem label="Sub Page">
                                    <Field name="sub_page">
                                        {({ form, field }: FieldProps) => {
                                            const selectedPage =
                                                typeof field?.value === 'object'
                                                    ? subPageNamesData?.find((option) => option.name === field?.value?.name)
                                                    : subPageNamesData?.find((option) => option.name === field?.value)
                                            return (
                                                <div className="flex flex-col gap-1  xl:items-baseline w-full max-w-md">
                                                    <Select
                                                        isClearable
                                                        className="w-full"
                                                        options={subPageNamesData}
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id}
                                                        value={selectedPage || null}
                                                        onChange={(newVal) => {
                                                            form.setFieldValue('sub_page', newVal)
                                                        }}
                                                    />
                                                </div>
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>

                            <FormItem label="position">
                                <Field type="number" min="0" name="position" placeholder="Enter Position" component={Input} />
                            </FormItem>
                            <FormItem label="Is Active">
                                <Field type="checkbox" min="0" name="is_active" placeholder="Enter Position" component={Checkbox} />
                            </FormItem>

                            <FormContainer className="flex gap-2 mt-4 items-center justify-end">
                                <FormItem>
                                    <Button variant="reject" type="button" onClick={() => resetForm()}>
                                        clear
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button variant="accept">Assign</Button>
                                </FormItem>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default EditAssignedPage
