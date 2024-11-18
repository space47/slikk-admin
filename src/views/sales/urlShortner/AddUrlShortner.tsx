/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { AiOutlineCopy } from 'react-icons/ai'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
// import Select from '@/components/ui/Select'
// import * as Yup from 'yup'

import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { URLARRAY, initialValueForUrl } from './urlShortner.common'
import { MAXMINARRAY, OFFARRAY, UtmArray } from '../groupNotification/sendNotification/sendNotify.common'

import FilterSelect from './FilterSelect'

const AddUrlShortner = () => {
    const navigate = useNavigate()

    const [shortUrlData, setShortUrlData] = useState('')
    const [showGeneratedUrl, setShowGeneratedUrl] = useState(false)
    const [filterShow, setFilterShow] = useState(false)
    const [showAddFilter, setShowAddFilter] = useState<number[]>([])
    const [filterId, setFilterId] = useState()
    const [filtersData, setFiltersData] = useState([])

    const handleAddFilter = () => {
        setShowAddFilter([...showAddFilter, showAddFilter.length])
    }

    const handleRemoveFilter = (index: number) => {
        const updatedFilters = showAddFilter.filter((_, i) => i !== index)
        setShowAddFilter(updatedFilters)
    }

    const handleAddFilters = async (values) => {
        const newFilterData = showAddFilter.map((_, index) => values.filtersAdd[index] || [])
        setFiltersData((prev) => {
            const updatedFilters = [...prev, newFilterData]
            const lastElement = updatedFilters.at(-1)
            sendFilterData(lastElement)
            return updatedFilters
        })
    }

    const sendFilterData = async (filterData) => {
        try {
            const response = await axioisInstance.post(`/product/search/criteria`, { filter_data: filterData })
            setFilterId(response.data?.data?.id)
        } catch (error) {
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
            `filterId_${filterId}`,
        ]
            .filter(Boolean)
            .join(',')

        const noSelectFilters = UtmArray.filter((item) => values[item.name] !== undefined)
            .map((item) => `${item.name.replace('_', '-')}=${values[item.name]}`)
            .join('&')

        const formData = {
            short_code: values?.short_code,
            ios_url: !values.select_filter
                ? values.ios_url
                    ? `${values.ios_url}?${noSelectFilters}`
                    : ''
                : `https://slikk.club/${values?.target_page}?filters=${filters}`,
            web_url: !values.select_filter
                ? values.web_url
                    ? `${values.web_url}?${noSelectFilters}`
                    : ''
                : `https://slikk.club/${values?.target_page}?filters=${filters}`,
            android_url: !values.select_filter
                ? values.android_url
                    ? `${values.android_url}?${noSelectFilters}`
                    : ''
                : `https://slikk.club/${values?.target_page}?filters=${filters}`,
        }

        try {
            const response = await axioisInstance.post('/short_url/create', formData)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Url Shortener created successfully',
            })
            setShortUrlData(response.data.short_url)
            setShowGeneratedUrl(true)
        } catch (error: any) {
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Failed to create Url Shortener',
            })
        }
    }

    const handleCopy = (data: string) => {
        navigator.clipboard.writeText(data)
    }

    const handleFilterChange = (e: any, setFieldValue: any) => {
        const isChecked = e.target.checked
        setFieldValue('select_filter', isChecked)
        setFilterShow(isChecked)

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
                {({ resetForm, setFieldValue }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {URLARRAY.slice(0, 1).map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}
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

                            {filterShow && (
                                <FilterSelect
                                    handleAddFilter={handleAddFilter}
                                    showAddFilter={showAddFilter}
                                    handleAddFilters={handleAddFilters}
                                    handleRemoveFilter={handleRemoveFilter}
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
                                <Button variant="solid" type="submit" className="text-white">
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
