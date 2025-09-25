/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, FormContainer, FormItem, Input, Select, Upload } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { StoreOption, StoreTypes } from '../commonStores'
import { beforeUpload } from '@/common/beforeUpload'

interface props {
    companyList: any[]
    imagview: string[]
    values: any
    descriptiontextarea: any
    instructiontextarea: any
    handleInstructionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    handleAddress: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleReturnAddress: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleCheckbox: () => void
    resetForm: () => void
    address: any
    returnAddress: any
}

const StoreCommonForm = ({
    companyList,
    descriptiontextarea,
    imagview,
    instructiontextarea,
    values,
    handleAddress,
    handleCheckbox,
    handleDescriptionChange,
    handleInstructionChange,
    handleReturnAddress,
    resetForm,
    address,
    returnAddress,
}: props) => {
    return (
        <div>
            <FormContainer>
                <FormContainer className="flex flex-row gap-7 ">
                    <FormItem asterisk label="Company Id" className="col-span-1 w-1/2">
                        <Field name="company">
                            {({ form }: FieldProps<any>) => {
                                const selectedCompany = companyList.find((option) => option.id === form.values.company)

                                return (
                                    <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                        <Select
                                            isClearable
                                            className="w-full"
                                            options={companyList}
                                            getOptionLabel={(option) => option.name}
                                            getOptionValue={(option) => option.id}
                                            value={selectedCompany || null}
                                            onChange={(newVal) => {
                                                form.setFieldValue('company', newVal?.id)
                                            }}
                                        />
                                    </div>
                                )
                            }}
                        </Field>
                    </FormItem>
                    <FormItem asterisk label="Code" className="col-span-1 w-1/2">
                        <Field type="text" name="code" component={Input} onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()} />
                    </FormItem>

                    <FormItem asterisk label="Name" className="col-span-1 w-1/2">
                        <Field type="text" name="name" component={Input} onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()} />
                    </FormItem>
                </FormContainer>

                <FormContainer className="flex flex-row gap-7 ">
                    <FormItem label="Instruction" className="col-span-1 w-full">
                        <textarea
                            name="instruction"
                            value={instructiontextarea}
                            onChange={handleInstructionChange}
                            id=""
                            className="w-full border border-gray-200 rounded-lg items-center h-[200px] p-2"
                        ></textarea>
                    </FormItem>
                </FormContainer>

                {/* Image upload.................................................................. */}

                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                    <div className=" image w-[10%] h-[20%] mt-5  ">
                        {imagview && imagview.length > 0 ? (
                            imagview.map((img, index) => <img key={index} src={img} alt="img" className="rounded-xl" />)
                        ) : (
                            <p>No image</p>
                        )}
                    </div>
                    <FormContainer className="mt-5">
                        <FormItem label="ADD NEW IMAGE" className="grid grid-rows-2">
                            <Field name="images_array">
                                {({ form }: FieldProps<StoreTypes>) => (
                                    <>
                                        <Upload
                                            beforeUpload={beforeUpload}
                                            fileList={values.images_array}
                                            onChange={async (files) => {
                                                form.setFieldValue('images_array', files)
                                            }}
                                            onFileRemove={(files) => form.setFieldValue('images_array', files)}
                                            showList={false}
                                        />
                                    </>
                                )}
                            </Field>
                        </FormItem>
                        <br />
                    </FormContainer>
                </FormContainer>

                {/* Text area.................................................................. */}

                <FormContainer className="flex flex-row gap-7 ">
                    <FormItem label="Description" className="col-span-1 w-full">
                        <textarea
                            name="description"
                            value={descriptiontextarea}
                            onChange={handleDescriptionChange}
                            id=""
                            className="w-full border border-gray-200 rounded-lg items-center h-[200px] p-2"
                        ></textarea>
                    </FormItem>
                </FormContainer>

                {/*............................................................ */}

                <FormContainer className="grid grid-cols-3 ">
                    <FormItem asterisk label="Latitude" className="col-span-1 w-1/2">
                        <Field type="text" name="latitude" component={Input} />
                    </FormItem>
                    <FormItem asterisk label="Longitude" className="col-span-1 w-1/2">
                        <Field type="text" name="longitude" component={Input} />
                    </FormItem>

                    <FormItem label="Type">
                        <Field
                            name="type"
                            onKeyDown={(e: any) => {
                                e.key === 'Enter' && e.preventDefault()
                            }}
                        >
                            {({ field, form }: FieldProps<any>) => (
                                <Select
                                    field={field}
                                    className="text-black"
                                    form={form}
                                    options={StoreOption}
                                    value={StoreOption.find((option) => option.value === field.value)}
                                    onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                />
                            )}
                        </Field>
                    </FormItem>
                </FormContainer>

                {/*  */}

                <FormContainer className="flex flex-row gap-7 ">
                    <FormItem asterisk label="Area" className="col-span-1 w-1/2">
                        <Field type="text" name="area" value={address.area} onChange={handleAddress} component={Input} />
                    </FormItem>

                    <FormItem asterisk label="Pincode" className="col-span-1 w-1/2">
                        <Field type="text" name="pincode" value={address.pincode} onChange={handleAddress} component={Input} />
                    </FormItem>

                    <FormItem asterisk label="City" className="col-span-1 w-1/2">
                        <Field type="text" name="city" value={address.city} onChange={handleAddress} component={Input} />
                    </FormItem>

                    <FormItem asterisk label="State" className="col-span-1 w-1/2">
                        <Field name="state" type="text" value={address.state} onChange={handleAddress} component={Input} />
                    </FormItem>
                </FormContainer>

                {/* Return.................................................... */}
                <div className="mt-6">RETURN ORDERS</div>

                <FormItem asterisk label="Return Area" className="col-span-1 w-1/2">
                    <Field name="return_area" component={Checkbox} onClick={handleCheckbox}>
                        {' '}
                        Check to add same address as above{' '}
                    </Field>
                </FormItem>
                {/* FIELDS */}
                <FormContainer className="flex flex-row gap-7  ">
                    <FormItem asterisk label="Return Area" className="col-span-1 w-1/2">
                        <Field
                            type="text"
                            name="return_area"
                            value={returnAddress.return_area}
                            onChange={handleReturnAddress}
                            component={Input}
                        />
                    </FormItem>

                    <FormItem asterisk label="Return Pincode" className="col-span-1 w-1/2">
                        <Field
                            type="text"
                            name="return_pincode"
                            value={returnAddress.return_pincode}
                            onChange={handleReturnAddress}
                            component={Input}
                        />
                    </FormItem>

                    <FormItem asterisk label="Return City" className="col-span-1 w-1/2">
                        <Field
                            type="text"
                            name="return_city"
                            value={returnAddress.return_city}
                            onChange={handleReturnAddress}
                            component={Input}
                        />
                    </FormItem>

                    <FormItem asterisk label="Return State" className="col-span-1 w-1/2">
                        <Field
                            name="return_state"
                            type="text"
                            value={returnAddress.return_state}
                            onChange={handleReturnAddress}
                            component={Input}
                        />
                    </FormItem>
                </FormContainer>

                {/* Select boxes......................................................................... */}

                <FormContainer className="flex flex-row gap-7">
                    <FormItem label="Number">
                        <Field name="contactNumber" type="text" component={Input} />
                    </FormItem>

                    <FormItem label="POC">
                        <Field name="poc" component={Input} />
                    </FormItem>
                    <FormItem label="POC Designation">
                        <Field name="poc_designation" component={Input} />
                    </FormItem>
                    <FormItem label="GSTIN">
                        <Field name="gstin" component={Input} />
                    </FormItem>
                </FormContainer>

                {/* ............................. */}

                <FormItem label="FulFillment Center">
                    <Field name="is_fulfillment_center" component={Checkbox}>
                        Require fulfillment center
                    </Field>
                </FormItem>
                <FormItem label="Volumetric Store">
                    <Field name="is_volumetric_store" component={Checkbox}>
                        Volumetric Store
                    </Field>
                </FormItem>

                {/* Handle Submit........................... */}

                <FormItem>
                    <Button type="reset" className="ltr:mr-2 rtl:ml-2" onClick={() => resetForm()}>
                        Reset
                    </Button>
                    <Button variant="solid" type="submit">
                        Submit
                    </Button>
                </FormItem>
            </FormContainer>
        </div>
    )
}

export default StoreCommonForm
