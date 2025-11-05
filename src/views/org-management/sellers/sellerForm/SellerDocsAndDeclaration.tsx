/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input } from '@/components/ui'
import { SellerDeclarationArray } from '../sellerUtils/sellerFormCommon'
import { Field } from 'formik'
import FormUploadFile from '@/common/FormUploadFile'
import FullDateForm from '@/common/FullDateForm'

interface Props {
    values?: any
    isEdit?: boolean
}

const SellerDocsAndDeclaration = ({ isEdit, values }: Props) => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="border-b pb-4">
                <h4 className="text-lg font-semibold text-gray-800">Documents and Declaration</h4>
                <p className="text-sm text-gray-500 mt-1">
                    Provide essential details about the vendor entity. All fields marked with <span className="text-red-500">*</span> are
                    mandatory.
                </p>
            </div>
            <FormContainer className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {SellerDeclarationArray?.map((item, idx) => (
                    <FormItem key={idx} label={item?.label} asterisk={item?.isRequired} className="flex flex-col space-y-1">
                        <Field
                            type={item?.type}
                            name={item?.name}
                            placeholder={`Enter ${item?.label}`}
                            component={item?.type === 'checkbox' ? Checkbox : Input}
                            className="!h-10"
                        />
                    </FormItem>
                ))}
            </FormContainer>
            <FullDateForm name="date" label="Date" fieldname="date" />

            {/* Upload Section */}
            <div className="border-t pt-6">
                <h5 className="text-md font-semibold text-gray-800 mb-4">Upload Documents</h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormUploadFile
                        isEdit={isEdit}
                        label="Upload Commercial Approval Document"
                        fileList={values?.commercialApprovalFile}
                        name="commercial_approval_doc"
                        existingFile={values?.commercial_approval_doc}
                    />
                    <FormUploadFile
                        isEdit={isEdit}
                        label="Upload Finalized & Approved Onboarding Document"
                        fileList={values?.approvedFile}
                        name="approved_onboarding_doc"
                        existingFile={values?.approved_onboarding_doc}
                    />
                </div>
            </div>
        </div>
    )
}

export default SellerDocsAndDeclaration
