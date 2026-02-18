/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input, Switcher, Button } from '@/components/ui'
import { Field, FieldArray, useFormikContext } from 'formik'
import React from 'react'
import FormUploadFile from '@/common/FormUploadFile'
import RichTextCommon from '@/common/RichTextCommon'
import { FaTrash } from 'react-icons/fa'

interface Props {
    isEdit?: boolean
    values?: any
}

const EXCLUDED_FIELDS = ['id', 'company', 'create_date', 'update_date']

const DEFAULT_WAREHOUSE = {
    warehouse_name: '',
    gstin: '',
    poc_name: '',
    poc_email: '',
    poc_contact_number: '',
    warehouse_address: '',
    gst_certificate: '',
    is_active: true,
}

const makeNewWarehouse = () => ({ ...DEFAULT_WAREHOUSE })

const SellerWarehouseDetails = ({ isEdit }: Props) => {
    const formik = useFormikContext<any>()
    const gstDetailsLive = formik?.values?.gst_details ?? []

    return (
        <div className="w-full">
            <h4 className="text-xl font-semibold mb-1">Warehouse Details</h4>
            <p className="text-gray-600 mb-4">Provide essential details about vendor entity. All fields marked with * are mandatory.</p>

            <FieldArray name="gst_details">
                {(arrayHelpers) => {
                    const { push, remove } = arrayHelpers
                    const list = gstDetailsLive

                    return (
                        <FormContainer>
                            {list && list.length ? (
                                list.map((warehouse: any, index: number) => (
                                    <div
                                        key={warehouse._id ?? index}
                                        className="border border-gray-200 rounded-2xl p-6 my-6 shadow-md bg-white transition hover:shadow-lg"
                                    >
                                        <div className="mb-4 flex justify-between items-center">
                                            <h5 className="text-lg font-semibold text-gray-800">
                                                <span className="text-blue-600">
                                                    {warehouse?.warehouse_name || `Warehouse ${index + 1}`}
                                                </span>
                                            </h5>

                                            {list.length > 1 && (
                                                <Button type="button" variant="reject" size="sm" onClick={() => remove(index)}>
                                                    <FaTrash className="text-xl text-white" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries({ ...DEFAULT_WAREHOUSE, ...warehouse })
                                                .filter(
                                                    ([key]) =>
                                                        !EXCLUDED_FIELDS.includes(key) &&
                                                        key !== 'gst_certificate' &&
                                                        key !== 'warehouse_address',
                                                )
                                                .map(([key, value], idx) => {
                                                    const label = key
                                                        .split('_')
                                                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                                                        .join(' ')
                                                    const isCheckbox = typeof value === 'boolean' || key === 'is_active'

                                                    return (
                                                        <FormItem key={idx} label={label}>
                                                            <Field
                                                                type={isCheckbox ? 'checkbox' : 'text'}
                                                                name={`gst_details.${index}.${key}`}
                                                                placeholder={`Enter ${label}`}
                                                                component={isCheckbox ? Switcher : Input}
                                                            />
                                                        </FormItem>
                                                    )
                                                })}
                                        </div>
                                        <div className="mt-4">
                                            <FormItem label="">
                                                <RichTextCommon label="Warehouse Address" name={`gst_details.${index}.warehouse_address`} />
                                            </FormItem>
                                        </div>

                                        {/* GST Certificate */}
                                        <div className="mt-6">
                                            <FormUploadFile
                                                isEdit={isEdit}
                                                label="Upload GST Certificate"
                                                fileList={warehouse?.gstCertificateFile}
                                                name={`gst_details.${index}.gst_certificate`}
                                                existingFile={warehouse?.gst_certificate}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 mt-4 text-center italic">No warehouse details found.</p>
                            )}

                            {/* Add button */}
                            <div className="mt-6 text-center">
                                <Button type="button" variant="solid" color="blue-600" onClick={() => push(makeNewWarehouse())}>
                                    + Add Warehouse
                                </Button>
                            </div>
                        </FormContainer>
                    )
                }}
            </FieldArray>
        </div>
    )
}

export default SellerWarehouseDetails
