/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Select, Switcher, Upload } from '@/components/ui'
import { Field, FieldProps, Form } from 'formik'
import React from 'react'
import { Addresses, DocumentArray, receiveAddress } from '../inwardEdit/inwardEditCommon'
import { FormModel } from '@/views/crypto/TradeForm'
import { beforeUpload } from '@/common/beforeUpload'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import RichTextCommon from '@/common/RichTextCommon'
import { FaBuilding, FaFileUpload, FaImage, FaMapMarkerAlt, FaUser, FaEye, FaUndo, FaPaperPlane } from 'react-icons/fa'
import { GrDocument } from 'react-icons/gr'

interface Props {
    values: any
    companyList: SINGLE_COMPANY_DATA[]
    setCompanyData: (x: number) => void
    showData?: boolean
    imagview?: string[]
    datas?: any
    resetForm: any
    isEdit?: boolean
}

const InwardForm = ({ values, companyList, setCompanyData, showData, imagview, datas, resetForm, isEdit }: Props) => {
    console.log('image view', imagview)

    return (
        <Form className="w-full">
            <FormContainer>
                {/* GRN Basic Details Section */}
                <div className="bg-gradient-to-r  p-6 rounded-xl border-l-4 border-blue-500 shadow-lg mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <GrDocument className="text-2xl text-blue-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">GRN Basic Details</h4>
                    </div>

                    <FormContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {DocumentArray.map((item, key) => {
                            return (
                                <FormItem key={key} label={item.label} className="w-full">
                                    <div className="relative">
                                        <Field
                                            type={item.type}
                                            name={item?.name}
                                            placeholder={`Enter ${item.label}`}
                                            component={Input}
                                            className="pl-10"
                                        />
                                    </div>
                                </FormItem>
                            )
                        })}

                        <FormItem label="Company" className="md:col-span-2 lg:col-span-1">
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FaBuilding />
                                </div>
                                <Field name="company">
                                    {({ form }: FieldProps) => {
                                        const selectedCompany = companyList.find((option) => option.id === form.values.company)

                                        return (
                                            <Select
                                                className="w-full pl-10"
                                                options={companyList}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id?.toString()}
                                                value={selectedCompany || null}
                                                onChange={(newVal) => {
                                                    form.setFieldValue('company', newVal?.id)
                                                    setCompanyData(newVal?.id as number)
                                                }}
                                                placeholder="Select Company"
                                            />
                                        )
                                    }}
                                </Field>
                            </div>
                        </FormItem>
                    </FormContainer>
                </div>

                {/* Address Section */}
                <div className=" p-6 rounded-xl border-l-4 border-green-500 shadow-lg mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FaMapMarkerAlt className="text-2xl text-green-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">Address Details</h4>
                    </div>

                    <div className="space-y-6">
                        {receiveAddress.map((item, key) => {
                            return <RichTextCommon key={key} label={item?.label} name={item?.name} />
                        })}
                    </div>
                </div>

                {/* Receiver Details Section */}
                <div className=" p-6 rounded-xl border-l-4 border-purple-500 shadow-lg mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <FaUser className="text-2xl text-purple-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">Receiver & Quantity Details</h4>
                    </div>

                    <FormContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Addresses.map((item, key) => {
                            return (
                                <FormItem key={key} label={item.label} className="w-full">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <FaUser />
                                        </div>
                                        <Field
                                            type={item.type}
                                            name={item?.name}
                                            placeholder={`Enter ${item.label}`}
                                            component={Input}
                                            className="pl-10"
                                        />
                                    </div>
                                </FormItem>
                            )
                        })}

                        <div className="flex items-center space-x-4 md:col-span-2 lg:col-span-1">
                            <FormItem label="SLIKK OWNED" className="w-full">
                                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border border-gray-200">
                                    <Field type="checkbox" name="slikk_owned" component={Switcher} className="pl-10" />

                                    <span className="text-gray-700 font-medium">Items purchased by SLIKK</span>
                                </div>
                            </FormItem>
                        </div>
                    </FormContainer>
                </div>

                {/* Documents & Images Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Documents Upload */}
                    <div className=" p-6 rounded-xl border-l-4 border-amber-500 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <FaFileUpload className="text-2xl text-amber-600" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800">Supporting Documents</h4>
                        </div>

                        <FormContainer>
                            <FormItem>
                                <Field name="files">
                                    {({ form }: FieldProps<FormModel>) => (
                                        <div className="space-y-4">
                                            <Upload
                                                beforeUpload={beforeUpload}
                                                fileList={values.files}
                                                onChange={(files) => {
                                                    console.log('OnchangeFiles', files, values.files)
                                                    form.setFieldValue('files', files)
                                                }}
                                                onFileRemove={(files) => form.setFieldValue('files', files)}
                                                className="w-full"
                                            />
                                        </div>
                                    )}
                                </Field>
                            </FormItem>

                            {/* Show existing document in edit mode */}
                            {isEdit && showData && datas?.document && (
                                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaEye className="text-gray-500" />
                                        <span className="font-semibold text-gray-700">Current Document:</span>
                                    </div>
                                    <a
                                        href={datas.document}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 hover:underline truncate block"
                                    >
                                        {datas.document}
                                    </a>
                                </div>
                            )}

                            <FormItem label="Document URL" className="mt-6">
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <GrDocument />
                                    </div>
                                    <Field
                                        type="text"
                                        name="document"
                                        placeholder="Enter Document URL or upload file"
                                        component={Input}
                                        className="pl-10"
                                    />
                                </div>
                            </FormItem>
                        </FormContainer>
                    </div>

                    {/* Images Upload */}
                    <div className=" p-6 rounded-xl border-l-4 border-pink-500 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-pink-100 rounded-lg">
                                <FaImage className="text-2xl text-pink-600" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800">Supporting Images</h4>
                        </div>

                        <FormContainer>
                            {/* Show existing images in edit mode */}
                            {isEdit && imagview && imagview.length > 0 && (
                                <div className="mb-6">
                                    <div className="grid grid-cols-3 gap-3">
                                        {imagview?.map((img, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={img}
                                                    alt={`Supporting ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                                />
                                                <a
                                                    href={img}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100"
                                                >
                                                    <FaEye className="text-white text-lg" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <FormItem>
                                <Field name="image">
                                    {({ form }: FieldProps<FormModel>) => (
                                        <div className="space-y-4">
                                            <Upload
                                                multiple
                                                beforeUpload={beforeUpload}
                                                fileList={values.image}
                                                onChange={(files) => {
                                                    console.log('File of Image', files)
                                                    return form.setFieldValue('image', files)
                                                }}
                                                onFileRemove={(files) => form.setFieldValue('image', files)}
                                                className="w-full"
                                            />
                                        </div>
                                    )}
                                </Field>
                            </FormItem>
                        </FormContainer>
                    </div>
                </div>

                {/* Action Buttons */}

                <Button
                    type="button"
                    variant="default"
                    onClick={() => resetForm()}
                    className="flex items-center gap-2 px-6 py-2 border border-gray-300 hover:border-gray-400 transition-colors"
                >
                    <FaUndo />
                    Reset
                </Button>
                <Button
                    variant="solid"
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                    <FaPaperPlane />
                    {isEdit ? 'Update' : 'Submit'}
                </Button>
            </FormContainer>
        </Form>
    )
}

export default InwardForm
