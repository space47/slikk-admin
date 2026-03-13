/* eslint-disable @typescript-eslint/no-explicit-any */
import FormUploadFile from '@/common/FormUploadFile'
import { FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import React from 'react'

interface Props {
    isEdit: boolean
    values: any
}

const RiderKyc = ({ isEdit, values }: Props) => {
    return (
        <div className="space-y-8">
            {/* KYC DETAILS */}
            <div className="border rounded-xl p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-5">KYC Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormItem label="Aadhar Number">
                        <Field type="text" name="aadhar_number" placeholder="Enter Aadhar Number" component={Input} />
                    </FormItem>

                    <FormItem label="PAN Number">
                        <Field type="text" name="pan_number" placeholder="Enter PAN Number" component={Input} />
                    </FormItem>

                    <FormItem label="Driving License Number">
                        <Field type="text" name="driving_license_number" placeholder="Enter Driving License Number" component={Input} />
                    </FormItem>
                </div>

                {/* Upload Section */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormUploadFile
                        asterisk
                        isEdit={isEdit}
                        label="Upload Aadhar Copy"
                        fileList={values?.aadharCopy}
                        name={'aadharImage'}
                        existingFile={values?.aadharImage}
                    />

                    <FormUploadFile
                        asterisk
                        isEdit={isEdit}
                        label="Upload PAN Copy"
                        fileList={values?.panCopy}
                        name={'panImage'}
                        existingFile={values?.panImage}
                    />

                    <FormUploadFile
                        asterisk
                        isEdit={isEdit}
                        label="Upload Driving License Copy"
                        fileList={values?.dlCopy}
                        name={'dlImage'}
                        existingFile={values?.dlImage}
                    />
                </div>
            </div>

            {/* BANK DETAILS */}
            <div className="border rounded-xl p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-5">Bank Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormItem label="Account Number">
                        <Field type="text" name="bank_details.account_number" placeholder="Enter Account Number" component={Input} />
                    </FormItem>

                    <FormItem label="Bank Name">
                        <Field type="text" name="bank_details.bank_name" placeholder="Enter Bank Name" component={Input} />
                    </FormItem>

                    <FormItem label="IFSC Code">
                        <Field type="text" name="bank_details.ifsc" placeholder="Enter IFSC Code" component={Input} />
                    </FormItem>
                </div>
            </div>
        </div>
    )
}

export default RiderKyc
