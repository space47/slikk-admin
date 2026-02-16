/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import MarkdownCommonForm from '../MarkdownCommonForm'

const AddmarkdownPrices = () => {
    const [filterId, setFilterId] = useState()
    const [productCsvFile, setProductCsvFile] = useState<any>()

    const initialValue = {}

    const handleSubmit = async (values: any) => {
        const formData = new FormData()

        const fields: Record<string, any> = {
            product_filter: filterId ? JSON.stringify(filterId) : '',
            start_date: values.start_date ?? '',
            end_date: values.end_date ?? '',
            discount_type: values.discount_type ?? '',
            offer_value: values.offer_value ?? '',
            apply_on: values.apply_on ?? '',
            name: values.name ?? '',
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
            const response = await axioisInstance.post(`/product/offer/pricing`, formData)
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
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values }) => (
                    <Form className="w-full p-2 shadow-xl rounded-xl">
                        <FormContainer className="">
                            <MarkdownCommonForm
                                values={values}
                                filterId={filterId}
                                setFilterId={setFilterId}
                                setProductCsvFile={setProductCsvFile}
                                isEdit={false}
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

export default AddmarkdownPrices
