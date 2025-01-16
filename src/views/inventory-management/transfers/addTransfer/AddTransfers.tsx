/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { companyStore } from '@/store/types/companyStore.types'
import { Form, Formik } from 'formik'
import React, { useEffect } from 'react'
import TransferFrom from '../TransferFrom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

const AddTransfers = () => {
    const dispatch = useAppDispatch()
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    console.log('Storeeeeee', storeResults)

    const initialValue = {}

    const handleSubmit = async (values: any) => {
        console.log('Add Transfer', values)
        const body = {
            date_received: values?.date_received,
            document_number: values?.document_number,
            total_quantity: values?.total_quantity,
            total_sku: values?.total_sku,
            store_code: values?.store_code?.code,
            destination_store_code: values?.destination_store_code?.code,
        }

        console.log('Body is', body)
        try {
            const response = await axioisInstance.post(`/internal/inventory/transfer`, body)
            notification.success({
                message: response?.data?.message || response?.data?.data?.message || 'Successfully Added Transfers ',
            })
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to Transfers ',
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
                    <Form className="w-2/3">
                        <TransferFrom storeResults={storeResults} values={values} />
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddTransfers
