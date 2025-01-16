import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { InventoryTransferTypes } from '../transferTable/TransferTableCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Form, Formik } from 'formik'
import TransferFrom from '../TransferFrom'
import { useAppDispatch, useAppSelector } from '@/store'
import { companyStore } from '@/store/types/companyStore.types'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'

const EditTransfers = () => {
    const { document_number } = useParams()
    const [transferEditData, setTransferEditData] = useState<InventoryTransferTypes>()

    const dispatch = useAppDispatch()
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const fetchTransferEdit = async () => {
        try {
            const response = await axioisInstance.get(`/internal/inventory/transfer?document_number=${document_number}`)
            const data = response?.data?.data?.results
            setTransferEditData(data[0])
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        fetchTransferEdit()
    }, [])

    const initialValue = {
        document_number: transferEditData?.document_number,
        total_sku: transferEditData?.total_sku_count ?? 0,
    }

    const handleSubmit = async (values: any) => {
        const body = {
            date_received: values?.date_received,
            document_number: values?.document_number,
            total_quantity: values?.total_quantity,
            total_sku: values?.total_sku,
            store_code: values?.store_code?.code,
            destination_store_code: values?.destination_store_code?.code,
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

export default EditTransfers
