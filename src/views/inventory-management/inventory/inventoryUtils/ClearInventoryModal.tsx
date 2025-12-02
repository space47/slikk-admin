/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, FormContainer } from '@/components/ui'
import FormButton from '@/components/ui/Button/FormButton'
import { filterEmptyValues } from '@/utils/apiBodyUtility'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import InventoryActionForm from './InventoryActionForm'
import { Modal } from 'antd'

interface props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    storeId: number
}

const ClearInventoryModal = ({ isOpen, setIsOpen, storeId }: props) => {
    const [spinner, setSpinner] = useState(false)

    const handleSubmit = async (values: any, extraData?: Record<string, any>) => {
        setSpinner(true)
        const body = {
            store_id: storeId,
            brand_id: values?.brand?.id || '',
            company_id: values?.companyList?.map((item: any) => item?.id)?.join(','),
            category: values?.category?.name || '',
            subcategory: values?.sub_categories?.name || '',
            division: values?.division?.name || '',
            row: values?.row || '',
            location: values?.location || '',
            ...extraData,
        }
        const filteredBody = filterEmptyValues(body)
        try {
            const res = await axioisInstance.post(`/inventory-location/bulk/clear`, filteredBody)
            successMessage(res)
            setIsOpen(false)
        } catch (error) {
            if (error instanceof AxiosError) {
                const message = error?.response?.data?.message as string
                if (message?.toLowerCase() === 'please confirm clearing inventory location') {
                    const { total_product, total_inventory, total_inventory_sum } = error?.response?.data || {}

                    Modal.confirm({
                        title: 'Confirm  Clear',
                        content: `Are you sure you want to hard sync with total Product: ${total_product || 0}, total Inventory: ${total_inventory || 0}, and inventory sum of: ${total_inventory_sum || 0}?`,
                        okText: 'Yes',
                        cancelText: 'No',
                        onOk: () => {
                            handleSubmit(values, { confirm_clear: true })
                        },
                    })
                } else {
                    errorMessage(error)
                }
            }
        } finally {
            setSpinner(false)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={800} height={'80vh'}>
            <h4 className="text-red-500 mb-4"> Clear Inventory From Location</h4>
            <Formik enableReinitialize initialValues={{} as any} onSubmit={handleSubmit}>
                {({ setFieldValue }) => (
                    <Form className="h-[70vh] overflow-scroll">
                        <FormContainer className="h-[60vh] overflow-scroll">
                            <InventoryActionForm setFieldValue={setFieldValue} />
                        </FormContainer>
                        <FormButton isSpinning={spinner} value="Apply" />
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default ClearInventoryModal
