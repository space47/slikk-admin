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
import { PoField } from '../poUtils/poFormCommon'

const normalize = (val?: string) => val?.trim().toLowerCase()

const PoEdit = () => {
    const { purchase_id, company_id } = useParams()
    const navigate = useNavigate()
    const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderTable>()
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((store) => store.company.company)
    const selectedCompany = useMemo(() => companyList.find((item) => item.id?.toString() === company_id), [company_id, companyList])
    const [loader, setLoader] = useState(false)
    const { data, isSuccess, isError, isLoading, isFetching, error } = purchaseOrderService.usePurchaseSingleOrdersListQuery(
        {
            order_id: purchase_id,
            company_id: selectedCompany?.id,
        },
        { skip: !selectedCompany?.id || !purchase_id },
    )

    const commercial_approval_doc = selectedCompany?.commercial_approval_doc

    const VendorEntity = useMemo(
        () =>
            selectedCompany?.business_nature_company_details?.map((item) => ({
                label: item?.company_name,
                value: item.code,
            })) || [],
        [selectedCompany],
    )

    useEffect(() => {
        if (isSuccess) {
            setPurchaseOrder((data?.data as any)?.results[0])
        }
        if (isError) {
            const errorMessage = getApiErrorMessage(error) || 'Failed to Load Data'
            notification.error({ message: errorMessage })
        }
    }, [isSuccess, isError, error, data?.data])

    const initialValue = useMemo(
        () => ({
            special_terms: purchaseOrder?.special_terms || '',
            order_billing_entity: purchaseOrder?.order_billing_entity || '',
            order_billing_address: purchaseOrder?.order_billing_address || '',
            order_shipping_address: purchaseOrder?.order_shipping_address || '',
            commercial_terms: purchaseOrder?.commercial_terms || '',
            payment_terms: purchaseOrder?.payment_terms || '',
            discount_sharing_applicable: 'true',
            expected_delivery_date: purchaseOrder?.expected_delivery_date || '',
            po_nature: purchaseOrder?.po_nature || '',
            store: purchaseOrder?.store || '',
            company_gst: purchaseOrder?.company_gst || '',
            payment_mode: purchaseOrder?.payment_mode || '',
            vendor_address: purchaseOrder?.vendor_address || '',
            po_expiry_date: purchaseOrder?.po_expiry_date || '',
        }),
        [purchaseOrder],
    )

    const handleSubmit = async (values: any) => {
        try {
            const vendorEntityFind = selectedCompany?.business_nature_company_details?.find(
                (item) => normalize(item.code) === normalize(values.order_billing_entity),
            )

            const stateCode = vendorEntityFind?.gstin?.slice(0, 2) || ''
            const gstin = vendorEntityFind?.gstin || ''
            const business_nature_company = vendorEntityFind?.code || ''

            const payload = {
                store: values.store,
                order_billing_entity: values[PoField.ORDER_BILLING_ENTITY],
                order_billing_address: values[PoField.ORDER_BILLING_ADDRESS],
                order_shipping_address: values[PoField.ORDER_SHIPPING_ADDRESS],
                payment_terms: values[PoField.PAYMENT_TERMS],
                special_terms: values[PoField.SPECIAL_TERMS],
                company_gst:
                    typeof values[PoField.COMPANY_GST] === 'object' ? values[PoField.COMPANY_GST]?.id : values[PoField.COMPANY_GST],
                expected_delivery_date: values[PoField.EXPECTED_DELIVERY],
                po_nature: values[PoField.PO_NATURE],
                payment_mode: values[PoField.PAYMENT_MODE],
                po_expiry_date: values[PoField.PO_EXPIRY_DATE],
                state_code: stateCode,
                gstin: gstin,
                business_nature_company: business_nature_company,
                discount_sharing_applicable: 'yes',
            }

            const formData = buildFormData(payload)

            if (!commercial_approval_doc && typeof values?.commercial_terms !== 'string' && values?.commercial_terms?.length > 0) {
                formData.append('commercial_terms', values.commercial_terms[0])
            }

            const filteredBody = getChangedFormData(formData, initialValue)

            if (selectedCompany) {
                filteredBody.append('company', selectedCompany?.id?.toString())
            }
            setLoader(true)

            const res = await axioisInstance.patch(`/merchant/purchase/order/${purchase_id}`, filteredBody)

            successMessage(res)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        } finally {
            setLoader(false)
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

            {(isLoading || isFetching) && (
                <div className="flex items-center justify-center mt-10">
                    <Spinner size={30} />
                </div>
            )}

            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values }) => {
                    const companyGstValue = typeof values.company_gst === 'object' ? (values.company_gst as any)?.id : values?.company_gst

                    const wareHouseDetails = selectedCompany?.gst_details?.find((item) => item?.id === companyGstValue)

                    return (
                        <Form className="w-full p-5 bg-gray-50 rounded-xl shadow-xl">
                            <FormContainer>
                                <PoFormStepOne
                                    VendorEntity={VendorEntity}
                                    wareHouseDetails={wareHouseDetails}
                                    businessNatureCompany={selectedCompany?.business_nature_company_details || []}
                                    values={values}
                                />

                                {!commercial_approval_doc && (
                                    <FormUploadFile
                                        asterisk
                                        label="Upload Commercial Doc Copy"
                                        fileList={(values as any)?.commercialFile}
                                        name="commercial_terms"
                                        existingFile={values?.commercial_terms}
                                    />
                                )}

                                <div className="flex items-center justify-end gap-2 mt-8">
                                    <Button
                                        variant="twoTone"
                                        color="blue"
                                        type="button"
                                        size="sm"
                                        onClick={() => navigate(`/app/po/orderItems/${purchase_id}`)}
                                        icon={<FaArrowCircleRight />}
                                    >
                                        Go to Order Items
                                    </Button>

                                    <FormButton value="Submit" isSpinning={loader} />
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default PoEdit
