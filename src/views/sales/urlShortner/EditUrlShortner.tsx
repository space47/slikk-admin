/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
// import Select from '@/components/ui/Select'
import { Field, FieldProps, Form, Formik } from 'formik' // Add FieldProps here
// import * as Yup from 'yup'

import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { URLARRAY, URLTYPES, initialValueForUrl } from './urlShortner.common'
import { AiOutlineCopy } from 'react-icons/ai'
import FilterSelect, { targetPageArray } from './FilterSelect'
import { useEffect, useState } from 'react'
import { MAXMINARRAY, OFFARRAY, UtmArray } from '../groupNotification/sendNotification/sendNotify.common'
import { Checkbox, Select } from '@/components/ui'
import { pageNameTypes } from '@/store/types/pageSettings.types'
import { pageSettingsService } from '@/store/services/pageSettingService'

const EditUrlShortner = () => {
    const [urlFieldDatas, setUrlFieldDatas] = useState<any>()
    const [shortUrlData, setShortUrlData] = useState('')
    const [showGeneratedUrl, setShowGeneratedUrl] = useState(false)
    const navigate = useNavigate()
    const [showAddFilter, setShowAddFilter] = useState<number[]>([])
    const [filterId, setFilterId] = useState()
    const [filtersData, setFiltersData] = useState([])
    const [sortValue, setSortValue] = useState<string>('')
    const [targetPageValue, setTargetPageValue] = useState<string>('')
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

    const { short_code } = useParams()

    const fetchUrlData = async () => {
        try {
            const response = await axioisInstance.get(`/short_urls?short_code=${short_code}`)
            const data = response?.data?.message
            setUrlFieldDatas(data?.results[0])
            if (data?.results[0]?.web_url) {
                const filters = extractFilters(data?.results[0]?.web_url)
                if (filters.discountTags) {
                    setSortValue(filters.discountTags)
                }
            }
            if (data?.results[0]?.web_url) {
                const filters = extractTargetPage(data?.results[0]?.web_url)
                if (filters.target_page) {
                    setTargetPageValue(filters.target_page)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    console.log('Discount Tags', targetPageValue)

    useEffect(() => {
        fetchUrlData()
    }, [short_code])

    const baseUrl = import.meta.env.VITE_WEBSITE_URL

    const extractFilters = (url: string) => {
        const filterParams: Record<string, any> = {}

        if (!url.includes('filters')) {
            const filterRegex = /([a-zA-Z0-9-_]+)=([^&]+)/g
            let match
            while ((match = filterRegex.exec(url)) !== null) {
                const [_, key, value] = match
                console.log('key value is', value)
                if (key === 'utm-medium') filterParams['utm_medium'] = value
                if (key === 'utm-source') filterParams['utm_source'] = value
                if (key === 'utm-campaign') filterParams['utm_campaign'] = value
                if (key === 'utm-tags') filterParams['utm_tags'] = value
            }
        } else {
            const filterRegex = /([a-zA-Z0-9-_]+)_([a-zA-Z0-9-_]+)/g
            let match
            while ((match = filterRegex.exec(url)) !== null) {
                const [_, key, value] = match

                if (key === 'minprice') filterParams['minprice'] = value
                if (key === 'maxprice') filterParams['maxprice'] = value
                if (key === 'utm-medium') filterParams['utm_medium'] = value
                if (key === 'utm-source') filterParams['utm_source'] = value
                if (key === 'utm-campaign') filterParams['utm_campaign'] = value
                if (key === 'utm-tags') filterParams['utm_tags'] = value
                if (key === 'maxoff') filterParams['maxoff'] = value
                if (key === 'minoff') filterParams['minoff'] = value
                if (key === 'sort') filterParams['discountTags'] = value
                if (key === 'filterId') filterParams['filter_id'] = value
                if (key === 'ub/') filterParams['target_page'] = value
                if (key === 'app') filterParams['app'] = value
            }
        }
        return filterParams
    }

    const filterParamsx = extractFilters(urlFieldDatas?.web_url || urlFieldDatas?.android_url || urlFieldDatas?.ios_url || '')

    const initialValues: any = {
        short_code: urlFieldDatas?.short_code || '',
        web_url: urlFieldDatas?.ios_url ? `${baseUrl}` : '',
        android_url: urlFieldDatas?.ios_url ? `${`slikk://page`}` : '',
        ios_url: urlFieldDatas?.ios_url ? `${`slikk://page`}` : '',
        page: (() => {
            const url = urlFieldDatas?.web_url || urlFieldDatas?.android_url || urlFieldDatas?.ios_url
            if (url) {
                const match = url.match(/\/s\/([^/]+)/)
                return match ? match[1]?.replace('?', '') : ''
            }
            return ''
        })(),
        sub_page: (() => {
            const url = urlFieldDatas?.web_url || urlFieldDatas?.android_url || urlFieldDatas?.ios_url
            if (url) {
                const match = url.match(/\/s\/[^/]+\/([^/?]+)/)
                return match ? match[1]?.replace('?', '') : ''
            }
            return ''
        })(),
        page_title: (() => {
            const url = urlFieldDatas?.web_url || urlFieldDatas?.android_url || urlFieldDatas?.ios_url
            if (url) {
                const match = url?.match(/\.club\/(?:[^/]+\/)?([^/?]+)/)
                const match2 = url?.match(/\.club\/([^/?]+)/)
                console.log('Regex url is', match)
                console.log('Regex url is 2', match2)
                return match && match2[1] !== match[1] ? match[1] : ''
            }
            return ''
        })(),
        target_page: (() => {
            const url = urlFieldDatas?.web_url || urlFieldDatas?.android_url || urlFieldDatas?.ios_url
            if (url) {
                const match = url.match(/\.club\/([^/?]+)/)
                console.log('Target Page Regex url', match)
                return match ? match[1] : ''
            }
            return ''
        })(),
        select_filter: urlFieldDatas?.web_url?.includes('filters') || urlFieldDatas?.android_url?.includes('filters'),
        is_custom: (() => {
            const url = urlFieldDatas?.web_url || urlFieldDatas?.android_url || urlFieldDatas?.ios_url
            if (url) {
                const match = url.match(/\/s\/([^/]+)/)
                return match ? true : false
            }
            return false
        })(),
        app: urlFieldDatas?.web_url?.includes('&app') || urlFieldDatas?.android_url?.includes('&app'),
        utm_medium: filterParamsx['utm_medium'],
        utm_source: filterParamsx['utm_source'],
        utm_campaign: filterParamsx['utm_campaign'],
        utm_tags: filterParamsx['utm_tags'],
    }

    useEffect(() => {
        setSelectedPageName(initialValues?.page)
    }, [initialValues?.page])

    const extractTargetPage = (url: string) => {
        const pageRegex = /.club\/([^/?]+)/
        const pageMatch = pageRegex.exec(url)
        const filterParams: Record<string, any> = {}
        if (pageMatch) {
            filterParams['target_page'] = pageMatch[1]
        }

        return filterParams
    }

    useEffect(() => {
        if (urlFieldDatas?.android_url || urlFieldDatas?.web_url) {
            const filters = extractFilters(urlFieldDatas.android_url || urlFieldDatas?.web_url)
            console.log('Filter of Urls', filters)

            Object.keys(filters).forEach((key) => {
                initialValues[key] = filters[key]
            })
        }
    }, [urlFieldDatas])

    console.log('url Field Datas', urlFieldDatas)

    const handleAddFilter = () => {
        setShowAddFilter([...showAddFilter, showAddFilter.length])
    }

    const handleRemoveFilter = (index: number) => {
        const updatedFilters = showAddFilter.filter((_, i) => i !== index)
        setShowAddFilter(updatedFilters)
    }

    const handleAddFilters = async (values: any) => {
        const newFilterData = showAddFilter.map((_, index) => values.filtersAdd[index] || [])
        setFiltersData((prev) => {
            const updatedFilters = [...prev, newFilterData]
            const lastElement = updatedFilters.at(-1)
            sendFilterData(lastElement)
            return updatedFilters
        })
    }

    const sendFilterData = async (filterData: any) => {
        try {
            const response = await axioisInstance.post(`/product/search/criteria`, { filter_data: filterData })
            setFilterId(response.data?.data?.id)
            notification.success({
                message: 'Filter Id Added',
            })
        } catch (error) {
            notification.error({
                message: 'Failed to Add Filter ID',
            })
            console.error(error)
        }
    }

    console.log('Filter Id 🚀🚀', initialValues)

    const handleSubmit = async (values: any) => {
        console.log('Values of target page', values)
        const filters = [
            ...(values.filters || []),
            ...UtmArray.filter((item) => values[item.name] !== undefined).map(
                (item) => `${item.name.replace('_', '-')}_${values[item.name]}`,
            ),
            ...MAXMINARRAY.filter((item) => values[item.name] !== undefined).map((item) => `${item.name}_${values[item.name]}`),
            ...OFFARRAY.filter((item) => values[item.name] !== undefined).map((item) => `${item.name}_${values[item.name]}`),
            ...(values.discountTags || []),
            ...(filterId ? [`filterId_${filterId}`] : []),
        ].join(',')

        const noSelectFilters = UtmArray.filter((item) => values[item.name] !== undefined && values[item.name] !== '')
            .map((item) => `${item.name.replace('_', '-')}=${values[item.name]}`)
            .join('&')

        console.log('Filters', noSelectFilters)

        const { page_title, rest } = values

        let pageTitle = ''

        if (page_title && values?.target_page === 'products') {
            pageTitle = `/${values?.page_title}`
        }

        let target_page = ''
        if (values?.target_page) {
            target_page = `/${values?.target_page}`
        }

        let appOnly = ''
        if (values?.app) {
            appOnly = `&app=${values?.app}`
        }
        let subPage = ''
        if (values?.sub_page && values?.target_page === 'home') {
            subPage = `sub_page=${values?.sub_page?.name}`
        } else if (values?.sub_page?.name === undefined && values?.target_page === 'home') {
            subPage = `sub_page=${values?.sub_page}`
        }

        console.log('Target Page', values?.target_page)

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
                    : `${baseUrl}${target_page}${pageTitle}?${subPage}&${noSelectFilters}${appOnly}`
                : `${baseUrl}${target_page}${pageTitle}?${subPage}&filters=${filters}${appOnly}`,
            android_url: !values.select_filter
                ? values.android_url
                    ? `${values.android_url}${target_page}${pageTitle}?${subPage}&${noSelectFilters}${appOnly}`
                    : `${`slikk:/`}${target_page}${pageTitle}?${subPage}&${noSelectFilters}${appOnly}`
                : `${`slikk:/`}${target_page}${pageTitle}?${subPage}&filters=${filters}${appOnly}`,
        }

        const webPageUrl = `${baseUrl}/s/${values?.page?.name === undefined ? values?.page : encodeURIComponent(values?.page?.name) || ''}${
            values?.sub_page == 'null' || values?.sub_page === null || values?.sub_page?.name === 'undefined'
                ? ''
                : values?.sub_page?.name === undefined
                  ? `/${values?.sub_page}`
                  : `/${encodeURIComponent(values?.sub_page?.name) || ''}`
        }?${noSelectFilters}${appOnly}`

        const pageUrl = `slikk://page/s/${values?.page?.name === undefined ? values?.page : encodeURIComponent(values?.page?.name) || ''}${
            values?.sub_page == 'null' || values?.sub_page === null || values?.sub_page === 'undefined'
                ? ''
                : values?.sub_page?.name === undefined
                  ? `/${values?.sub_page}`
                  : `/${encodeURIComponent(values?.sub_page?.name) || ''}`
        }?${noSelectFilters}${appOnly}`

        const customBody = {
            short_code: values?.short_code,
            ios_url: pageUrl,
            web_url: webPageUrl,
            android_url: pageUrl,
        }

        console.log('object', formData)
        console.log('object 2', customBody)
        try {
            const body = values?.is_custom ? customBody : formData
            const response = await axioisInstance.patch(`/short_url/update/${short_code}`, body)
            notification.success({
                message: 'Success',
                description: response?.data?.message || response?.data?.data?.message || 'Url Shortener Updated successfully',
            })
            setShortUrlData(response?.data?.data?.short_url)
            setShowGeneratedUrl(true)
            navigate(-1)
        } catch (error: any) {
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || error?.response?.data?.data.message || 'Failed to update Url Shortener',
            })
        }
    }

    console.log('Initial Values', initialValues?.page, pageNamesData)

    const handleCopy = (data: string) => {
        navigator.clipboard.writeText(data)
        notification.success({
            message: 'Copied',
        })
    }

    const handleFilterChange = (e: any, setFieldValue: any) => {
        const isChecked = e.target.checked
        setFieldValue('select_filter', isChecked)
    }

    return (
        <div>
            <h3 className="mb-5 from-neutral-900">Edit Url Shortner</h3>
            <Formik
                enableReinitialize
                initialValues={initialValues}
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
                                            console.log('filter_id', values?.filter_id)
                                            return (
                                                <Select
                                                    isClearable
                                                    placeholder="Select Target Page"
                                                    options={targetPageArray}
                                                    defaultValue={field.value}
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
                                                        ? pageNamesData?.find(
                                                              (option) => option.name === decodeURIComponent(field?.value?.name),
                                                          )
                                                        : pageNamesData?.find((option) => option.name === decodeURIComponent(field?.value))
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
                                                            ? subPageNamesData?.find(
                                                                  (option) => option.name === decodeURIComponent(field?.value?.name),
                                                              )
                                                            : subPageNamesData?.find(
                                                                  (option) => option.name === decodeURIComponent(field?.value),
                                                              )
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
                                    onChange={(e) => handleFilterChange(e, setFieldValue)}
                                />
                            </FormItem>

                            {values.select_filter && (
                                <FilterSelect
                                    handleAddFilter={handleAddFilter}
                                    showAddFilter={showAddFilter}
                                    handleAddFilters={handleAddFilters}
                                    handleRemoveFilter={handleRemoveFilter}
                                    sortValue={sortValue}
                                    targetPagevalue={targetPageValue}
                                    filterValue={values?.filter_id}
                                    setFilterId={setFilterId}
                                />
                            )}

                            <FormContainer className="grid grid-cols-2 gap-10">
                                {URLARRAY.slice(1).map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} className="w-full" />
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

export default EditUrlShortner
