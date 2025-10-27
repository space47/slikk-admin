/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, FormContainer } from '@/components/ui'
import FormButton from '@/components/ui/Button/FormButton'
import { filterEmptyValues } from '@/utils/apiBodyUtility'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { AxiosError } from 'axios'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import InventoryActionForm from './InventoryActionForm'
import { Modal } from 'antd'

interface Props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    storeId: number
}

const SyncInventoryModal = ({ isOpen, setIsOpen, storeId }: Props) => {
    const [spinner, setSpinner] = useState(false)

    const handleSubmit = async (values: any, extraData?: Record<string, any>) => {
        setSpinner(true)

        const body = {
            store_id: storeId,
            sync_type: values?.sync || 'soft',
            update_type: values?.update_type || '',
            brand_id: values?.brand?.id || '',
            company_id: values?.companyList?.map((item: any) => item?.id)?.join(','),
            category: values?.category?.name || '',
            division: values?.division?.name || '',
            subcategory: values?.sub_categories?.name || '',
            row: values?.row || '',
            location: values?.location || '',
            ...extraData,
        }

        const filteredBody = filterEmptyValues(body)

        try {
            const res = await axioisInstance.post(`/inventory-location/sync/inventory`, filteredBody)
            successMessage(res)
            setIsOpen(false)
        } catch (error) {
            if (error instanceof AxiosError) {
                const message = error?.response?.data?.message

                if (message === 'Please confirm hard inventory sync' || message === 'Please confirm soft inventory sync') {
                    const { total_product, total_inventory, total_inventory_sum } = error?.response?.data || {}

                    Modal.confirm({
                        title: 'Confirm Force Update',
                        content: `Are you sure you want to hard sync with total Product: ${total_product}, total Inventory: ${total_inventory}, and inventory sum of: ${total_inventory_sum}?`,
                        okText: 'Yes',
                        cancelText: 'No',
                        onOk: () => {
                            handleSubmit(values, { confirm_sync: true })
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
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={800}>
            <div className="font-bold text-green-500 text-xl">Sync Inventory</div>
            <Formik enableReinitialize initialValues={{} as any} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="h-[60vh] overflow-scroll mt-8">
                        <CommonSelect
                            name="update_type"
                            label="Select Update Type"
                            options={[
                                { label: 'add', value: 'add' },
                                { label: 'replace', value: 'replace' },
                            ]}
                        />
                        <CommonSelect
                            name="sync"
                            label="Sync Type"
                            options={[
                                { label: 'soft', value: 'soft' },
                                { label: 'hard', value: 'hard' },
                            ]}
                        />

                        {values?.sync === 'hard' && (
                            <FormContainer>
                                <InventoryActionForm setFieldValue={setFieldValue} />
                            </FormContainer>
                        )}

                        <FormButton isSpinning={spinner} value="Apply" />
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default SyncInventoryModal
