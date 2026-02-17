/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import { buildFormData } from '@/utils/formDataBuilder'
import { Button, FormContainer, Spinner } from '@/components/ui'
import PoFormStepOne from '../poUtils/PoFormStepOne'
import { purchaseOrderService } from '@/store/services/purchaseOrderService'
import { useEffect, useMemo, useState } from 'react'
import { PurchaseOrderTable } from '@/store/types/po.types'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { notification } from 'antd'
import { getChangedFormData } from '@/utils/apiBodyUtility'
import { FaArrowCircleRight } from 'react-icons/fa'
import FormButton from '@/components/ui/Button/FormButton'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import FormUploadFile from '@/common/FormUploadFile'

const PoEdit = () => {
    const { purchase_id } = useParams()
    const navigate = useNavigate()
    const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderTable>()
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const { data, isSuccess, isError, isLoading, isFetching, error } = purchaseOrderService.usePurchaseSingleOrdersListQuery({
        order_id: purchase_id,
    })
    const commercial_approval_doc = useMemo(() => selectedCompany?.commercial_approval_doc, [selectedCompany])

    useEffect(() => {
        if (isSuccess) {
            setPurchaseOrder(data?.data)
        }
        if (isError) {
            const errorMessage = getApiErrorMessage(error) || 'Failed to Load Data'
            notification.error({ message: errorMessage })
        }
    }, [isSuccess, isError, error])

    const initialValue = {
        special_terms: purchaseOrder?.special_terms,
        order_billing_entity: purchaseOrder?.order_billing_entity,
        order_billing_address: purchaseOrder?.order_billing_address,
        order_shipping_address: purchaseOrder?.order_shipping_address,
        commercial_terms: purchaseOrder?.commercial_terms,
        payment_terms: purchaseOrder?.payment_terms,
        discount_sharing_applicable: purchaseOrder?.discount_sharing_applicable,
        state_code: purchaseOrder?.state_code,
        expected_delivery_date: purchaseOrder?.expected_delivery_date,
        po_nature: purchaseOrder?.po_nature,
        store: purchaseOrder?.store,
        warehouse_id: purchaseOrder?.warehouse_id,
        payment_mode: purchaseOrder?.payment_mode,
        vendor_address: purchaseOrder?.vendor_address,
    }

    const handleSubmit = async (values: any) => {
        try {
            const payload = {
                store: values.store,
                order_billing_entity: values.order_billing_entity,
                order_billing_address: values.order_billing_address,
                order_shipping_address: values.order_shipping_address,
                payment_terms: values.payment_terms,
                discount_sharing_applicable: values.discount_sharing_applicable,
                special_terms: values.special_terms,
                state_code: values.state_code,
                warehouse_id: values?.warehouse_id?.id,
                expected_delivery_date: values.expected_delivery_date,
                po_nature: values.po_nature,
                payment_mode: values?.payment_mode,
            }

            const formData = buildFormData(payload)
            if (!commercial_approval_doc && values?.commercial_terms?.length > 0) {
                formData.append('commercial_terms', values.commercial_terms[0])
            }
            const filteredBody = getChangedFormData(formData, initialValue)

            if (selectedCompany) {
                filteredBody.append('company', selectedCompany?.id?.toString())
            }

            const res = await axioisInstance.patch(`/merchant/purchase/order`, filteredBody)

            successMessage(res)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold tracking-wide text-gray-800">Edit Purchase Order</h2>

                <Button
                    variant="twoTone"
                    color="blue"
                    onClick={() => navigate(`/app/po/orderItems/${purchase_id}`)}
                    icon={<FaArrowCircleRight />}
                >
                    Go to Order Items
                </Button>
            </div>

            <div>
                {isLoading ||
                    (isFetching && (
                        <div className="flex items-center justify-center mt-10">
                            <Spinner size={30} />
                        </div>
                    ))}
            </div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values }) => (
                    <Form className=" w-full p-5 bg-gray-50 rounded-xl shadow-xl ">
                        <FormContainer>
                            <PoFormStepOne />
                            {!commercial_approval_doc && (
                                <>
                                    <FormUploadFile
                                        asterisk
                                        label="Upload PAN Copy"
                                        fileList={(values as any)?.commercialFile}
                                        name="commercial_terms"
                                        existingFile={values?.commercial_terms}
                                    />
                                </>
                            )}
                            <FormButton value="Submit" />
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default PoEdit
