/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem, Select } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Field, FieldProps, Form, Formik } from 'formik'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import { useAppDispatch } from '@/store'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { pageSettingsService } from '@/store/services/pageSettingService'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { AxiosError } from 'axios'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { notification } from 'antd'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    bannerIdStore: number[]
    pageState?: string
    subPageState?: string
}

const BulkDuplicate = ({ dialogIsOpen, setIsOpen, bannerIdStore, pageState, subPageState }: Props) => {
    const dispatch = useAppDispatch()
    const onDialogClose = () => {
        setIsOpen(false)
    }
    const [pageNamesData, setPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [subPageNamesData, setSubPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [selectedPageName, setSelectedPageName] = useState<string | undefined>(pageState)
    const [selectedSubPageName, setSelectedSubPageName] = useState<string | undefined>('')
    const [statusMap, setStatusMap] = useState<Record<number, 'pending' | 'success' | 'failed'>>({})
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
        let subPageData = ''
        if (selectedSubPageName) {
            subPageData = `&sub_page=${selectedSubPageName}`
        }
        return `/page-sections?p=1&page_size=500&page=${selectedPageName}${subPageData}`
    }, [selectedPageName, selectedSubPageName])

    const { data: pageSettingsData } = useFetchApi<any>({ url: query })

    useEffect(() => {
        if (bannerIdStore?.length) {
            const initialStatus: Record<number, 'pending'> = {}
            bannerIdStore.forEach((id) => {
                initialStatus[id] = 'pending'
            })
            setStatusMap(initialStatus)
        }
    }, [bannerIdStore, dialogIsOpen])

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

    const initialState = {
        page: pageState || '',
        sub_page: subPageState || '',
        store: [],
        sections: undefined,
        position: 0,
        is_active: false,
    }

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    console.log('hello world', bannerIdStore)

    const handleSubmit = async (values: any) => {
        if (!bannerIdStore?.length) {
            notification.error({ message: 'No banners selected' })
            return
        }

        try {
            const pageName = typeof values.page === 'object' ? values.page?.name : values.page

            const subPageIds = subPageNamesData?.filter((item) => values?.sub_page?.includes(item?.name))?.map((item) => item?.id) || []

            const sectionHeading = values?.sections || ''

            if (!sectionHeading) {
                notification.error({ message: 'Section is required' })
                return
            }

            const results = await Promise.allSettled(
                bannerIdStore.map(async (id) => {
                    try {
                        const res = await axioisInstance.get(`banners?banner_id=${id}`)
                        const data = res?.data?.data

                        if (!data) throw new Error(`No data found for banner ${id}`)
                        const body: any = {
                            ...data,
                            page: pageName,
                            sub_page: subPageIds,
                            section_heading: sectionHeading,
                        }

                        delete body.id
                        const duplicateRes = await axioisInstance.post(`/banners`, body)
                        setStatusMap((prev) => ({ ...prev, [id]: 'success' }))
                        successMessage(duplicateRes)
                    } catch (err) {
                        setStatusMap((prev) => ({ ...prev, [id]: 'failed' }))
                        if (err instanceof AxiosError) errorMessage(err)
                    }
                }),
            )

            const successList: number[] = []
            const failedList: { id: number; error: any }[] = []

            results.forEach((result: any) => {
                if (result.status === 'fulfilled') {
                    if (result.value.status === 'success') {
                        successList.push(result.value.id)
                    } else {
                        failedList.push({
                            id: result.value.id,
                            error: result.value.error,
                        })
                    }
                } else {
                    failedList.push({
                        id: -1,
                        error: result.reason,
                    })
                }
            })

            if (successList.length) {
                notification.success({ message: `${successList.length} banners duplicated successfully` })
            }
            if (failedList.length) {
                notification.error({ message: `${failedList.length} banners failed to duplicate` })
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} width={900} onRequestClose={onDialogClose} onClose={onDialogClose} height={'90vh'}>
                <div className="mb-5">
                    <h2 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent">
                        Bulk Duplicate Banners
                    </h2>
                    <div className="h-[2px] w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-1"></div>
                </div>
                <Formik enableReinitialize initialValues={initialState as any} onSubmit={handleSubmit}>
                    {({ resetForm }) => {
                        return (
                            <Form className="p-5 rounded-2xl bg-white h-[80vh] overflow-scroll border border-gray-100">
                                <FormContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormItem label="Page" className="font-medium">
                                        <Field name="page">
                                            {({ form, field }: FieldProps) => {
                                                const selectedPage =
                                                    typeof field?.value === 'object'
                                                        ? pageNamesData?.find((option) => option.name === field?.value?.name)
                                                        : pageNamesData?.find((option) => option.name === field?.value)

                                                return (
                                                    <Select
                                                        isClearable
                                                        className="w-full"
                                                        classNamePrefix="react-select"
                                                        styles={{
                                                            control: (base) => ({
                                                                ...base,
                                                                borderRadius: '12px',
                                                                padding: '2px',
                                                                borderColor: '#e5e7eb',
                                                                boxShadow: 'none',
                                                            }),
                                                        }}
                                                        options={pageNamesData}
                                                        getOptionLabel={(option) => option.name}
                                                        getOptionValue={(option) => option.id?.toString()}
                                                        value={selectedPage || null}
                                                        onChange={(newVal) => {
                                                            form.setFieldValue('page', newVal)
                                                            const name = typeof newVal === 'object' ? newVal?.name : newVal
                                                            setSelectedPageName(name)
                                                        }}
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>

                                    {/* Sub Page */}
                                    <FormItem label="Sub Page" className="font-medium">
                                        <Field name="sub_page">
                                            {({ form, field }: FieldProps) => {
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
                                                    <Select
                                                        isMulti
                                                        isClearable
                                                        className="w-full"
                                                        styles={{
                                                            control: (base) => ({
                                                                ...base,
                                                                borderRadius: '12px',
                                                                padding: '2px',
                                                                borderColor: '#e5e7eb',
                                                                boxShadow: 'none',
                                                            }),
                                                        }}
                                                        options={subPageNamesData}
                                                        getOptionLabel={(option) => option?.name || ''}
                                                        getOptionValue={(option) => option?.id?.toString() || ''}
                                                        value={currentValue}
                                                        onChange={(newVal) => {
                                                            form.setFieldValue('sub_page', newVal ? newVal.map((item) => item?.name) : [])
                                                            setSelectedSubPageName(newVal.map((item) => item?.name)[0])
                                                        }}
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                    <FormItem label="Sections" className="font-medium">
                                        <Field name="sections">
                                            {({ form, field }: FieldProps) => {
                                                const selectedSection = sectionsData?.find(
                                                    (option: any) => option?.section_heading === field?.value,
                                                )

                                                return (
                                                    <Select
                                                        isClearable
                                                        className="w-full"
                                                        styles={{
                                                            control: (base) => ({
                                                                ...base,
                                                                borderRadius: '12px',
                                                                padding: '2px',
                                                                borderColor: '#e5e7eb',
                                                                boxShadow: 'none',
                                                            }),
                                                        }}
                                                        options={sectionsData}
                                                        getOptionLabel={(option) => option.section_heading}
                                                        getOptionValue={(option) => option.id}
                                                        value={selectedSection || null}
                                                        onChange={(newVal) => {
                                                            form.setFieldValue('sections', newVal?.section_heading)
                                                        }}
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>
                                </FormContainer>
                                <div className="mt-8">
                                    <div className="text-lg font-semibold mb-3">Banner Status</div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto pr-2">
                                        {bannerIdStore?.map((id) => {
                                            const status = statusMap[id]

                                            return (
                                                <div
                                                    key={id}
                                                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 hover:shadow-md
                            ${
                                status === 'success'
                                    ? 'bg-green-50 border-green-200'
                                    : status === 'failed'
                                      ? 'bg-red-50 border-red-200'
                                      : 'bg-gray-50 border-gray-200'
                            }`}
                                                >
                                                    <span className="font-medium text-sm tracking-wide">ID: {id}</span>

                                                    <span className="flex items-center gap-2">
                                                        {status === 'success' && (
                                                            <FaCheckCircle className="text-green-500 text-lg animate-pulse" />
                                                        )}
                                                        {status === 'failed' && (
                                                            <FaTimesCircle className="text-red-500 text-lg animate-pulse" />
                                                        )}
                                                        {status === 'pending' && (
                                                            <span className="text-gray-400 text-xs font-medium">Pending...</span>
                                                        )}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6 justify-end border-t pt-4">
                                    <Button
                                        variant="reject"
                                        type="button"
                                        className="rounded-xl px-5 py-2 hover:scale-105 transition"
                                        onClick={() => resetForm()}
                                    >
                                        Clear
                                    </Button>

                                    <Button
                                        variant="accept"
                                        type="submit"
                                        className="rounded-xl px-6 py-2 shadow-md hover:shadow-lg hover:scale-105 transition"
                                    >
                                        Assign
                                    </Button>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </Dialog>
        </div>
    )
}

export default BulkDuplicate
