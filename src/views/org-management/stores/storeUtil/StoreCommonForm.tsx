/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, FormContainer, FormItem, Input, Switcher, Upload } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { StoreOption, StoreTypes } from '../commonStores'
import { beforeUpload } from '@/common/beforeUpload'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import RichTextCommon from '@/common/RichTextCommon'
import { FaStore, FaImage, FaMapMarkerAlt, FaExchangeAlt, FaUser, FaFileAlt } from 'react-icons/fa'
import CommonAccordion from '@/common/CommonAccordion'
import AddRiderMap from '@/views/slikkLogistics/riderDetails/AddRiders/AddRiderMap'

interface props {
    imagview: string[]
    values: any
    handleAddress: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleReturnAddress: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleCheckbox: () => void
    address: any
    returnAddress: any
    setFieldValue: any
}

const StoreCommonForm = ({
    imagview,
    values,
    handleAddress,
    handleCheckbox,
    handleReturnAddress,
    address,
    returnAddress,
    setFieldValue,
}: props) => {
    return (
        <div className="space-y-6">
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <FaStore className="text-blue-600 text-xl" />
                    <h2 className="text-lg font-semibold text-gray-800">Store Basic Information</h2>
                </div>

                <FormContainer>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem asterisk label="Code">
                            <Field type="text" name="code" component={Input} className="w-full" />
                        </FormItem>
                        <FormItem asterisk label="Name">
                            <Field type="text" name="name" component={Input} className="w-full" />
                        </FormItem>

                        <CommonSelect name="type" label="Store Type" options={StoreOption} className="w-full" />

                        <FormItem label="GSTIN">
                            <Field name="gstin" component={Input} className="w-full" />
                        </FormItem>
                        <div className="flex items-center gap-6">
                            <FormItem label="FulFillment Center" className="mb-0">
                                <Field name="is_fulfillment_center" type="checkbox" component={Switcher} />
                            </FormItem>
                            <FormItem label="Volumetric Store" className="mb-0">
                                <Field name="is_volumetric_store" type="checkbox" component={Switcher} />
                            </FormItem>
                        </div>
                    </div>
                </FormContainer>
            </section>

            {/* Store Description Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <FaFileAlt className="text-purple-600 text-xl" />
                    <h2 className="text-lg font-semibold text-gray-800">Store Details</h2>
                </div>
                <div className="space-y-6">
                    <div className="border-l-4 border-purple-100 pl-4">
                        <RichTextCommon label="Instruction" name="instruction" />
                    </div>
                    <div className="border-l-4 border-blue-100 pl-4">
                        <RichTextCommon label="Description" name="description" />
                    </div>
                </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <FaImage className="text-amber-600 text-xl" />
                    <h2 className="text-lg font-semibold text-gray-800">Store Images</h2>
                </div>

                <FormContainer>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">Current Images</h3>
                            {imagview && imagview.length > 0 ? (
                                <div className="flex flex-wrap gap-4">
                                    {imagview.map((img, index) => (
                                        <div key={index} className="relative w-32 h-32">
                                            <img
                                                src={img}
                                                alt={`Store ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg border border-gray-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                    <FaImage className="text-gray-400 text-3xl mx-auto mb-2" />
                                    <p className="text-gray-500">No images uploaded yet</p>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-6">
                            <FormItem label="Add New Images" className="mb-0">
                                <Field name="images_array">
                                    {({ form }: FieldProps<StoreTypes>) => (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                                            <Upload
                                                beforeUpload={beforeUpload}
                                                fileList={values.images_array}
                                                onChange={async (files) => {
                                                    form.setFieldValue('images_array', files)
                                                }}
                                                onFileRemove={(files) => form.setFieldValue('images_array', files)}
                                                showList={false}
                                                className="w-full"
                                            />
                                            <p className="text-sm text-gray-500 mt-3 text-center">Click or drag images to upload</p>
                                        </div>
                                    )}
                                </Field>
                            </FormItem>
                        </div>
                    </div>
                </FormContainer>
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <FaMapMarkerAlt className="text-green-600 text-xl" />
                    <h2 className="text-lg font-semibold text-gray-800">Store Address</h2>
                </div>

                <FormContainer>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem asterisk label="Area">
                            <Field
                                type="text"
                                name="area"
                                value={address.area}
                                onChange={handleAddress}
                                component={Input}
                                className="w-full"
                            />
                        </FormItem>
                        <FormItem asterisk label="Pincode">
                            <Field
                                type="text"
                                name="pincode"
                                value={address.pincode}
                                onChange={handleAddress}
                                component={Input}
                                className="w-full"
                            />
                        </FormItem>
                        <FormItem asterisk label="City">
                            <Field
                                type="text"
                                name="city"
                                value={address.city}
                                onChange={handleAddress}
                                component={Input}
                                className="w-full"
                            />
                        </FormItem>
                        <FormItem asterisk label="State">
                            <Field
                                name="state"
                                type="text"
                                value={address.state}
                                onChange={handleAddress}
                                component={Input}
                                className="w-full"
                            />
                        </FormItem>
                    </div>
                </FormContainer>
            </section>

            {/* Return Address Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <FaExchangeAlt className="text-red-600 text-xl" />
                    <h2 className="text-lg font-semibold text-gray-800">Return Address</h2>
                </div>

                <FormContainer>
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <FormItem label="Use same as store address" className="mb-0">
                            <Field name="return_area" component={Checkbox} onClick={handleCheckbox}>
                                <span className="text-gray-700">Use same address as above for returns</span>
                            </Field>
                        </FormItem>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem asterisk label="Return Area">
                            <Field
                                type="text"
                                name="return_area"
                                value={returnAddress.return_area}
                                onChange={handleReturnAddress}
                                component={Input}
                                className="w-full"
                            />
                        </FormItem>
                        <FormItem asterisk label="Return Pincode">
                            <Field
                                type="text"
                                name="return_pincode"
                                value={returnAddress.return_pincode}
                                onChange={handleReturnAddress}
                                component={Input}
                                className="w-full"
                            />
                        </FormItem>
                        <FormItem asterisk label="Return City">
                            <Field
                                type="text"
                                name="return_city"
                                value={returnAddress.return_city}
                                onChange={handleReturnAddress}
                                component={Input}
                                className="w-full"
                            />
                        </FormItem>
                        <FormItem asterisk label="Return State">
                            <Field
                                name="return_state"
                                type="text"
                                value={returnAddress.return_state}
                                onChange={handleReturnAddress}
                                component={Input}
                                className="w-full"
                            />
                        </FormItem>
                    </div>
                </FormContainer>
            </section>
            <div className="pl-4 border-l-4 border-red-500 bg-gray-50 rounded-lg p-6">
                <CommonAccordion header={<h3 className="text-lg font-bold text-red-700 mb-6">Select Store Location</h3>}>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <Input
                            name="latitude"
                            type="number"
                            value={values.latitude}
                            placeholder="Latitude"
                            onChange={(e) => setFieldValue('latitude', Number(e.target.value))}
                        />
                        <Input
                            name="longitude"
                            type="number"
                            value={values.longitude}
                            placeholder="Longitude"
                            onChange={(e) => setFieldValue('longitude', Number(e.target.value))}
                        />
                    </div>
                    <AddRiderMap
                        setMarkLat={(lat) => setFieldValue('latitude', lat)}
                        setMarkLong={(lng) => setFieldValue('longitude', lng)}
                        markLat={(values?.latitude as number) || 0}
                        markLong={(values?.longitude as number) || 0}
                    />
                </CommonAccordion>
            </div>
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <FaUser className="text-indigo-600 text-xl" />
                    <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
                </div>

                <FormContainer>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormItem label="Contact Number">
                            <Field name="contactNumber" type="text" component={Input} className="w-full" />
                        </FormItem>
                        <FormItem label="Point of Contact (POC)">
                            <Field name="poc" component={Input} className="w-full" />
                        </FormItem>
                        <FormItem label="POC Designation">
                            <Field name="poc_designation" component={Input} className="w-full" />
                        </FormItem>
                    </div>
                </FormContainer>
            </section>

            {/* Form Actions Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <FormContainer className="flex justify-end">
                    <div className="flex items-center gap-4">
                        <Button variant="solid" type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white">
                            Submit Store Details
                        </Button>
                    </div>
                </FormContainer>
            </section>
        </div>
    )
}

export default StoreCommonForm
