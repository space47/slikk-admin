/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dialog, FormItem, Input, Switcher } from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { PoOrderItemsArray } from './poFormCommon'
import { PurchaseOrderItem } from '@/store/types/po.types'
import { purchaseOrderService } from '@/store/services/purchaseOrderService'
import { FiEdit2, FiPlus } from 'react-icons/fi'
import { BsCheckLg } from 'react-icons/bs'
import { HiOutlineDocumentText } from 'react-icons/hi'

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
        supplier_mrp: item?.supplier_mrp ?? 0,
        sku: item?.sku,
        quantity: item?.quantity ?? 0,
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={1600} height={'80vh'}>
            <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="px-6 py-5 bg-white border-b border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-2.5 bg-blue-50 rounded-xl">
                                {edit ? <FiEdit2 className="w-5 h-5 text-blue-600" /> : <FiPlus className="w-5 h-5 text-blue-600" />}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 tracking-tight">{edit ? 'Edit Item' : 'Add New Item'}</h2>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {edit ? 'Update the item details below' : 'Fill in the information below to create a new item'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Formik
                    initialValues={edit ? initialValues : {}}
                    onSubmit={handleSubmit}
                    enableReinitialize
                    validateOnChange={false}
                    validateOnBlur={true}
                >
                    {(formik) => (
                        <>
                            <div className="flex-1 overflow-y-auto px-6 py-6">
                                <Form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {PoOrderItemsArray?.map((field, idx) => (
                                            <div
                                                key={idx}
                                                className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
                                            >
                                                <FormItem label={field.label} asterisk={field.is_required} className="p-5">
                                                    <div className="relative">
                                                        <Field
                                                            type={field.type}
                                                            name={field.name}
                                                            placeholder={`Enter ${field.label}`}
                                                            component={field.type === 'checkbox' ? Switcher : Input}
                                                            className={`
                                                    w-full px-4 py-2.5 text-gray-700 bg-gray-50 border border-gray-200 
                                                    rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                                                    focus:bg-white transition-all duration-200
                                                    ${field.type === 'checkbox' ? 'w-5 h-5' : ''}
                                                `}
                                                        />
                                                    </div>
                                                </FormItem>
                                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 rounded-b-xl"></div>
                                            </div>
                                        ))}
                                    </div>
                                    {PoOrderItemsArray?.length > 0 && (
                                        <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                            <div className="flex items-center space-x-3 text-blue-700">
                                                <HiOutlineDocumentText className="w-5 h-5" />
                                                <span className="text-sm font-medium">
                                                    {PoOrderItemsArray.length} field{PoOrderItemsArray.length !== 1 ? 's' : ''} to configure
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </Form>
                            </div>
                            <div className="px-6 py-4 bg-white border-t border-gray-200 shadow-lg">
                                <div className="flex items-center justify-end space-x-3">
                                    <Button
                                        variant="plain"
                                        size="sm"
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        variant="blue"
                                        size="sm"
                                        type="button"
                                        onClick={() => formik.submitForm()}
                                        disabled={!formik.isValid || formik.isSubmitting}
                                        className={`
                                px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 
                                hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-md hover:shadow-lg 
                                transform hover:-translate-y-0.5 transition-all duration-200
                                flex items-center space-x-2
                                ${!formik.isValid || formik.isSubmitting ? 'opacity-50 cursor-not-allowed hover:translate-y-0' : ''}
                            `}
                                    >
                                        <BsCheckLg className="w-4 h-4" />
                                        <span>{formik.isSubmitting ? 'Submitting...' : 'Submit'}</span>
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Formik>
            </div>
        </Dialog>
    )
}

export default PoOrderItemsDialog
