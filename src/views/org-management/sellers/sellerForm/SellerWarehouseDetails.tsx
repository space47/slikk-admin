/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem } from '@/components/ui'
import { Input } from 'antd'
import { Field } from 'formik'
import React from 'react'
import { SellerWarehouseArray } from '../sellerUtils/sellerFormCommon'
import RichTextCommon from '@/common/RichTextCommon'
import FormUploadFile from '@/common/FormUploadFile'

interface props {
    isEdit?: boolean
    values?: any
}

const SellerWarehouseDetails = ({ isEdit, values }: props) => {
    return (
        <div className="w-full">
            <h4>POC Details</h4>
            <p>Provide essential details about vendor entity. All field marked with * are mandatory</p>
            <FormContainer className="mt-8 grid grid-cols-2 gap-2">
                {SellerWarehouseArray?.map((item, idx) => {
                    return (
                        <FormItem key={idx} label={item?.label} asterisk={item?.isRequired}>
                            <Field
                                type={item?.type}
                                name={item?.name}
                                placeholder={`Enter ${item?.label}`}
                                component={item?.type === 'checkbox' ? Checkbox : Input}
                            />
                        </FormItem>
                    )
                })}
            </FormContainer>
            <RichTextCommon label="Warehouse Address" name="warehouse_address" />
            <FormUploadFile
                isEdit={isEdit}
                label="Upload GST Certificate"
                fileList={values?.gstCertificateFile}
                name="gst_certificate"
                existingFile={values?.gst_certificate}
            />
        </div>
    )
}

export default SellerWarehouseDetails
