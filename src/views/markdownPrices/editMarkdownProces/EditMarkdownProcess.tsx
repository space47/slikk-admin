/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Form, Formik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import MarkdownCommonForm from '../MarkdownCommonForm'
import { FILTER_STATE } from '@/store/types/filters.types'
import { useParams } from 'react-router-dom'

const EditMarkdownPrices = () => {
    const dispatch = useAppDispatch()
    const { name } = useParams()
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const [showAddFilter, setShowAddFilter] = useState<any[]>([])
    const [filterId, setFilterId] = useState()
    const [filtersData, setFiltersData] = useState<any[]>([])
    const [editMarkdownData, setEditMarkdownData] = useState<Record<string, string | number | boolean>>()
    const [csvFile, setCsvFile] = useState<any>()

    // for sku table
    const [skuInput, setSkuInput] = useState<string>('')
    const [skuSearchData, setSkuSearchData] = useState<any[]>([])

    const fetchEditMarkdown = async () => {
        try {
            const response = await axioisInstance.get(`/product/offer/pricing?name=${name}`)
            const data = response?.data?.data?.results
            setEditMarkdownData(data[0])
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        fetchEditMarkdown()
    }, [])

    console.log('Edit data', editMarkdownData)

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

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

    useEffect(() => {
        const allSkus = skuSearchData.map((item: any) => item.barcode)
        setSkuList(allSkus)
    }, [skuSearchData])

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
        console.log('filter data is', filterData)
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

    const initialValue = {
        name: editMarkdownData?.name,
        start_date: editMarkdownData?.start_date,
        end_date: editMarkdownData?.end_date,
        discount_type: editMarkdownData?.discount_type,
        offer_value: editMarkdownData?.offer_value,
        apply_on: editMarkdownData?.apply_on,
    }

    const handleSubmit = async (values: any) => {
        const body = {
            product_filter: filterId ?? editMarkdownData?.product_filter,
            start_date: values.start_date || '',
            end_date: values.end_date || '',
            discount_type: values.discount_type || '',
            offer_value: values.offer_value || {},
            apply_on: values.apply_on || '',
            name: values.name || '',
        }
        console.log('xBody of MarkDown', filtersData)

        try {
            const response = await axioisInstance.patch(`/product/offer/pricing/${editMarkdownData?.id}`, body)
            notification.success({
                message: response?.data?.message || 'Successfully Updated',
            })
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || 'Failed to Updated',
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
                {({ values }) => (
                    <Form className="w-3/4">
                        <FormContainer className="">
                            <MarkdownCommonForm
                                handleAddFilter={handleAddFilter}
                                showAddFilter={showAddFilter}
                                handleAddFilters={handleAddFilters}
                                handleRemoveFilter={handleRemoveFilter}
                                filters={filters?.filters}
                                values={values}
                                setCsvFile={setCsvFile}
                                handleAddSku={handleAddSku}
                                skuSearchData={skuSearchData}
                                columns={columns}
                                skuInput={skuInput}
                                setSkuInput={setSkuInput}
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

export default EditMarkdownPrices
