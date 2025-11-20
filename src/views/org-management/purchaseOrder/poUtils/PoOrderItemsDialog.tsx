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
    const { data, isSuccess } = purchaseOrderService.useOrderItemSingleDataQuery({ item_id: currentRow?.id as number }, { skip: !edit })

    useEffect(() => {
        if (isSuccess) {
            setItems(data)
        }
    }, [isSuccess, data])

    const initialValues = {
        vendor_sku: item?.vendor_sku ?? '',
        slikk_sku: item?.slikk_sku ?? '',
        style_code: item?.style_code ?? '',
        category: item?.category ?? '',
        hsn_code: item?.hsn_code ?? '',
        supplier_mrp: item?.supplier_mrp ?? 0,
        title: item?.title ?? '',
        ean: item?.ean ?? '',
        quantity: item?.quantity ?? 0,
        fulfilled_quantity: item?.fulfilled_quantity ?? 0,
        pending_quantity: item?.pending_quantity ?? 0,
        uom: item?.uom ?? '',
        size: item?.size ?? '',
        stock_correction_percentage: item?.stock_correction_percentage ?? 0,
        item_value: item?.item_value ?? 0,
        gv: item?.gv ?? 0,
        tax_type: item?.tax_type ?? '',
        tax_percentage: item?.tax_percentage ?? 0,
        cgst: item?.cgst ?? 0,
        sgst: item?.sgst ?? 0,
        igst: item?.igst ?? 0,
        total_value: item?.total_value ?? 0,
        order: item?.order ?? 0,
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={1000} height={'80vh'}>
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
                    <Formik initialValues={edit ? initialValues : {}} onSubmit={handleSubmit}>
                        {(formik) => (
                            <Form className="space-y-6">
                                <FormContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {PoOrderItemsArray?.map((item, idx) => (
                                        <FormItem key={idx} label={item?.label} asterisk={item?.is_required}>
                                            <Field
                                                type={item?.type}
                                                name={item?.name}
                                                placeholder={`Enter ${item?.label}`}
                                                component={item?.type === 'checkbox' ? Switcher : Input}
                                            />
                                        </FormItem>
                                    ))}
                                </FormContainer>

                                <div className="border-t bg-white py-3 px-4 flex justify-end gap-3">
                                    <Button variant="plain" size="sm" type="button" onClick={() => setIsOpen(false)}>
                                        Cancel
                                    </Button>

                                    <Button variant="blue" size="sm" type="button" onClick={() => formik.submitForm()}>
                                        Submit
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </Dialog>
    )
}

export default PoOrderItemsDialog
