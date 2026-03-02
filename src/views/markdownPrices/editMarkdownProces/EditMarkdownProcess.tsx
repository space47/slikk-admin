/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import MarkdownCommonForm from '../MarkdownCommonForm'
import { useParams } from 'react-router-dom'

const EditMarkdownPrices = () => {
    const { name } = useParams()
    const [filterId, setFilterId] = useState<any>()
    const [editMarkdownData, setEditMarkdownData] = useState<Record<string, string | number | boolean>>()
    const [productCsvFile, setProductCsvFile] = useState<any>()

    const fetchEditMarkdown = async (name: string) => {
        try {
            const response = await axioisInstance.get(`/product/offer/pricing?id=${name}`)
            const data = response?.data?.data
            setEditMarkdownData(data)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        if (name) {
            fetchEditMarkdown(name)
        }
    }, [name])

    const initialValue = {
        name: editMarkdownData?.name,
        start_date: editMarkdownData?.start_date,
        end_date: editMarkdownData?.end_date,
        discount_type: editMarkdownData?.discount_type,
        offer_value: editMarkdownData?.offer_value,
        apply_on: editMarkdownData?.apply_on,
        slikk_offer_contribution: editMarkdownData?.slikk_offer_contribution ?? '',
        brand_offer_contribution: editMarkdownData?.brand_offer_contribution ?? '',
    }

    useEffect(() => {
        setFilterId(editMarkdownData?.product_filter || null)
    }, [editMarkdownData])

    const handleSubmit = async (values: any) => {
        const formData = new FormData()

        // collect fields
        const fields: Record<string, any> = {
            product_filter: filterId ? JSON.stringify(filterId) : null,
            start_date: values.start_date || '',
            end_date: values.end_date || '',
            discount_type: values.discount_type || '',
            offer_value: values.offer_value || '',
            apply_on: values.apply_on || '',
            name: values.name || '',
            slikk_offer_contribution: values.slikk_offer_contribution ?? '',
            brand_offer_contribution: values.brand_offer_contribution ?? '',
        }

        Object.entries(fields).forEach(([key, value]) => {
            if (value !== null && value !== '' && value !== undefined) {
                formData.append(key, value)
            }
        })

        if (productCsvFile?.[0]) {
            formData.append('product_price_file', productCsvFile[0])
        }

        try {
            const response = await axioisInstance.patch(`/product/offer/pricing/${editMarkdownData?.id}`, formData)
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
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values }) => (
                    <Form className="w-full p-2 shadow-xl rounded-xl">
                        <FormContainer className="">
                            <MarkdownCommonForm
                                values={values}
                                filterId={filterId}
                                setFilterId={setFilterId}
                                setProductCsvFile={setProductCsvFile}
                                isEdit={true}
                            />
                        </FormContainer>
                        <Button variant="accept" type="submit" className="mt-10">
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditMarkdownPrices
