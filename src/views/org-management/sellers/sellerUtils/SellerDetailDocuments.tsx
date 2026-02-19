/* eslint-disable @typescript-eslint/no-explicit-any */
import FormUploadFile from '@/common/FormUploadFile'
import { VendorDetails } from '@/store/types/vendor.type'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { Formik } from 'formik'
import React from 'react'
import { SellerKeys } from '../sellerCommon'

interface Props {
    sellerData: VendorDetails
    refetch: any
    setEditingSection: (x: string | null) => void
    id: string | number
}

const SellerDetailDocuments: React.FC<Props> = ({ sellerData, refetch, setEditingSection, id }) => {
    const handleDocumentUpdate = async (values: Record<string, any>) => {
        const body = new FormData()

        const appendIfFile = (key: string, value: any) => {
            if (value && Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
                body.append(key, value[0])
            }
        }

        appendIfFile(SellerKeys.PAN_COPY, values.pan_copy)
        appendIfFile(SellerKeys.GST_CERTIFICATE, values.gst_certificate)
        appendIfFile(SellerKeys.CANCELLED_CHEQUE, values.cancelled_cheque)
        appendIfFile(SellerKeys.MSME_CERTIFICATE, values.msme_certificate)
        appendIfFile(SellerKeys.TAN_COPY, values.tan_copy)
        appendIfFile(SellerKeys.PF_DECLARATION_DOC, values.pf_declaration_doc)
        appendIfFile(SellerKeys.TRADE_MARK_CERTIFICATE, values.trade_mark_certificate)

        try {
            const res = await axioisInstance.patch(`/merchant/company/${id}`, body)
            notification.success({
                message: res?.data?.message || 'Documents updated successfully',
            })
            refetch()
            setEditingSection(null)
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error.message })
            }
        }
    }

    return (
        <Formik
            initialValues={{
                pan_copy: sellerData?.pan_copy || '',
                tan_copy: sellerData?.tan_copy || '',
                pf_declaration_doc: sellerData?.pf_declaration_doc || '',
                trade_mark_certificate: sellerData?.trade_mark_certificate || '',
                gst_certificate: sellerData?.gst_certificate || '',
                cancelled_cheque: sellerData?.cancelled_cheque || '',
                msme_certificate: sellerData?.msme_certificate || '',
                panCopyFile: [],
                tanCopyFile: [],
                pd_doc_file: [],
                trade_mark_file: [],
                gstCertificateFile: [],
                cancelledChequeFile: [],
                msmeCertificateFile: [],
            }}
            onSubmit={handleDocumentUpdate}
        >
            {({ values, handleSubmit }) => (
                <form id="document-form" onSubmit={handleSubmit} className="space-y-4">
                    <FormUploadFile
                        asterisk
                        isEdit={true}
                        label="Upload PAN Copy"
                        fileList={values?.panCopyFile}
                        name={SellerKeys.PAN_COPY}
                        existingFile={values?.pan_copy}
                    />
                    <FormUploadFile
                        asterisk
                        isEdit={true}
                        label="Upload Tan Copy"
                        fileList={values?.tanCopyFile}
                        name={SellerKeys.TAN_COPY}
                        existingFile={values?.tan_copy}
                    />
                    <FormUploadFile
                        asterisk
                        isEdit={true}
                        label="Pf Declaration Doc"
                        fileList={values?.pd_doc_file}
                        name={SellerKeys.PF_DECLARATION_DOC}
                        existingFile={values?.pf_declaration_doc}
                    />
                    <FormUploadFile
                        asterisk
                        isEdit={true}
                        label="Upload Trade Mark File"
                        fileList={values?.trade_mark_file}
                        name={SellerKeys.TRADE_MARK_CERTIFICATE}
                        existingFile={values?.trade_mark_certificate}
                    />

                    <FormUploadFile
                        asterisk
                        isEdit={true}
                        label="Upload GST Certificate"
                        fileList={values?.gstCertificateFile}
                        name={SellerKeys.GST_CERTIFICATE}
                        existingFile={values?.gst_certificate}
                    />

                    <FormUploadFile
                        asterisk
                        isEdit={true}
                        label="Upload Cancelled Cheque"
                        fileList={values?.cancelledChequeFile}
                        name={SellerKeys.CANCELLED_CHEQUE}
                        existingFile={values?.cancelled_cheque}
                    />

                    <FormUploadFile
                        asterisk
                        isEdit={true}
                        label="Upload MSME Certificate"
                        fileList={values?.msmeCertificateFile}
                        name={SellerKeys.MSME_CERTIFICATE}
                        existingFile={values?.msme_certificate}
                    />
                </form>
            )}
        </Formik>
    )
}

export default SellerDetailDocuments
