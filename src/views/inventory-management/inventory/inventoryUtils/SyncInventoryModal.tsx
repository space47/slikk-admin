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

interface props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    storeId: number
}

const SyncInventoryModal = ({ isOpen, setIsOpen, storeId }: props) => {
    const [spinner, setSpinner] = useState(false)

    const handleSubmit = async (values: any) => {
        setSpinner(true)
        const body = {
            store_id: storeId,
            sync_type: values?.sync || 'soft',
            brand_id: values?.brand?.id || '',
            company_id: values?.companyList?.map((item: any) => item?.id)?.join(','),
            category: values?.category?.name || '',
            division: values?.division?.name || '',
            subcategory: values?.sub_categories?.name || '',
            row: values?.row || '',
            location: values?.location || '',
        }
        const filteredBody = filterEmptyValues(body)

        try {
            const res = await axioisInstance.post(`/inventory-location/sync/inventory`, filteredBody)
            successMessage(res)
            setIsOpen(false)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        } finally {
            setSpinner(false)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={800}>
            <Formik enableReinitialize initialValues={{} as any} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="h-[60vh] overflow-scroll">
                        <CommonSelect
                            name="sync"
                            label="Sync Type"
                            options={[
                                { label: 'soft', value: 'soft' },
                                { label: 'hard', value: 'hard' },
                            ]}
                        />

                        {values?.sync === 'hard' && (
                            <FormContainer className="">
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
