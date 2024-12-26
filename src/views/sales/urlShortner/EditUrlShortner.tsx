/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
// import Select from '@/components/ui/Select'
import { Field, Form, Formik } from 'formik' // Add FieldProps here
// import * as Yup from 'yup'

import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { URLARRAY, URLTYPES, initialValueForUrl } from './urlShortner.common'
import { AiOutlineCopy } from 'react-icons/ai'
import FilterSelect from './FilterSelect'
import { useEffect, useState } from 'react'
import { MAXMINARRAY, OFFARRAY, UtmArray } from '../groupNotification/sendNotification/sendNotify.common'

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

    const initialValues: any = {
        short_code: urlFieldDatas?.short_code || '',
        web_url: urlFieldDatas?.ios_url ? `https://slikk.club` : '',
        android_url: urlFieldDatas?.ios_url ? `https://slikk.club` : '',
        ios_url: urlFieldDatas?.ios_url ? `https://slikk.club` : '',
        app: urlFieldDatas?.app,
        page_title: (() => {
            const url = urlFieldDatas?.web_url || urlFieldDatas?.android_url || urlFieldDatas?.ios_url
            if (url) {
                const match = url.match(/https:\/\/slikk\.club\/(?:[^/]+\/)?([^/?]+)/)
                return match ? match[1] : ''
            }
            return ''
        })(),
        select_filter:
            urlFieldDatas?.web_url?.split('https://slikk.club/')[1]?.length > 0 ||
            urlFieldDatas?.android_url?.split('https://slikk.club/')[1]?.length > 0,
    }

    const [filterShow, setFilterShow] = useState(initialValues?.select_filter)

    const extractFilters = (url: string) => {
        const filterParams: Record<string, any> = {}

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
        }
        return filterParams
    }
    const extractTargetPage = (url: string) => {
        const pageRegex = /slikk.club\/([^/?]+)/
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

    const handleSubmit = async (values: any) => {
        const filters = [
            ...(values.filters || []),
            ...UtmArray.filter((item) => values[item.name] !== undefined).map(
                (item) => `${item.name.replace('_', '-')}_${values[item.name]}`,
            ),
            ...MAXMINARRAY.filter((item) => values[item.name] !== undefined).map((item) => `${item.name}_${values[item.name]}`),
            ...OFFARRAY.filter((item) => values[item.name] !== undefined).map((item) => `${item.name}_${values[item.name]}`),
            ...(values.discountTags || []),
            ...(filterId ? [`filterId_${filterId}`] : []),
        ]
            .filter(Boolean)
            .join(',')

        const noSelectFilters = UtmArray.filter((item) => values[item.name] !== undefined)
            .map((item) => `${item.name.replace('_', '-')}=${values[item.name]}`)
            .join('&')

        const { page_title } = values

        let pageTitle = ''

        if (page_title) {
            pageTitle = `${page_title}`
        }

        let appOnly = ''
        if (values?.app) {
            appOnly = `&app=${values?.app}`
        }

        console.log('Target Page', values?.target_page)

        const formData = {
            web_url: !values.select_filter
                ? values.web_url
                    ? `${values.web_url}/${pageTitle}?${noSelectFilters}${appOnly}`
                    : ''
                : `https://slikk.club/${values?.target_page}/${pageTitle}?filters=${filters}${appOnly}`,
            ios_url: !values.select_filter
                ? values.ios_url
                    ? `${values.ios_url}/${pageTitle}?${noSelectFilters}${appOnly}`
                    : ''
                : `https://slikk.club/${values?.target_page}/${pageTitle}?filters=${filters}${appOnly}`,
            android_url: !values.select_filter
                ? values.android_url
                    ? `${values.android_url}/${pageTitle}?${noSelectFilters}${appOnly}`
                    : ''
                : `https://slikk.club/${values?.target_page}/${pageTitle}?filters=${filters}${appOnly}`,
            short_code: values?.short_code,
        }

        try {
            const response = await axioisInstance.patch(`/short_url/update/${short_code}`, formData)
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
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {URLARRAY.slice(0, 2).map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}
                                <FormItem label="App Only">
                                    <Field type="checkbox" name="app" component={Input} />
                                </FormItem>
                            </FormContainer>

                            <FormContainer>
                                <h3>UTM TAGS</h3>
                                <br />
                                <FormContainer className="grid grid-cols-2 gap-6">
                                    {UtmArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className={item.classname}>
                                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                        </FormItem>
                                    ))}
                                </FormContainer>
                            </FormContainer>

                            <FormItem label="Select Filter">
                                <Field
                                    type="checkbox"
                                    name="select_filter"
                                    component={Input}
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
                                />
                            )}

                            <FormContainer className="grid grid-cols-2 gap-10">
                                {URLARRAY.slice(2).map((item, key) => (
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
