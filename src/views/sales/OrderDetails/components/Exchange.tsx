/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dialog, FormItem, Spinner } from '@/components/ui'
import React, { useEffect, useMemo, useState } from 'react'

import { productService } from '@/store/services/productService'
import { ProductTypes } from '@/store/types/products.types'
import { Form, Formik } from 'formik'
import RichTextCommon from '@/common/RichTextCommon'
import EasyTable from '@/common/EasyTable'
import FormButton from '@/components/ui/Button/FormButton'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { textParser } from '@/common/textParser'
import { AxiosError } from 'axios'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { CommonOrderProduct } from '../orderList.common'

interface props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    row: CommonOrderProduct
    invoice_id: string | undefined
}

const Exchange = ({ isOpen, row, setIsOpen, invoice_id }: props) => {
    const [productDetails, setProductDetails] = useState<ProductTypes[]>([])
    const [currentBarcode, setCurrentBarcode] = useState('')
    const number = parseInt(row?.quantity as string) || 0
    const numberArray = Array.from({ length: number + 1 }, (_, i) => i)
    const SelectQuantity = numberArray?.map((item) => ({ label: item, value: item }))

    const rowId = row?.id

    const { data: productData, isLoading } = productService.useProductDataQuery(
        {
            page: 1,
            pageSize: 100,
            globalFilter: row?.name,
            currentSelectedPage: { label: 'Name', value: 'name' },
        },
        { refetchOnMountOrArgChange: true },
    )

    useEffect(() => {
        setProductDetails(productData?.data?.results || [])
    }, [productData])

    const columns = useMemo(
        () => [
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ row }: any) => {
                    const imageUrl = row?.original?.image?.split(',')[0]
                    return (
                        <>
                            <img src={imageUrl} alt="Image" className="w-24 h-20 object-cover cursor-pointer" />
                        </>
                    )
                },
            },
            { header: 'Name', accessorKey: 'name' },
            { header: 'Sku', accessorKey: 'sku' },
            { header: 'Size', accessorKey: 'size' },
            { header: 'Barcode', accessorKey: 'barcode' },
            {
                header: 'Select',
                accessorKey: 'barcode',
                cell: ({ row }: any) => {
                    return (
                        <Button type="submit" variant="blue" onClick={() => setCurrentBarcode(row?.original?.barcode)}>
                            Add
                        </Button>
                    )
                },
            },
        ],
        [],
    )

    const handleSubmit = async (values: any) => {
        const reasonText = textParser(values?.return_reason) || ''
        const body = {
            return_type: 'EXCHANGE',
            return_reason: {
                rowId: reasonText,
            },
            exchange_items: [
                {
                    order_item_id: rowId,
                    quantity: values?.selected_quantity,
                    replacement_barcode: currentBarcode,
                },
            ],
        }
        try {
            const res = await axioisInstance.patch(`/user/returnorder/${invoice_id}`, body)
            successMessage(res)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={1000} ariaHideApp={false}>
            <div className="flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Product Exchange</h2>
                </div>
                <Formik initialValues={{} as any} onSubmit={handleSubmit}>
                    {() => (
                        <Form className="flex flex-col gap-5 overflow-y-auto px-2 pr-3 custom-scrollbar">
                            <RichTextCommon label="Return Reason" name="return_reason" />
                            <CommonSelect name="selected_quantity" options={SelectQuantity} label="Select Quantity" />
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Spinner size={35} />
                                </div>
                            ) : (
                                <FormItem label="Select Product">
                                    <div className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium text-gray-800">Product Selected:</span> {currentBarcode || '—'}
                                    </div>

                                    <div className="overflow-y-auto max-h-[300px] rounded-md border border-gray-200 shadow-sm custom-scrollbar">
                                        <EasyTable overflow noPage columns={columns} mainData={productDetails} />
                                    </div>
                                </FormItem>
                            )}
                            <div className="flex justify-end pt-4 border-t border-gray-200">
                                <FormButton value="Exchange" />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Dialog>
    )
}

export default Exchange
