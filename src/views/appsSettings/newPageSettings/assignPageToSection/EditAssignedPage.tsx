/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { pageSettingsService } from '@/store/services/pageSettingService'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { companyStore } from '@/store/types/companyStore.types'
import { FILTER_STATE } from '@/store/types/filters.types'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TagsEdit from '../../pageSettings/TagsEdit'
import CommonFilterSelect from '@/common/ComonFilterSelect'
import CommonSelect from '../../pageSettings/CommonSelect'
import { SortArrays } from '../newPageSettingsUtils/newPageCommons'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'

interface valueProps {
    page: any
    sub_page: any
    store: { id: number; name: string }[]
    section?: number
    position: number
    is_active: boolean
    is_section_clickable?: boolean
    section_filters?: string[]
    sort?: string
}

const EditAssignedPage = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { section_id } = useParams()

    const [pageNamesData, setPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [subPageNamesData, setSubPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [selectedPageName, setSelectedPageName] = useState<string | undefined>(undefined)
    const [filterId, setFilterId] = useState('')

    const { data: pageNames, isSuccess: isPageNamesSuccess } = pageSettingsService.usePageNamesQuery({
        page: 1,
        pageSize: 500,
    })

    const { data: SubPageNames, isSuccess: isSubPageNamesSuccess } = pageSettingsService.useSubPageNamesQuery({
        pageName: selectedPageName ?? '',
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
    }, [SubPageNames, isSubPageNamesSuccess])

    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    const query = useMemo(() => `/page-sections?page_section_id=${section_id}`, [section_id])
    const { data } = useFetchSingleData<any>({ url: query })

    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    useEffect(() => {
        if (data && data?.page) {
            const initialPage = data?.page
            const pageName = typeof initialPage === 'object' ? initialPage.name : initialPage
            setSelectedPageName(pageName)
        }
    }, [data])

    const initialValue = {
        page: data?.page,
        sub_page: data?.sub_page,
        is_active: data?.is_active,
        position: data?.position,
        store: data?.store?.map(({ code, id }: { code: string; id: number }) => ({ code, id })) || [],
        is_section_clickable: data?.is_section_clickable,
    }

    const handleSubmit = async (values: valueProps) => {
        const subPageComparator = typeof values?.sub_page === 'object' ? values?.sub_page?.name : values?.sub_page
        const pageComparator = typeof values?.page === 'object' ? values?.page?.name : values?.page

        const body = {
            page: pageNamesData?.find((item) => item?.name === pageComparator)?.id,
            sub_page: subPageNamesData?.find((item) => item?.name === subPageComparator)?.id,
            store: values?.store?.map((item) => item?.id),
            section: Number(section_id),
            position: values?.position,
            is_active: values?.is_active ?? false,
            is_section_clickable: values?.is_section_clickable || false,
            section_filters: [
                ...(values?.section_filters ? values.section_filters : []),
                values?.sort ? `sort_${values?.sort}` : [],
                filterId ? `filterId_${filterId}` : [],
            ],
        }
        try {
            const res = await axioisInstance.patch(`/page-sections/${section_id}`, body)
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
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ resetForm, values }) => (
                    <Form>
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

                        <FormItem label="Section Clickable">
                            <Field type="checkbox" name="is_section_clickable" component={Checkbox} />
                        </FormItem>

                        {values?.is_section_clickable && (
                            <>
                                <TagsEdit isValue filterOptions={filters.filters} />
                                <div className="mb-4">
                                    <CommonFilterSelect isEdit filterId={filterId} setFilterId={setFilterId} />
                                </div>
                                {/* sort_hightolow */}

                                <CommonSelect label="Sort By" name="sort" options={SortArrays} />
                            </>
                        )}

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
                )}
            </Formik>
        </div>
    )
}

export default EditAssignedPage
