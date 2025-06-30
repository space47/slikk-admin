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
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface RequiredSections {
    id: number
    display_name: string
    section_heading: string
}

interface valueProps {
    page: number
    sub_page: number
    store: number[]
    section?: number
    position: number
    is_active: boolean
}

const AssignPageSection = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [pageNamesData, setPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [subPageNamesData, setSubPageNamesData] = useState<pageNameTypes[] | undefined>([])

    const { data: sectionsData } = useFetchApi<RequiredSections>({ url: `/section` })

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

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const handleSubmit = async (values: valueProps) => {
        const body = {
            page: values?.page,
            sub_page: values?.sub_page,
            store: values?.store,
            section: values?.section,
            position: values?.position,
            is_active: values?.is_active,
        }

        console.log('body is', body)

        try {
            // const res = await axioisInstance.post(`/page-sections`,body)
            // notification.success({message: res?.data?.message ||  'Successfully assigned'})
            // navigate('/app/appSettings/newPageSettings')
        } catch (error) {
            console.error(error)
            if (error instanceof AxiosError) {
                notification.error({ message: 'Failed to assign' })
            }
        }
    }
    return (
        <div>
            <Formik enableReinitialize initialValues={{} as valueProps} onSubmit={handleSubmit}>
                {({ resetForm }) => {
                    return (
                        <Form className="p-3 rounded-xl shadow-xl ">
                            <div className="text-xl mb-2">2. Assign Sections</div>
                            <FormContainer>
                                <FormItem label="Store">
                                    <Field name="store">
                                        {({ form, field }: FieldProps) => {
                                            const selectedStores = storeResults.filter((option) =>
                                                field.value?.some((store: any) => store.code === option.code),
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
                                                            const selectedStoreValues = newVal ? newVal?.map((item) => item?.id) : []
                                                            form.setFieldValue('store', selectedStoreValues)
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
                                            console.log('field is', field)
                                            const selectedPage = pageNamesData?.find((option) => option.name === field?.value?.name)
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
                                                            form.setFieldValue('page', newVal?.id)
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
                                            const selectedPage = subPageNamesData?.find((option) => option.name === field?.value?.name)
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
                                                            // const dataValues = newVal
                                                            console.log('newVal is subPage', newVal)
                                                            form.setFieldValue('sub_page', newVal?.id)
                                                        }}
                                                    />
                                                </div>
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>

                            <FormContainer>
                                <FormItem label="Sections">
                                    <Field name="sections">
                                        {({ form, field }: FieldProps) => {
                                            console.log('section heading', field)
                                            const selectedPage = sectionsData?.find(
                                                (option) => option.section_heading === field?.value?.section_heading,
                                            )
                                            return (
                                                <div className="flex flex-col gap-1  xl:items-baseline w-full max-w-md">
                                                    <Select
                                                        isClearable
                                                        className="w-full"
                                                        options={sectionsData}
                                                        getOptionLabel={(option) => option.section_heading}
                                                        getOptionValue={(option) => option.id}
                                                        value={selectedPage || null}
                                                        onChange={(newVal) => {
                                                            // const dataValues = newVal
                                                            console.log('newVal is', newVal)
                                                            form.setFieldValue('sections', newVal?.id)
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

export default AssignPageSection
