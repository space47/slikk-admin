/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import MarkdownCommonForm from '../MarkdownCommonForm'
import { FILTER_STATE } from '@/store/types/filters.types'

const AddmarkdownPrices = () => {
    const dispatch = useAppDispatch()
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [showAddFilter, setShowAddFilter] = useState<any[]>([])
    const [filterId, setFilterId] = useState()
    const [filtersData, setFiltersData] = useState<any[]>([])

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])
    const initialValue = {}

    const handleAddFilter = () => {
        setShowAddFilter([...showAddFilter, showAddFilter.length])
    }

    const handleRemoveFilter = (index: number) => {
        const updatedFilters = showAddFilter.filter((_, i) => i !== index)
        setShowAddFilter(updatedFilters)
    }

    const handleAddFilters = async (values: any) => {
        const newFilterData = showAddFilter.map((_, index) => values.filtersAdd[index] || [])
        setFiltersData((prev: any) => {
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
        const body = {
            product_filter: filterId ?? {},
            start_date: values.start_date ?? '',
            end_date: values.end_date ?? '',
            discount_type: values.discount_type ?? '',
            offer_value: values.offer_value ?? {},
            apply_on: values.apply_on ?? '',
            name: values.name ?? '',
        }

        console.log('Body of MarkDown', body, filtersData)
        try {
            const response = await axioisInstance.post(`/product/offer/pricing`, body)
            notification.success({
                message: response?.data?.message || 'Successfully Added',
            })
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || 'Failed to Add',
            })
            console.error(error)
        }
    }

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form className="w-3/4">
                        <FormContainer className="">
                            <MarkdownCommonForm
                                handleAddFilter={handleAddFilter}
                                showAddFilter={showAddFilter}
                                handleAddFilters={handleAddFilters}
                                handleRemoveFilter={handleRemoveFilter}
                                filters={filters?.filters}
                            />
                        </FormContainer>
                        <Button variant="accept" type="submit">
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddmarkdownPrices
