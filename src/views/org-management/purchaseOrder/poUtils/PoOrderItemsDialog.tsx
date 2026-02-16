/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dialog, FormContainer, FormItem, Input, Switcher } from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { PoOrderItemsArray } from './poFormCommon'
import { PurchaseOrderItem } from '@/store/types/po.types'
import { purchaseOrderService } from '@/store/services/purchaseOrderService'

interface Props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    handleSubmit: any
    edit?: boolean
    currentRow?: PurchaseOrderItem
}

const PoOrderItemsDialog = ({ isOpen, setIsOpen, handleSubmit, edit, currentRow }: Props) => {
    const [item, setItems] = useState<PurchaseOrderItem>()
    const { data, isSuccess } = purchaseOrderService.useOrderItemSingleDataQuery(
        { item_id: currentRow?.id as number },
        { skip: !currentRow?.id },
    )

    useEffect(() => {
        if (isSuccess) {
            setItems(data?.data)
        }
    }, [isSuccess, data])

    const initialValues = {
        order: item?.order ?? 0,
        product: item?.product ?? 0,

        supplier_mrp: item?.supplier_mrp ?? 0,

        quantity: item?.quantity ?? 0,
        available_quantity: item?.available_quantity ?? 0,
        fulfilled_quantity: item?.fulfilled_quantity ?? 0,
        pending_quantity: item?.pending_quantity ?? 0,

        uom: item?.uom ?? '',

        stock_correction_percentage: item?.stock_correction_percentage ?? 0,

        item_value: item?.item_value ?? 0,

        tax_percentage: item?.tax_percentage ?? 0,
        tax_amount: item?.tax_amount ?? 0,

        total_value: item?.total_value ?? 0,
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={1600} height={'80vh'}>
            <div className="flex flex-col h-full">
                <div className="px-5 py-3 border-b bg-white">
                    <h2 className="text-lg font-semibold">{edit ? 'Edit Item' : 'Add Item'}</h2>
                </div>
                <Formik initialValues={edit ? initialValues : {}} onSubmit={handleSubmit} enableReinitialize>
                    {(formik) => (
                        <>
                            <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50">
                                <Form className="space-y-6">
                                    <FormContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5">
                                        {PoOrderItemsArray?.map((field, idx) => (
                                            <FormItem
                                                key={idx}
                                                label={field.label}
                                                asterisk={field.is_required}
                                                className="bg-white p-3 rounded-xl shadow-sm"
                                            >
                                                <Field
                                                    type={field.type}
                                                    name={field.name}
                                                    placeholder={`Enter ${field.label}`}
                                                    component={field.type === 'checkbox' ? Switcher : Input}
                                                />
                                            </FormItem>
                                        ))}
                                    </FormContainer>
                                </Form>
                            </div>
                            <div className="px-5 py-3 border-t bg-white flex justify-end gap-3 sticky bottom-0">
                                <Button variant="plain" size="sm" type="button" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>

                                <Button variant="blue" size="sm" type="button" onClick={() => formik.submitForm()}>
                                    Submit
                                </Button>
                            </div>
                        </>
                    )}
                </Formik>
            </div>
        </Dialog>
    )
}

export default PoOrderItemsDialog
