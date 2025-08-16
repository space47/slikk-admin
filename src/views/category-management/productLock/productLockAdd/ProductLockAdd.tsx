/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import ProductLockCommonForm from '../productLockUtils/ProductLockCommonForm'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

const ProductAdd = () => {
    const [filterId, setFilterId] = useState<any>(null)

    const handleSubmit = async (values: any) => {
        const body = {
            product_filter: values?.filterAdd && values?.filterAdd?.length > 0 ? filterId : '',
            name: values.name || '',
            locked_by: values.locked_by || '',
            start_date: values.start_date || '',
            end_date: values.end_date || '',
        }
        const filteredBody = Object.fromEntries(Object.entries(body).filter(([, v]) => v !== ''))
        try {
            await axioisInstance.post('/product/lock/update', filteredBody)
            notification.success({
                message: 'Successfully Updated',
            })
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <div className="p-2 shadow-xl rounded-xl">
            <Formik
                enableReinitialize
                initialValues={{}}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className="w-full">
                        <h4>Add Lock Details</h4>
                        <FormContainer className="">
                            <ProductLockCommonForm values={values} isEdit={false} filterId={filterId} setFilterId={setFilterId} />
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

export default ProductAdd
