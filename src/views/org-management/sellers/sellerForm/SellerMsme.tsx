/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem } from '@/components/ui'
import { Input } from 'antd'
import { Field } from 'formik'
import FormUploadFile from '@/common/FormUploadFile'
import { SellerMsMeArray } from '../sellerUtils/sellerFormCommon'

interface props {
    isEdit?: boolean
    values?: any
}

const SellerMsme = ({ isEdit, values }: props) => {
    return (
        <div className="w-full">
            <h4>MsMe Details</h4>
            <p>Provide essential details about vendor entity. All field marked with * are mandatory</p>
            <FormContainer className="mt-8 grid grid-cols-2 gap-2">
                {SellerMsMeArray?.map((item, idx) => {
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
            <FormUploadFile
                isEdit={isEdit}
                label="Upload MSME Certificate"
                fileList={values?.msmeCertificateFile}
                name="msme_certificate"
                existingFile={values?.msme_certificate}
            />
        </div>
    )
}

export default SellerMsme
