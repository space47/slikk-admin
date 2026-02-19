/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input, Switcher } from '@/components/ui'
import React from 'react'
import { BusinessDetails, SpOptions } from '../sellerUtils/sellerFormCommon'
import { Field } from 'formik'
import FormUploadFile from '@/common/FormUploadFile'
import RichTextCommon from '@/common/RichTextCommon'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { handleMaxInputValidation, handlePANandTANValidation } from '../sellerUtils/sellerFunctions'
import { SellerKeys } from '../sellerCommon'

interface Props {
    values?: any
    isEdit?: boolean
}

const SellerBusinessDetails = ({ isEdit, values }: Props) => {
    const inputHandlers: Record<string, (e: React.FormEvent<HTMLInputElement>) => void> = {
        tan_number: handlePANandTANValidation,
        pan_number: handlePANandTANValidation,
        gstin: (e) => handleMaxInputValidation(e, 15, false),
        cin: (e) => handleMaxInputValidation(e, 21, false),
    }
    return (
        <div className="space-y-8">
            <div className="border-b pb-4">
                <h4 className="text-lg font-semibold text-gray-800">Business Details</h4>
                <p className="text-sm text-gray-500 mt-1">
                    Provide essential details about the vendor entity. All fields marked with <span className="text-red-500">*</span> are
                    mandatory.
                </p>
            </div>

            <FormContainer className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {BusinessDetails?.map((item, idx) => (
                    <FormItem key={idx} label={item?.label} asterisk={item?.isRequired} className="flex flex-col space-y-1">
                        <Field
                            type={item?.type}
                            name={item?.name}
                            placeholder={`Enter ${item?.label}`}
                            component={item?.type === 'checkbox' ? Switcher : Input}
                            onInput={inputHandlers[item.name]}
                        />
                    </FormItem>
                ))}
            </FormContainer>
            <FormContainer className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-3">
                <CommonSelect name="sp_type" options={SpOptions()} label="Select SP Type" />
            </FormContainer>
            <RichTextCommon isRequired label="Address" name="address" />

            {/* Upload Section */}
            <div className="border-t pt-6">
                <h5 className="text-md font-semibold text-gray-800 mb-4">Upload Documents</h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormUploadFile
                        isEdit={isEdit}
                        label="Upload GST Certificate"
                        fileList={values?.gstCopyFile}
                        name={SellerKeys.GST_CERTIFICATE}
                        existingFile={values?.gst_certificate}
                    />
                    <FormUploadFile
                        asterisk
                        isEdit={isEdit}
                        label="Upload PAN Copy"
                        fileList={values?.panCopyFile}
                        name={SellerKeys.PAN_COPY}
                        existingFile={values?.pan_copy}
                    />
                    <FormUploadFile
                        isEdit={isEdit}
                        label="Upload TAN Copy"
                        fileList={values?.tanCopyFile}
                        name={SellerKeys.PAN_COPY}
                        existingFile={values?.tan_copy}
                    />
                    <FormUploadFile
                        isEdit={isEdit}
                        label="PF Declaration Doc"
                        fileList={values?.pd_doc_file}
                        name={SellerKeys.PF_DECLARATION_DOC}
                        existingFile={values?.pf_declaration_doc}
                    />
                    <FormUploadFile
                        isEdit={isEdit}
                        label="Trade Mark Certificate"
                        fileList={values?.trade_mark_file}
                        name={SellerKeys.TRADE_MARK_CERTIFICATE}
                        existingFile={values?.trade_mark_certificate}
                    />
                </div>
            </div>
        </div>
    )
}

export default SellerBusinessDetails
