/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import React from 'react'
import { AccountTypeOptions, SellerBankData } from '../sellerUtils/sellerFormCommon'
import FormUploadFile from '@/common/FormUploadFile'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { handleMaxInputValidation } from '../sellerUtils/sellerFunctions'
import { SellerKeys } from '../sellerCommon'

interface Props {
    values: any
    isEdit?: boolean
}

const SellerBankDetails = ({ values, isEdit }: Props) => {
    const inputHandlers: Record<string, (e: React.FormEvent<HTMLInputElement>) => void> = {
        ifsc: (e) => handleMaxInputValidation(e, 11, false),
    }
    return (
        <div className="space-y-8 w-full">
            <div className="border-b pb-4">
                <h4 className="text-lg font-semibold text-gray-800">Bank Details</h4>
                <p className="text-sm text-gray-500 mt-1">
                    Provide banking information related to the vendor. All fields marked with <span className="text-red-500">*</span> are
                    mandatory.
                </p>
            </div>
            <FormContainer className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-5">
                {SellerBankData?.map((item, idx) => (
                    <FormItem key={idx} label={item?.label} asterisk={item?.isRequired} className="flex flex-col space-y-1">
                        <Field
                            type={item?.type}
                            name={item?.name}
                            placeholder={`Enter ${item?.label}`}
                            component={Input}
                            onInput={inputHandlers[item.name]}
                        />
                    </FormItem>
                ))}
                <CommonSelect name="account_type" options={AccountTypeOptions()} label="Account Type" />
            </FormContainer>
            <div className="border-t pt-6 w-full">
                <h5 className="text-md font-semibold text-gray-800 mb-4">Upload Documents</h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormUploadFile
                        isEdit={isEdit}
                        label="Upload Cancelled Cheque"
                        fileList={values?.cancelledChequeFile}
                        name={SellerKeys.CANCELLED_CHEQUE}
                        existingFile={values?.cancelled_cheque}
                    />
                </div>
            </div>
        </div>
    )
}

export default SellerBankDetails
