/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonFilterSelect from '@/common/ComonFilterSelect'
import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import { Formik, FieldArray, Form, Formik as IsolatedFormik, Form as IsolatedForm, Field } from 'formik'
import React, { useState, useEffect, useRef } from 'react'
import { FaTrash } from 'react-icons/fa'
import uniqBy from 'lodash/uniqBy' // ✅ FIXED IMPORT

const IndividualFilterRow = ({ filter, index, setFieldValue, onFocus, onRemove, inputRefs }: any) => {
    const [selectedFilterId, setSelectedFilterId] = useState(filter.filter_id)

    useEffect(() => {
        setSelectedFilterId(filter.filter_id)
    }, [filter.filter_id])

    const handleFilterChange = (newFilterId: any) => {
        setSelectedFilterId(newFilterId)
        setFieldValue(`filters.${index}.filter_id`, Number(newFilterId)) // ✅ ensure number
    }

    return (
        <div className="border bg-blue-50 p-4 mb-4 rounded-md relative">
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600"
            >
                <FaTrash />
            </button>

            {/* Filter Select */}
            <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Filter ID:</label>
                <IsolatedFormik initialValues={{}} onSubmit={() => {}}>
                    <IsolatedForm>
                        <CommonFilterSelect setFilterId={handleFilterChange} filterId={selectedFilterId} isCsv={false} noExtra={true} />
                    </IsolatedForm>
                </IsolatedFormik>
            </div>

            {/* Title Input */}
            <div>
                <label className="block mb-1 text-sm font-medium">Title Template:</label>
                <input
                    type="text"
                    ref={(el) => {
                        if (el) inputRefs.current[index] = el
                    }}
                    value={filter.title}
                    onChange={(e) => setFieldValue(`filters.${index}.title`, e.target.value)}
                    onFocus={() => onFocus(index)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="Enter title template with {tags}"
                />
            </div>
        </div>
    )
}

const GoogleFilter = () => {
    const [productData, setProductData] = useState<any>(null)
    const [existingFilters, setExistingFilters] = useState<any[]>([])
    const [genericTitle, setGenericTitle] = useState('')
    const [activeInputIndex, setActiveInputIndex] = useState<any>(null)
    const inputRefs = useRef<any>({})
    const [tagSearch, setTagSearch] = useState('')

    useEffect(() => {
        fetchProductApi()
        fetchGoogleFiltersApi()
    }, [])

    const fetchProductApi = async () => {
        try {
            const res = await axiosInstance.get(`/app/configuration?config_name=tagsConfiguration`)
            setProductData(res.data?.config?.value || {})
        } catch (e) {
            console.error(e)
        }
    }

    const fetchGoogleFiltersApi = async () => {
        try {
            const res = await axiosInstance.get(`/app/configuration?config_name=googleCatalogueProductTitleConfiguration`)

            const value = res.data?.config?.value || {}

            setExistingFilters(value.filters_title || [])
            setGenericTitle(value.generic_title || '')
        } catch (e) {
            console.error(e)
        }
    }

    const insertTextAtCursor = (input: any, text: string, value: string, index: number, setFieldValue: any) => {
        if (!input) return

        const start = input.selectionStart ?? value.length
        const end = input.selectionEnd ?? value.length

        const newValue = value.slice(0, start) + text + value.slice(end)

        setFieldValue(`filters.${index}.title`, newValue)

        requestAnimationFrame(() => {
            const pos = start + text.length
            input.setSelectionRange(pos, pos)
            input.focus()
        })
    }

    const handleTagClick = (value: string, values: any, setFieldValue: any) => {
        if (activeInputIndex === null) {
            alert('Select an input first')
            return
        }

        const input = inputRefs.current[activeInputIndex]
        const currentValue = values.filters[activeInputIndex]?.title || ''

        insertTextAtCursor(input, `{${value}}`, currentValue, activeInputIndex, setFieldValue)
    }

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        const payload = {
            config_name: 'googleCatalogueProductTitleConfiguration',
            config_value: {
                generic_title: values.generic_title,
                filters_title: values.filters.map((f: any) => ({
                    filter_id: Number(f.filter_id),
                    title: f.title,
                })),
            },
            is_active: true,
        }

        try {
            const res = await axiosInstance.post(`/app/configuration`, payload)
            successMessage(res)
        } catch (err) {
            if (err instanceof AxiosError) errorMessage(err)
        } finally {
            setSubmitting(false)
        }
    }

    const initialValues = {
        generic_title: genericTitle,
        filters: existingFilters.length ? existingFilters : [{ filter_id: '', title: '' }],
    }

    return (
        <div className="flex gap-5 p-5 bg-gray-50 rounded-lg">
            <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit} className="flex w-full gap-5">
                        {/* LEFT */}
                        <div className="flex-1">
                            <FormContainer>
                                <FormItem label="Generic Title">
                                    <Field name="generic_title" component={Input} placeholder="Enter Generic Title" />
                                </FormItem>
                            </FormContainer>

                            <FieldArray name="filters">
                                {({ push, remove }) => (
                                    <>
                                        {values.filters.map((filter: any, index: number) => (
                                            <IndividualFilterRow
                                                key={index}
                                                filter={filter}
                                                index={index}
                                                setFieldValue={setFieldValue}
                                                onFocus={setActiveInputIndex}
                                                onRemove={() => remove(index)}
                                                inputRefs={inputRefs}
                                            />
                                        ))}

                                        <Button variant="blue" type="button" onClick={() => push({ filter_id: '', title: '' })}>
                                            + Add Filter
                                        </Button>
                                    </>
                                )}
                            </FieldArray>

                            <div className="mt-5 text-center">
                                <Button variant="accept" loading={isSubmitting} type="submit">
                                    Save
                                </Button>
                            </div>
                        </div>

                        {/* RIGHT PANEL */}
                        <div className="w-[320px] sticky top-5 h-fit bg-white border rounded-xl p-4 shadow">
                            <h3 className="font-semibold mb-3">Product Tags</h3>

                            <input
                                placeholder="Search tags..."
                                value={tagSearch}
                                onChange={(e) => setTagSearch(e.target.value)}
                                className="w-full mb-3 px-3 py-2 border rounded"
                            />

                            <div className="flex flex-wrap gap-2 max-h-[700px] overflow-y-auto">
                                {productData &&
                                    uniqBy(
                                        Object.entries(productData).map(([key, val]: any) => ({
                                            key,
                                            val,
                                        })),
                                        'val',
                                    )
                                        .filter(({ val }: any) => val.toLowerCase().includes(tagSearch.toLowerCase()))
                                        .map(({ key, val }: any) => (
                                            <span
                                                key={key}
                                                onClick={() => handleTagClick(val, values, setFieldValue)}
                                                className="px-2 py-1 bg-gray-100 border rounded cursor-pointer hover:bg-blue-50 hover:text-black text-sm font-mono"
                                            >
                                                {`{${val}}`}
                                            </span>
                                        ))}
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default GoogleFilter
