/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import ProductLockCommonForm from '../productLockUtils/ProductLockCommonForm'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'

const ProductLockEdit = () => {
    const [initialData, setInitialData] = React.useState<any>(null)
    const [filterId, setFilterId] = React.useState<any>(null)
    const { id } = useParams()

    const query = useMemo(() => {
        return `/product/lock/update?id=${id}`
    }, [id])

    const { data } = useFetchSingleData({ url: query })

    React.useEffect(() => {
        if (data) {
            setInitialData(data)
        }
    }, [data])

    const initialValue = {
        locked_by: initialData?.locked_by || '',
        start_date: initialData?.start_date || '',
        end_date: initialData?.end_date || '',
        name: initialData?.name || '',
    }

    useEffect(() => {
        setFilterId(initialData?.product_filter || null)
    }, [initialData])

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
            await axioisInstance.patch(`/product/lock/update/${id}`, filteredBody)
            notification.success({ message: 'Successfully Updated' })
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <div className="p-2 shadow-xl rounded-xl">
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values }) => (
                    <Form className="w-full">
                        <h4>Edit Lock Details</h4>
                        <FormContainer className="">
                            <ProductLockCommonForm values={values} isEdit={true} filterId={filterId} setFilterId={setFilterId} />
                        </FormContainer>
                        <Button variant="accept" type="submit" className="mt-5">
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ProductLockEdit
