/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem, Select } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { DatePicker, notification } from 'antd'
import { Moment } from 'moment'
import { Field, FieldProps, Form, Formik } from 'formik'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import { useAppDispatch, useAppSelector } from '@/store'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { pageSettingsService } from '@/store/services/pageSettingService'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { companyStore } from '@/store/types/companyStore.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    bannerIdStore: number[]
    pageState?: string
    subPageState?: string
}

const BulkEditModal = ({ dialogIsOpen, setIsOpen, bannerIdStore, pageState, subPageState }: Props) => {
    const dispatch = useAppDispatch()
    const [dates, setDates] = useState<{ startDate: Moment | null; endDate: Moment | null }>({ startDate: null, endDate: null })
    const onDialogClose = () => {
        setIsOpen(false)
    }
    const [pageNamesData, setPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [subPageNamesData, setSubPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [selectedPageName, setSelectedPageName] = useState<string | undefined>(pageState)
    const [sectionsData, setSectionsData] = useState<any>()

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const { data: pageNames, isSuccess: isPageNamesSuccess } = pageSettingsService.usePageNamesQuery({
        page: 1,
        pageSize: 500,
    })

    const { data: SubPageNames, isSuccess: isSubPageNamesSuccess } = pageSettingsService.useSubPageNamesQuery({
        page: 1,
        pageSize: 500,
        pageName: selectedPageName ? selectedPageName : pageState,
    })

    const query = useMemo(() => {
        return `/page-sections?p=1&page_size=500&page=${selectedPageName}`
    }, [selectedPageName])

    const { data: pageSettingsData } = useFetchApi<any>({ url: query })

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

    useEffect(() => {
        if (pageSettingsData) {
            setSectionsData(pageSettingsData?.map((item) => item?.section))
        }
    }, [pageNames, pageSettingsData])

    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    const initialState = {
        page: pageState || '',
        sub_page: subPageState || '',
        store: [],
        sections: undefined,
        position: 0,
        is_active: false,
    }

    const handleDateChange = (name: string, date: Moment | null) => {
        setDates((prevDates) => ({
            ...prevDates,
            [name]: date,
        }))
    }

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const handleSubmit = async (values: any) => {
        console.log('values are', values)
        const body = {
            banner_ids: bannerIdStore.join(','),
            start_date: dates.startDate ? dates.startDate.format('YYYY-MM-DD HH:mm:ss') : null,
            end_date: dates.endDate ? dates.endDate.format('YYYY-MM-DD HH:mm:ss') : null,
            page: values?.page?.name || '',
            sub_page: values.sub_page,
            section_heading: values?.sections,
            store: values?.store?.map((item: any) => item?.id as number) || [],
        }
        console.log('body is', body)
        try {
            const response = await axioisInstance.post(`/banner/bulk/update`, body)
            notification.success({
                message: response?.data?.message || response?.data?.data?.message || 'Successfully edited banner ids',
            })
        } catch (error) {
            notification.error({
                message: 'Failed to edit bulk banner id',
            })
        } finally {
            setIsOpen(false)
        }
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} width={800} onRequestClose={onDialogClose} onClose={onDialogClose}>
                <Formik enableReinitialize initialValues={initialState as any} onSubmit={handleSubmit}>
                    {({ resetForm }) => {
                        return (
                            <Form className="p-3 rounded-xl shadow-xl">
                                <div className="text-xl mb-2">Bulk Edit Banners</div>
                                <div className="flex flex-col md:flex-row gap-6 mb-6">
                                    <FormItem label="Start Date">
                                        <DatePicker
                                            showTime
                                            placeholder="Select Start Date"
                                            value={dates.startDate}
                                            className="w-full rounded-lg"
                                            onChange={(date) => handleDateChange('startDate', date)}
                                        />
                                    </FormItem>
                                    <FormItem label="End Date">
                                        <DatePicker
                                            showTime
                                            placeholder="Select End Date"
                                            value={dates.endDate}
                                            className="w-full rounded-lg"
                                            onChange={(date) => handleDateChange('endDate', date)}
                                        />
                                    </FormItem>
                                </div>
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
                                                // Determine the current value - handle both array and single object cases
                                                const currentValue = Array.isArray(field?.value)
                                                    ? subPageNamesData?.filter((option) =>
                                                          field.value.some(
                                                              (val: any) => (typeof val === 'object' ? val.name : val) === option.name,
                                                          ),
                                                      )
                                                    : field?.value
                                                      ? [
                                                            subPageNamesData?.find(
                                                                (option) =>
                                                                    (typeof field.value === 'object' ? field.value.name : field.value) ===
                                                                    option.name,
                                                            ),
                                                        ].filter(Boolean)
                                                      : []

                                                return (
                                                    <div className="flex flex-col gap-1 w-full max-w-md">
                                                        <Select
                                                            isMulti
                                                            isClearable
                                                            className="w-full"
                                                            options={subPageNamesData}
                                                            getOptionLabel={(option) => option.name}
                                                            getOptionValue={(option) => option.id}
                                                            value={currentValue}
                                                            onChange={(newVal) => {
                                                                form.setFieldValue(
                                                                    'sub_page',
                                                                    newVal ? newVal.map((item) => item?.name) : [],
                                                                )
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
                                                console.log('field', field?.value)
                                                const selectedSection = sectionsData?.find(
                                                    (option: any) => option?.section_heading === field?.value,
                                                )
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
                                                                console.log('new vsal', newVal)
                                                                form.setFieldValue('sections', newVal?.section_heading)
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                </FormContainer>

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
            </Dialog>
        </div>
    )
}

export default BulkEditModal
