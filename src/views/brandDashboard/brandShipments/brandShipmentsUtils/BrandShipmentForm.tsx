/* eslint-disable @typescript-eslint/no-explicit-any */
import FullDateForm from '@/common/FullDateForm'
import RichTextCommon from '@/common/RichTextCommon'
import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { Field } from 'formik'
import React, { useMemo } from 'react'
import { FaBox, FaFileAlt } from 'react-icons/fa'
import { IoLocation } from 'react-icons/io5'
import { Address_Detail, Package_Detail, Shipment_Information } from './brandShipmentsCommon'
import FormUploadFile from '@/common/FormUploadFile'
import CommonAccordion from '@/common/CommonAccordion'
import { ShipmentItems } from '@/store/types/shipment.types'

interface Props {
    values: any
    isEdit?: boolean
    noBulk?: boolean
    shipmentData?: ShipmentItems[] | undefined
    handleDeleteItems?: () => void
}

const BrandShipmentForm: React.FC<Props> = ({ values, isEdit, noBulk = false, shipmentData, handleDeleteItems }) => {
    const isShipmentItemsAvailable = useMemo(() => {
        return isEdit && !noBulk && (shipmentData?.length ?? 0) > 0
    }, [shipmentData, isEdit, noBulk])

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
                                <FullDateForm
                                    noTime
                                    key={key}
                                    fieldname={item.name}
                                    label={item.label}
                                    name={item.name}
                                    customCss="w-full h-[40px]"
                                />
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
            <div className="shadow-xl p-3 rounded-2xl border-l-4 border-yellow-600">
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

                    {isShipmentItemsAvailable ? (
                        <div className="flex flex-col items-center justify-center gap-2">
                            <h5>Shipment Item Already Exists</h5>
                            <p>You need to clear the items to upload new items</p>
                            <Button type="button" variant="reject" size="sm" onClick={handleDeleteItems}>
                                Clear Shipments
                            </Button>
                        </div>
                    ) : (
                        !noBulk && (
                            <FormUploadFile
                                sampleFile="https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/shipment+items/sample_shipment_items.csv"
                                fileList={values.csvArray}
                                label="Upload Shipment Items File"
                                name="csvArray"
                                isEdit={isEdit}
                                existingFile=""
                            />
                        )
                    )}
                </CommonAccordion>
            </div>

            <div className="shadow-xl p-3 rounded-2xl border-l-4 border-yellow-600">
                <CommonAccordion
                    header={
                        <div className="mb-5 flex gap-3 items-center">
                            <span className="p-2 bg-yellow-100 rounded-xl">
                                <FaBox className=" text-2xl text-yellow-600" />
                            </span>
                            <h5>Other Files</h5>
                        </div>
                    }
                >
                    {/* Invoice url */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 ">
                        <FormUploadFile
                            isEdit
                            fileList={values.invoiceDoc}
                            label="Invoice Document"
                            name="invoice_url"
                            existingFile={isEdit && values.invoice_url}
                            // sampleFile="https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/shipment+items/sample_shipment_items.csv"
                        />
                        <FormUploadFile
                            isEdit
                            fileList={values.itemsArray}
                            label="Upload Supporting Doc"
                            name="document"
                            existingFile={isEdit && values.document}
                            // sampleFile="https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/shipment+items/sample_shipment_items.csv"
                        />
                        <FormUploadFile
                            isEdit
                            fileList={values.awbDoc}
                            label="AWB Document"
                            name="awb_url"
                            existingFile={isEdit && values.awb_url}
                            // sampleFile="https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/shipment+items/sample_shipment_items.csv"
                        />
                        <FormUploadFile
                            isEdit
                            fileList={values.deliveryChalanDOc}
                            label="Delivery Chalan"
                            name="delivery_chalan"
                            existingFile={isEdit && values.delivery_chalan}
                            // sampleFile="https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/shipment+items/sample_shipment_items.csv"
                        />
                    </div>
                </CommonAccordion>
            </div>
        </>
    )
}

export default BrandShipmentForm
