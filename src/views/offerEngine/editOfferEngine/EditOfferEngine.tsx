/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { Form, Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import AddOfferCommon from '../createOfferEngine/AddOfferCommon'
import { Button, FormContainer } from '@/components/ui'
import { handleimage } from '@/common/handleImage'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { companyStore } from '@/store/types/companyStore.types'
import { OfferTypes } from '../offerEngineCommon'

const EditOfferEngine = () => {
    const navigate = useNavigate()
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const dispatch = useAppDispatch()
    const [showAddFilter, setShowAddFilter] = useState<any[]>([])
    const [filterId, setFilterId] = useState()
    const [filtersData, setFiltersData] = useState<any[]>([])
    const [particularOfferData, setParticularOfferData] = useState<OfferTypes>()
    const [csvFile, setCsvFile] = useState<any>()

    const { code } = useParams()

    const fetchOfferParticularData = async () => {
        try {
            const response = await axioisInstance.get(`/offers?code=${code}`)
            const data = response?.data?.data
            setParticularOfferData(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchOfferParticularData()
    }, [])

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [])

    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const initialValue: any = {
        apply_offer_type: particularOfferData?.apply_offer_type || '',
        apply_price_type: particularOfferData?.apply_price_type || '',
        code: particularOfferData?.code || '',
        days: particularOfferData?.days || '',
        description: particularOfferData?.description || '',
        min_amount: particularOfferData?.min_amount || 0,
        min_quantity: particularOfferData?.min_quantity || 0,
        name: particularOfferData?.name || '',
        offer_value: particularOfferData?.offer_value || '',
        quantity_x: particularOfferData?.quantity_x || 0,
        start_date: particularOfferData?.start_date || '',
        end_date: particularOfferData?.end_date || '',
        upto_off: particularOfferData?.upto_off || 0,
        offer_type: particularOfferData?.offer_type || '',
        // extra_attributes: {
        //     image: imageUpload || '',
        // },
        image: particularOfferData?.extra_attributes?.image || '',
        filter_id: filterId || undefined,
        store_code: particularOfferData?.store || undefined,
    }

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
        const formData = new FormData()

        if (filterData && filterData.length > 0) {
            formData.append('filter_data', filterData)
        } else {
            formData.append('filter_data', '')
        }

        if (csvFile && csvFile.length > 0) {
            formData.append('skus', csvFile[0])
        } else {
            formData.append('skus', '')
        }

        try {
            const response = await axioisInstance.post(`/product/search/criteria`, formData)
            setFilterId(response.data?.data?.id)

            notification.success({
                message: 'Filter ID Added Successfully',
            })
        } catch (error) {
            notification.error({
                message: 'Failed to Add Filter ID',
            })
            console.error(error)
        }
    }

    const handleSubmit = async (values: any) => {
        console.log('start', values?.imageList)
        const imageUpload = values.imageList ? await handleimage('product', values.imageList) : null
        const body = {
            ...(values?.apply_offer_type && { apply_offer_type: values.apply_offer_type }),
            ...(values?.apply_price_type && { apply_price_type: values.apply_price_type }),
            ...(values?.code && { code: values.code }),
            ...(values?.days?.length && { days: values.days }),
            ...(values?.description && { description: values.description }),
            ...(values?.min_amount && { min_amount: values.min_amount }),
            ...(values?.min_quantity && { min_quantity: values.min_quantity }),
            ...(values?.name && { name: values.name }),
            ...(values?.offer_value && { offer_value: values.offer_value }),
            ...(values?.quantity_x && { quantity_x: values.min_quantity }),
            ...(values?.start_date && { start_date: values.start_date }),
            ...(values?.end_date && { end_date: values.end_date }),
            ...(values?.upto_off && { upto_off: values.upto_off }),
            ...(values?.offer_type && { offer_type: values.offer_type }),
            ...(imageUpload && { extra_attributes: { image: imageUpload } }),

            ...(values?.store_code && { store: values.store_code }),
            filter_id: filterId || undefined,
        }

        console.log('Body for edit offer', body)
        try {
            const response = await axioisInstance.patch(`/offers/${particularOfferData?.id}`, body)
            notification.success({
                message: response?.data?.message || 'Successfully edited offer',
            })
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || error?.response?.message || 'Failed to edit offer',
            })
            console.error(error)
        }
    }

    return (
        <div>
            <h3 className="mb-5 from-neutral-900 font-semibold">Edit Offers</h3>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values }) => (
                    <Form className="w-full">
                        <AddOfferCommon
                            initialValue={initialValue}
                            filters={filters?.filters}
                            showAddFilter={showAddFilter}
                            handleAddFilter={handleAddFilter}
                            handleAddFilters={handleAddFilters}
                            handleRemoveFilter={handleRemoveFilter}
                            values={values}
                            editMode={true}
                            storeResults={storeResults}
                            setCsvFile={setCsvFile}
                        />
                        <FormContainer>
                            <Button variant="accept" type="submit">
                                Submit
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditOfferEngine
