/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { AiOutlineCopy } from 'react-icons/ai'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { URLARRAY, initialValueForUrl } from './urlShortner.common'
import { MAXMINARRAY, OFFARRAY, UtmArray } from '../groupNotification/sendNotification/sendNotify.common'
import FilterSelect, { targetPageArray } from './FilterSelect'
import { Checkbox, Select } from '@/components/ui'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import { pageSettingsService } from '@/store/services/pageSettingService'

const AddUrlShortner = () => {
    const navigate = useNavigate()
    const base_url = import.meta.env.VITE_WEBSITE_URL
    const [shortUrlData, setShortUrlData] = useState('')
    const [showGeneratedUrl, setShowGeneratedUrl] = useState(false)
    const [showAddFilter, setShowAddFilter] = useState<number[]>([])
    const [filterId, setFilterId] = useState()
    const [subPageNamesData, setSubPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [pageNamesData, setPageNamesData] = useState<pageNameTypes[] | undefined>([])
    const [selectedPageName, setSelectedPageName] = useState<string | undefined>(undefined)

    const { data: SubPageNames, isSuccess: isSubPageNamesSuccess } = pageSettingsService.useSubPageNamesQuery({
        pageName: selectedPageName || '',
    })

    const { data: pageNames, isSuccess: isPageNamesSuccess } = pageSettingsService.usePageNamesQuery({
        page: 1,
        pageSize: 500,
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
    }, [isSubPageNamesSuccess, SubPageNames, selectedPageName])

    const handleAddFilter = () => {
        setShowAddFilter([...showAddFilter, showAddFilter.length])
    }

    const handleRemoveFilter = (index: number) => {
        const updatedFilters = showAddFilter.filter((_, i) => i !== index)
        setShowAddFilter(updatedFilters)
    }

    const handleSubmit = async (values: any) => {
        console.log('values', values)
        const filters = [
            ...(values.filters || []),
            ...UtmArray.filter((item) => values[item.name] !== undefined).map(
                (item) => `${item.name.replace('_', '-')}_${values[item.name]}`,
            ),
            ...MAXMINARRAY.filter((item) => values[item.name] !== undefined).map((item) => `${item.name}_${values[item.name]}`),
            ...OFFARRAY.filter((item) => values[item.name] !== undefined).map((item) => `${item.name}_${values[item.name]}`),
            ...(values.discountTags || []),
            `filterId_${filterId}`,
        ]
            .filter(Boolean)
            .join(',')

        const noSelectFilters = UtmArray.filter((item) => values[item.name] !== undefined)
            .map((item) => `${item.name.replace('_', '-')}=${values[item.name]}`)
            .join('&')

        const { page_title, ...rest } = values
        let pageTitle = ''
        if (values.page_title && values?.target_page === 'products') {
            pageTitle = `/${values?.page_title}`
        }

        let appOnly = ''
        if (values?.app) {
            appOnly = `&app=${values?.app}`
        }

        let target_page = ''
        if (values?.target_page) {
            target_page = `/${values?.target_page}`
        }
        let subPage = ''
        if (values?.sub_page && values?.target_page === 'home') {
            subPage = `sub_page=${values?.sub_page?.name}`
        }

        const formData = {
            ...rest,
            short_code: values?.short_code,
            ios_url: !values.select_filter
                ? values.ios_url
                    ? `${values.ios_url}${target_page}${pageTitle}?${subPage}&${noSelectFilters}${appOnly}`
                    : `${`slikk:/`}${target_page}${pageTitle}?${subPage}&${noSelectFilters}${appOnly}`
                : `${`slikk:/`}${target_page}${pageTitle}?${subPage}&filters=${filters}${appOnly}`,
            web_url: !values.select_filter
                ? values.web_url
                    ? `${values.web_url}${target_page}${pageTitle}?${subPage}&${noSelectFilters}${appOnly}`
                    : `${base_url}${target_page}${pageTitle}?${subPage}&${noSelectFilters}${appOnly}`
                : `${base_url}${target_page}${pageTitle}?${subPage}&filters=${filters}${appOnly}`,
            android_url: !values.select_filter
                ? values.android_url
                    ? `${values.android_url}${target_page}${pageTitle}?${subPage}${noSelectFilters}${appOnly}`
                    : `${`slikk:/`}${target_page}${pageTitle}?${subPage}&${noSelectFilters}${appOnly}`
                : `${`slikk:/`}${target_page}${pageTitle}?${subPage}&filters=${filters}${appOnly}`,
        }

        const pageUrl = `${`slikk://page`}/s/${encodeURIComponent(values?.page?.name)}${values?.sub_page?.name ? `/${encodeURIComponent(values?.sub_page?.name)}` : ''}${pageTitle}?${noSelectFilters}${appOnly}`
        const webPageUrl = `${base_url}/s/${encodeURIComponent(values?.page?.name)}${values?.sub_page?.name ? `/${encodeURIComponent(values?.sub_page?.name)}` : ''}${pageTitle}?${noSelectFilters}${appOnly}`
        const customBody = {
            short_code: values?.short_code,
            ios_url: pageUrl,
            web_url: webPageUrl,
            android_url: pageUrl,
        }

        console.log('formdata is', customBody)

        try {
            const body = values?.is_custom ? customBody : formData
            const response = await axioisInstance.post('/short_url/create', body)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Url Shortener created successfully',
            })
            setShortUrlData(response.data.short_url)
            setShowGeneratedUrl(true)
            navigate(-1)
        } catch (error: any) {
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || error?.response?.data?.data.message || 'Failed to create Url Shortener',
            })
        }
    }

    const handleCopy = (data: string) => {
        navigator.clipboard.writeText(data)
        notification.success({
            message: 'Copied to Clipboard',
        })
    }

    const handleFilterChange = (e: any, setFieldValue: any) => {
        const isChecked = e.target.checked
        setFieldValue('select_filter', isChecked)

        if (isChecked) {
            URLARRAY.slice(1).forEach((item) => setFieldValue(item.name, ''))
        }
    }

    return (
        <div>
            <h3 className="mb-5 from-neutral-900">Create Url Shortner</h3>
            <Formik
                enableReinitialize
                initialValues={initialValueForUrl}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ resetForm, setFieldValue, values }) => (
                    <Form className="w-full shadow-lg p-4 px-6 rounded-xl">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {URLARRAY.slice(0, 1).map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={item?.type === 'checkbox' ? Checkbox : Input}
                                        />
                                    </FormItem>
                                ))}

                                <FormItem label="Target Page">
                                    <Field name="target_page">
                                        {({ field, form }: FieldProps<any>) => {
                                            return (
                                                <Select
                                                    isClearable
                                                    placeholder="Select Target Page"
                                                    options={targetPageArray}
                                                    // defaultValue={selectedOption}
                                                    value={targetPageArray.find((option) => option.value === field.value)}
                                                    onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>

                                {values?.target_page === 'products' && (
                                    <FormItem label="Page Title">
                                        <Field type="text" name="page_title" placeholder="Enter Page Title" component={Input} />
                                    </FormItem>
                                )}

                                <FormItem label="App Only">
                                    <Field type="checkbox" name="app" component={Checkbox} />
                                </FormItem>
                                <FormItem label="Is Custom">
                                    <Field type="checkbox" name="is_custom" component={Checkbox} />
                                </FormItem>

                                {values?.is_custom === true && (
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
                                )}
                                {(values?.target_page === 'home' || values?.is_custom === true) && (
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
                                )}
                            </FormContainer>

                            <FormContainer>
                                <h3>UTM TAGS</h3>
                                <br />
                                <FormContainer className="grid grid-cols-2 gap-6">
                                    {UtmArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className={item.classname}>
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                component={item?.type === 'checkbox' ? Checkbox : Input}
                                            />
                                        </FormItem>
                                    ))}
                                </FormContainer>
                            </FormContainer>

                            <FormItem label="Select Filter">
                                <Field
                                    type="checkbox"
                                    name="select_filter"
                                    component={Checkbox}
                                    onChange={(e: any) => handleFilterChange(e, setFieldValue)}
                                />
                            </FormItem>

                            {values?.select_filter && (
                                <FilterSelect
                                    handleAddFilter={handleAddFilter}
                                    showAddFilter={showAddFilter}
                                    handleRemoveFilter={handleRemoveFilter}
                                    setFilterId={setFilterId}
                                />
                            )}

                            <FormContainer className="grid grid-cols-2 gap-10">
                                {URLARRAY.slice(1).map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            className="w-full"
                                            // disabled={filterShow}
                                        />
                                    </FormItem>
                                ))}
                            </FormContainer>

                            <FormContainer className="flex justify-end mt-5">
                                <Button type="reset" className="mr-2 bg-gray-600" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="accept" type="submit" className="text-white">
                                    Submit
                                </Button>
                            </FormContainer>

                            {showGeneratedUrl && (
                                <div className="flex gap-2 text-xl items-center">
                                    <span className="font-bold">Short Url:</span>
                                    <a
                                        href={shortUrlData}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        {shortUrlData}
                                    </a>
                                    <AiOutlineCopy
                                        className="text-gray-500 cursor-pointer text-xl"
                                        onClick={() => handleCopy(shortUrlData)}
                                    />
                                </div>
                            )}
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddUrlShortner
