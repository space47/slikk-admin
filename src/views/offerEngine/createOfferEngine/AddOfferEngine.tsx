/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { Form, Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { FILTER_STATE } from '@/store/types/filters.types'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import AddOfferCommon from './AddOfferCommon'
import { Button, FormContainer } from '@/components/ui'
import { handleimage } from '@/common/handleImage'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { companyStore } from '@/store/types/companyStore.types'

const AddOfferEngine = () => {
    const navigate = useNavigate()
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [showAddFilter, setShowAddFilter] = useState<any[]>([])
    const [filterId, setFilterId] = useState()
    const [skuInput, setSkuInput] = useState<string>('')
    const [filtersData, setFiltersData] = useState<any[]>([])
    const [csvFile, setCsvFile] = useState<any>()

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [])

    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const [skuSearchData, setSkuSearchData] = useState<any[]>([])
    const fetchSkuData = async () => {
        try {
            const response = await axioisInstance.get(`/merchant/products?sku=${skuInput}`)
            const data = response?.data?.data?.results

            setSkuSearchData((prev) => {
                const newData = Array.isArray(data) ? data : [data]
                return [...prev, ...newData.filter((item) => !prev.some((prevItem) => prevItem.sku === item.sku))]
            })
        } catch (error) {
            console.error(error)
        }
    }

    // Add SKU
    const handleAddSku = () => {
        fetchSkuData()
    }

    const handleRemoveSku = (sku: string) => {
        setSkuSearchData((prev) => prev.filter((item) => item.sku !== sku))
    }

    const [skuList, setSkuList] = useState<string[]>([])

    // Update the SKU list when `skuSearchData` changes
    useEffect(() => {
        const allSkus = skuSearchData.map((item: any) => item.barcode)
        setSkuList(allSkus)
    }, [skuSearchData])

    console.log('Barcodes', skuList)

    const columns = useMemo(
        () => [
            {
                header: 'SKU',
                accessorKey: 'sku',

                cell: ({ row }: any) => {
                    return <div>{row?.original?.sku}</div>
                },
            },
            { header: 'Barcode', accessorKey: 'barcode' },
            { header: 'Product Name', accessorKey: 'name' },
            { header: 'Brand', accessorKey: 'brand' },
            { header: 'Category', accessorKey: 'category' },
            { header: 'Color', accessorKey: 'color' },
            { header: 'Size', accessorKey: 'size' },
            {
                header: 'Actions',
                cell: ({ row }: any) => (
                    <button className="text-red-500" onClick={() => handleRemoveSku(row.original.sku)}>
                        Remove
                    </button>
                ),
            },
        ],
        [skuSearchData],
    )

    const initialValue: any = {}

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
            sendFilterData(lastElement ?? '')
            return updatedFilters
        })
    }

    const sendFilterData = async (filterData: any) => {
        const formData = new FormData()

        if (filterData && filterData.length > 0) {
            formData.append('filter_data', JSON.stringify(filterData))
        } else {
            formData.append('filter_data', '')
        }

        if (csvFile && csvFile.length > 0) {
            formData.append('skus', csvFile[0])
        } else {
            formData.append('skus', '')
        }
        if (skuList && skuList.length > 0) {
            formData.append('barcodes', skuList.join(','))
        } else {
            formData.append('barcodes', '')
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
        console.log('start')
        const imageUpload = values.imageList ? await handleimage('product', values.imageList) : null
        console.log('before body')
        const body = {
            apply_offer_type: values?.apply_offer_type || '',
            apply_price_type: values?.apply_price_type || '',
            code: values?.code || '',
            days: values?.days?.length ? values.days : '',
            description: values?.description || '',
            min_amount: values?.min_amount || 0,
            min_quantity: values?.min_quantity || 0,
            name: values?.name || '',
            offer_value: values?.offer_value || '',
            quantity_x: values?.min_quantity || 0,
            start_date: values?.start_date || '',
            end_date: values?.end_date || '',
            upto_off: values?.upto_off || 0,
            offer_type: values?.offer_type || '',
            extra_attributes: {
                image: imageUpload || '',
            },
            // skus: skuList?.length ? skuList.join(',') : '',
            filter_id: filterId || '',
            store: values?.store_code || '',
        }
        console.log('make api')
        try {
            const response = await axioisInstance.post(`/offers`, body)
            notification.success({
                message: response?.data?.message || 'Successfully added offer',
            })
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || error?.response?.message || 'Failed to add offer',
            })
            console.error(error)
        }
    }

    return (
        <div>
            <h3 className="mb-5 from-neutral-900 font-semibold">Add Offers</h3>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
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
                            editMode={false}
                            handleAddSku={handleAddSku}
                            skuSearchData={skuSearchData}
                            columns={columns}
                            skuInput={skuInput}
                            setSkuInput={setSkuInput}
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

export default AddOfferEngine
