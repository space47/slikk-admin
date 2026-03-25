/* eslint-disable @typescript-eslint/no-explicit-any */
import FullDateForm from '@/common/FullDateForm'
import RichTextCommon from '@/common/RichTextCommon'
import { FormContainer, FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import React from 'react'
import { FaBox, FaFileAlt } from 'react-icons/fa'
import { IoLocation } from 'react-icons/io5'
import { Address_Detail, Package_Detail, Shipment_Information } from './brandShipmentsCommon'
import FormUploadFile from '@/common/FormUploadFile'
import CommonAccordion from '@/common/CommonAccordion'

interface Props {
    values: any
    isEdit?: boolean
    noBulk?: boolean
}

const BrandShipmentForm: React.FC<Props> = ({ values, isEdit, noBulk = false }) => {
    return (
        <>
            <div className="shadow-xl p-3 rounded-2xl border-l-4 border-blue-600">
                <CommonAccordion
                    header={
                        <div className="mb-5 flex gap-3 items-center">
                            <span className="p-2 bg-blue-100 rounded-xl">
                                <FaFileAlt className=" text-2xl text-blue-600" />
                            </span>
                            <h5>Shipment Information</h5>
                        </div>
                    }
                >
                    <FormContainer className="grid grid-cols-2 gap-2 ">
                        {Shipment_Information?.map((item, key) => {
                            return item?.type === 'dateForm' ? (
                                <FullDateForm key={key} fieldname="dispatch_date" label="Dispatch Date" name="dispatch_date" />
                            ) : (
                                <div>
                                    <FormItem key={key} label={item?.label} asterisk={item?.isRequired}>
                                        <Field name={item?.name} type={item?.type} component={Input} placeholder={`Enter ${item?.label}`} />
                                    </FormItem>
                                </div>
                            )
                        })}
                    </FormContainer>
                    <div>
                        <FormItem label="Upload Supporting Document"></FormItem>
                        <FormContainer className=" mt-5 w-full p-4 rounded-xl border  border-dotted border-blue-500 ">
                            <FormUploadFile
                                fileList={values.itemsArray}
                                label=""
                                name="itemsArray"
                                isEdit={isEdit}
                                existingFile={values.document}
                            />
                            <br />
                        </FormContainer>
                    </div>
                </CommonAccordion>
            </div>

            <div className="shadow-xl p-3 mt-5 rounded-2xl border-l-4 border-green-600">
                <CommonAccordion
                    header={
                        <div className="mb-5 flex gap-3 items-center">
                            <span className="p-2 bg-green-100 rounded-xl">
                                <IoLocation className=" text-2xl text-green-600" />
                            </span>
                            <h5>Address Details</h5>
                        </div>
                    }
                >
                    <FormContainer className="grid grid-cols-2 gap-2 ">
                        {Address_Detail?.map((item, key) => {
                            return item?.type === 'textEditor' ? (
                                <RichTextCommon label={item?.label} name={item?.name} isRequired={item?.isRequired} />
                            ) : (
                                <div>
                                    <FormItem key={key} label={item?.label} asterisk={item?.isRequired}>
                                        <Field name={item?.name} type={item?.type} component={Input} placeholder={`Enter ${item?.label}`} />
                                    </FormItem>
                                </div>
                            )
                        })}
                    </FormContainer>
                </CommonAccordion>
            </div>
            <div className="shadow-xl p-3 rounded-2xl border-l-4 mt-5 border-yellow-600">
                <CommonAccordion
                    header={
                        <div className="mb-5 flex gap-3 items-center">
                            <span className="p-2 bg-yellow-100 rounded-xl">
                                <FaBox className=" text-2xl text-yellow-600" />
                            </span>
                            <h5>Items & Package Details</h5>
                        </div>
                    }
                >
                    <FormContainer className="grid grid-cols-2 gap-2 ">
                        {Package_Detail?.map((item, key) => {
                            return (
                                <FormItem key={key} label={item?.label} asterisk={item?.isRequired}>
                                    <Field name={item?.name} type={item?.type} component={Input} placeholder={`Enter ${item?.label}`} />
                                </FormItem>
                            )
                        })}
                    </FormContainer>
                    {!noBulk && (
                        <>
                            <div className="flex  justify-between mb-2">
                                <h5>Upload Shipment Items File</h5>
                                <a
                                    className="p-2 rounded-xl bg-green-500 hover:bg-green-600 text-white no-underline"
                                    href="https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/shipment+items/sample_shipment_items.csv"
                                >
                                    Download Sample File
                                </a>
                            </div>

                            <FormUploadFile fileList={values.csvArray} label="" name="csvArray" isEdit={isEdit} existingFile={''} />
                        </>
                    )}
                </CommonAccordion>
            </div>
        </>
    )
}

export default BrandShipmentForm
