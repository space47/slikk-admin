/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonFilterSelect from '@/common/ComonFilterSelect'
import { Button } from '@/components/ui'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import { Formik, FieldArray, Form, Formik as IsolatedFormik, Form as IsolatedForm } from 'formik'
import React, { useState, useEffect, useRef } from 'react'
import { FaTrash } from 'react-icons/fa'

const IndividualFilterRow = ({ filter, index, setFieldValue, onFocus, onRemove, inputRefs }: any) => {
    const [selectedFilterId, setSelectedFilterId] = useState(filter.filter_id)

    const handleFilterChange = (newFilterId: any) => {
        setSelectedFilterId(newFilterId)
        setFieldValue(`filters.${index}.filter_id`, newFilterId)
    }

    return (
        <div className="border bg-blue-50 p-4 mb-4 rounded-md relative">
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 bg-red-500 text-white border-none rounded cursor-pointer px-2 py-1 text-sm hover:bg-red-600 z-10"
            >
                <FaTrash className="text-xl" />
            </button>

            <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Filter ID:</label>
                <IsolatedFormik initialValues={{ filtersAdd: [], filtersRemove: [] }} onSubmit={() => {}}>
                    <IsolatedForm>
                        <CommonFilterSelect setFilterId={handleFilterChange} filterId={selectedFilterId} isCsv={false} noExtra={true} />
                    </IsolatedForm>
                </IsolatedFormik>
            </div>

            <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Title Template:</label>
                <input
                    type="text"
                    ref={(el) => {
                        if (el) inputRefs.current[index] = el
                    }}
                    value={filter.title}
                    onChange={(e) => setFieldValue(`filters.${index}.title`, e.target.value)}
                    onFocus={() => onFocus(index)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="Enter title template with {tags}"
                />
                <div className="text-xs text-gray-500 mt-1">
                    Tip: Click on this input field first, then click on any tag from the below panel to insert it at cursor position
                </div>
            </div>
        </div>
    )
}

const GoogleFilter = () => {
    const [productData, setProductData] = useState(null)
    const [existingFilters, setExistingFilters] = useState([])
    const inputRefs = useRef<any>({})
    const [activeInputIndex, setActiveInputIndex] = useState(null)
    const [showTags, setShowTags] = useState(false)

    useEffect(() => {
        fetchProductApi()
        fetchGoogleFiltersApi()
    }, [])

    const fetchProductApi = async () => {
        try {
            const response = await axiosInstance.get(`/app/configuration?config_name=tagsConfiguration`)
            setProductData(response.data?.config?.value || null)
        } catch (error) {
            console.error('Error fetching configuration:', error)
        }
    }

    const fetchGoogleFiltersApi = async () => {
        try {
            const response = await axiosInstance.get(`/app/configuration?config_name=googleCatalogueProductTitleConfiguration`)
            const filters = response.data?.config?.value || []
            setExistingFilters(filters)
        } catch (error) {
            console.error('Error fetching configuration:', error)
        }
    }

    // Replace insertTextAtCursor and handleProductDataClick with this:

    const insertTextAtCursor = (inputElement: any, textToInsert: any, currentValue: string, index: number, setFieldValue: any) => {
        if (!inputElement) return

        const startPos = inputElement.selectionStart
        const endPos = inputElement.selectionEnd
        const newText = currentValue.substring(0, startPos) + textToInsert + currentValue.substring(endPos)

        // ✅ Update Formik state directly — this is the source of truth
        setFieldValue(`filters.${index}.title`, newText)

        // Restore cursor position after React re-renders
        requestAnimationFrame(() => {
            const newCursorPos = startPos + textToInsert.length
            inputElement.setSelectionRange(newCursorPos, newCursorPos)
            inputElement.focus()
        })
    }

    const handleProductDataClick = (key: any, value: any, values: any, setFieldValue: any) => {
        if (activeInputIndex !== null) {
            const inputElement = inputRefs.current[activeInputIndex]
            if (inputElement) {
                const currentValue = values.filters[activeInputIndex]?.title || ''
                insertTextAtCursor(inputElement, `{${key}}`, currentValue, activeInputIndex, setFieldValue)
            }
        } else {
            alert('Please click on a title input field first')
        }
    }

    const handleSubmit = async (values: any, { setSubmitting }: any) => {
        const payload = values.filters.map((filter: any) => ({
            filter_id: filter.filter_id,
            title: filter.title,
        }))

        const body = {
            config_name: 'googleCatalogueProductTitleConfiguration',
            config_value: payload,
            is_active: true,
        }
        try {
            const res = await axiosInstance.post(`/app/configuration`, body)
            successMessage(res)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        } finally {
            setSubmitting(false)
        }
    }

    const initialValues = {
        filters: existingFilters.length > 0 ? existingFilters : [{ filter_id: '', title: '' }],
    }

    return (
        <div className="flex gap-5 p-5 flex-col bg-gray-50 rounded-lg">
            const [showTags, setShowTags] = useState(false)
            <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit} className="">
                        <FieldArray name="filters">
                            {({ push, remove }) => (
                                <>
                                    {values.filters.map((filter, index) => (
                                        <IndividualFilterRow
                                            key={`filter-row-${index}-${filter.filter_id || 'new'}`}
                                            filter={filter}
                                            index={index}
                                            setFieldValue={setFieldValue}
                                            onFocus={setActiveInputIndex}
                                            onRemove={() => remove(index)}
                                            inputRefs={inputRefs}
                                        />
                                    ))}

                                    <Button
                                        variant="blue"
                                        size="sm"
                                        type="button"
                                        className="mb-7"
                                        onClick={() => push({ filter_id: '', title: '' })}
                                    >
                                        + Add New Filter
                                    </Button>
                                </>
                            )}
                        </FieldArray>
                        {/* FLOATING ACTION PANEL */}
                        <div className="fixed bottom-32 right-4 z-50 flex flex-col items-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowTags((prev) => !prev)}
                                className="bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-all"
                            >
                                {showTags ? 'Hide Tags ✖' : 'Show Product Tags ⚡'}
                            </button>
                            <div
                                className={`w-[320px] bg-white border border-gray-200 rounded-2xl shadow-xl transition-all duration-300 overflow-hidden ${
                                    showTags ? 'max-h-[300px] p-4 opacity-100' : 'max-h-0 opacity-0 p-0'
                                }`}
                            >
                                <h3 className="text-md font-semibold mb-3 text-gray-700">Product Data Tags</h3>

                                <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto pr-1">
                                    {productData &&
                                        Object.entries(productData).map(([key, value]) => (
                                            <span
                                                key={key}
                                                onClick={() => handleProductDataClick(key, value, values, setFieldValue)}
                                                className="px-3 py-1 text-sm bg-gray-100 hover:bg-black hover:text-white border border-gray-300 rounded-full cursor-pointer font-mono transition-all"
                                            >
                                                {`{${key}}`}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        </div>
                        <div className=" flex items-center justify-center">
                            <Button type="submit" variant="solid" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : '💾 Save Filters'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default GoogleFilter
