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
import { useLocation, useNavigate } from 'react-router-dom'
import TagsEdit from '../../pageSettings/TagsEdit'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'

interface RequiredSections {
    id: number
    display_name: string
    section_heading: string
}

interface valueProps {
    page: any
    sub_page: any
    store: { id: number; name: string }[]
    sections?: number
    position: number
    is_active: boolean
    is_section_clickable?: boolean
    section_filters: string[]
}

const AssignPageSection = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { pageState, subPageState, storeState } = location.state || {}
    const [pageNamesData, setPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [subPageNamesData, setSubPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [selectedPageName, setSelectedPageName] = useState<string | undefined>(undefined)

    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const { data: sectionsData } = useFetchApi<RequiredSections>({ url: `/section` })

    const { data: pageNames, isSuccess: isPageNamesSuccess } = pageSettingsService.usePageNamesQuery({
        page: 1,
        pageSize: 500,
    })

    const { data: SubPageNames, isSuccess: isSubPageNamesSuccess } = pageSettingsService.useSubPageNamesQuery({
        page: 1,
        pageSize: 500,
        pageName: selectedPageName ? selectedPageName : pageState,
    })

    useEffect(() => {
        if (isPageNamesSuccess) {
            setPageNamesData(pageNames?.data?.results || [])
        }
    }, [pageNames, isPageNamesSuccess])

    useEffect(() => {
        if (isSubPageNamesSuccess) {
            setSubPageNamesData(SubPageNames?.data || [])
        }
    }, [isSubPageNamesSuccess, SubPageNames])

    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    const initialState = {
        page: pageState || '',
        sub_page: subPageState || '',
        store: storeState || [],
        sections: undefined,
        position: 0,
        is_active: false,
    }

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const handleSubmit = async (values: valueProps) => {
        const subPageComparator = typeof values?.sub_page === 'object' ? values?.sub_page?.name : values?.sub_page
        const pageComparator = typeof values?.page === 'object' ? values?.page?.name : values?.page

        const body = {
            page: pageNamesData?.find((item) => item?.name === pageComparator)?.id,
            sub_page: subPageNamesData?.find((item) => item?.name === subPageComparator)?.id,
            store: values?.store?.map((item) => item?.id) || [],
            section: values?.sections,
            position: values?.position,
            is_active: values?.is_active ?? false,
            is_section_clickable: values?.is_section_clickable || false,
            section_filters: values?.section_filters || [],
        }

        console.log('body is', body)

        try {
            const res = await axioisInstance.post(`/page-sections`, body)
            notification.success({ message: res?.data?.message || 'Successfully assigned' })
            navigate('/app/appSettings/newPageSettings')
        } catch (error) {
            console.error(error)
            if (error instanceof AxiosError) {
                notification.error({ message: 'Failed to assign' })
            }
        }
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={initialState as valueProps} onSubmit={handleSubmit}>
                {({ resetForm, values }) => {
                    return (
                        <Form className="p-3 rounded-xl shadow-xl">
                            <div className="text-xl mb-2">2. Assign Sections</div>

                            <FormContainer>
                                <FormItem label="Store">
                                    <Field name="store">
                                        {({ form, field }: FieldProps) => {
                                            const selectedStores = storeResults.filter((option) =>
                                                field.value?.some((store: any) => store?.id === option.id),
                                            )
                                            return (
                                                <div className="flex flex-col gap-1 w-full max-w-md">
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
                                            const selectedPage =
                                                typeof field?.value === 'object'
                                                    ? pageNamesData?.find((option) => option.name === field?.value?.name)
                                                    : pageNamesData?.find((option) => option.name === field?.value)
                                            return (
                                                <div className="flex flex-col gap-1 w-full max-w-md">
                                                    <Select
                                                        isClearable
                                                        className="w-full"
                                                        options={pageNamesData}
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id}
                                                        value={selectedPage || null}
                                                        onChange={(newVal) => {
                                                            form.setFieldValue('page', newVal)
                                                            const name = typeof newVal === 'object' ? newVal?.name : newVal
                                                            setSelectedPageName(name)
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
                                            const selectedSubPage =
                                                typeof field?.value === 'object'
                                                    ? subPageNamesData?.find((option) => option.name === field?.value?.name)
                                                    : subPageNamesData?.find((option) => option.name === field?.value)
                                            return (
                                                <div className="flex flex-col gap-1 w-full max-w-md">
                                                    <Select
                                                        isClearable
                                                        className="w-full"
                                                        options={subPageNamesData}
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id}
                                                        value={selectedSubPage || null}
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

                            <FormContainer>
                                <FormItem label="Sections">
                                    <Field name="sections">
                                        {({ form, field }: FieldProps) => {
                                            const selectedSection = sectionsData?.find((option) => option?.id === field?.value)
                                            return (
                                                <div className="flex flex-col gap-1 w-full max-w-md">
                                                    <Select
                                                        isClearable
                                                        className="w-full"
                                                        options={sectionsData}
                                                        getOptionLabel={(option) => option.section_heading}
                                                        getOptionValue={(option) => option.id}
                                                        value={selectedSection || null}
                                                        onChange={(newVal) => {
                                                            form.setFieldValue('sections', newVal?.id)
                                                        }}
                                                    />
                                                </div>
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>

                            <FormItem label="Section Clickable">
                                <Field type="checkbox" name="is_section_clickable" component={Checkbox} />
                            </FormItem>

                            {values?.is_section_clickable && <TagsEdit isValue filterOptions={filters.filters} />}

                            <FormItem label="Position">
                                <Field type="number" min="0" name="position" placeholder="Enter Position" component={Input} />
                            </FormItem>

                            <FormItem label="Is Active">
                                <Field type="checkbox" name="is_active" component={Checkbox} />
                            </FormItem>

                            <FormContainer className="flex gap-2 mt-4 items-center justify-end">
                                <FormItem>
                                    <Button variant="reject" type="button" onClick={() => resetForm()}>
                                        Clear
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button variant="accept" type="submit">
                                        Assign
                                    </Button>
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
