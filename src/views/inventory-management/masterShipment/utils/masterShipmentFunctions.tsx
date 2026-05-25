/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleimage } from '@/common/handleImage'
import { textParser } from '@/common/textParser'
import { getChangedValues } from '@/utils/apiBodyUtility'

interface Props {
    values: any
    selectedCompany: any
    isEdit: boolean
    initialValues?: any
    childShipmentId?: number[] | string[]
}

export const masterShipmentPayload = async ({ values, selectedCompany, isEdit = false, initialValues, childShipmentId }: Props) => {
    const [supportingDocumentResult, invoiceResult, awbResult, deliveryChalanResult] = await Promise.allSettled([
        values?.document?.length > 0 ? handleimage('product', values.document) : Promise.resolve(''),
        values?.invoice_url?.length > 0 ? handleimage('product', values.invoice_url) : Promise.resolve(''),
        values?.awb_url?.length > 0 ? handleimage('product', values.awb_url) : Promise.resolve(''),
        values?.delivery_chalan?.length > 0 ? handleimage('product', values.delivery_chalan) : Promise.resolve(''),
    ])

    const supportingDocumentUpload = supportingDocumentResult.status === 'fulfilled' ? supportingDocumentResult.value : ''
    const invoiceUpload = invoiceResult.status === 'fulfilled' ? invoiceResult.value : ''
    const awbUpload = awbResult.status === 'fulfilled' ? awbResult.value : ''
    const deliveryChalanUpload = deliveryChalanResult.status === 'fulfilled' ? deliveryChalanResult.value : ''
    const deliveryAddress = values?.delivery_address ? textParser(values?.delivery_address) : ''
    const originAddress = values?.origin_address ? textParser(values?.origin_address) : ''

    const body = {
        company: selectedCompany?.currCompany?.id,
        name: values?.name,
        awb_number: values?.awb_number,
        dispatch_date: values?.dispatch_date,
        delivery_date: values?.delivery_date,
        document: supportingDocumentUpload,
        invoice_url: invoiceUpload,
        awb_url: awbUpload,
        delivery_chalan: deliveryChalanUpload,
        dispatched_by: values?.dispatched_by,
        box_count: values?.box_count,
        items_count: values?.items_count,
        total_quantity: values?.total_quantity,
        total_invoice_value: values?.total_invoice_value,
        invoice_number: values?.invoice_number,
        store: values?.store?.join(','),
        shipment_id: values?.shipment_id,
        origin_address: originAddress,
        delivery_address: deliveryAddress,
        received_by: values?.received_by?.mobile,
        child_shipment_ids: childShipmentId,
    }

    if (isEdit) {
        const changedValues = getChangedValues(initialValues, body as any)
        const filterToExclude = ['awb_url', 'invoice_url', 'delivery_chalan']
        return Object.fromEntries(
            Object.entries(changedValues)
                .filter(([, value]) => !filterToExclude?.includes(value))
                .filter(([, value]) => value !== '' && value !== null && value !== undefined),
        )
    }

    return body
}
