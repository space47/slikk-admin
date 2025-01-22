/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeUpload } from '@/common/beforeUpload'
import { Button, Checkbox, FormContainer, FormItem, Input, Select, Upload } from '@/components/ui'
import { Field, FieldProps, Form } from 'formik'
import React from 'react'

interface GDN_FORM_PROPS {
    DocumentArray: any[]
    imagview?: any[]
    showImage?: any
    values: any
    showData?: any
    datas: any
    resetForm: any
    companyList: any[]
    setCompanyData: any
    receiveAddress: any[]
    storeResults: any
}

const GdnForm = ({
    DocumentArray,
    imagview,
    showImage,
    showData,
    values,
    datas,
    resetForm,
    companyList,
    setCompanyData,
    receiveAddress,
    storeResults,
}: GDN_FORM_PROPS) => {
    return (
        <Form className="w-full">
            <FormContainer>
                <FormContainer className="grid grid-cols-2 gap-3 ">
                    {DocumentArray.map((item, key) => {
                        return (
                            <FormItem key={key} label={item.label} className="col-span-1 w-2/3">
                                <Field type={item.type} name={item?.name} placeholder={`place ${item.label}`} component={Input} />
                            </FormItem>
                        )
                    })}
                </FormContainer>

                <div className="grid grid-cols-2 gap-3">
                    <FormItem label="Company">
                        <Field name="company">
                            {({ form }: FieldProps<any>) => {
                                const selectedCompany = companyList.find((option) => option.id === form.values.company)

                                return (
                                    <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                        <Select
                                            className="w-full"
                                            options={companyList}
                                            getOptionLabel={(option) => option.name}
                                            getOptionValue={(option) => option.id}
                                            value={selectedCompany || null}
                                            onChange={(newVal) => {
                                                form.setFieldValue('company', newVal?.id)
                                                setCompanyData(newVal?.id)
                                            }}
                                        />
                                    </div>
                                )
                            }}
                        </Field>
                    </FormItem>

                    <FormItem label="Store ">
                        <Field name="store">
                            {({ form, field }: FieldProps<any>) => {
                                const selectedCompany = storeResults.find((option) => option.id === field?.value)

                                return (
                                    <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                        <Select
                                            className="w-full"
                                            options={storeResults}
                                            getOptionLabel={(option) => option.code}
                                            getOptionValue={(option) => option.id}
                                            value={selectedCompany || null}
                                            onChange={(newVal) => {
                                                form.setFieldValue('store', newVal)
                                            }}
                                        />
                                    </div>
                                )
                            }}
                        </Field>
                    </FormItem>
                </div>
                <br />
                {receiveAddress.map((item, key) => {
                    return (
                        <FormItem key={key} label={item.label} className="col-span-1 w-1/2">
                            <Field type={item.type} name={item?.name} placeholder={`place ${item.label}`} component={Input} />
                        </FormItem>
                    )
                })}
                <div className="flex gap-2">
                    <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 w-full">
                        <div className="font-bold mb-3">Upload Supporting Document</div>
                        <FormContainer className=" mt-5 ">
                            <FormItem label="" className="grid grid-rows-2">
                                <Field name="files">
                                    {({ field, form }: FieldProps<any>) => (
                                        <>
                                            <Upload
                                                beforeUpload={beforeUpload}
                                                fileList={values.files}
                                                onChange={(files) => {
                                                    console.log('OnchangeFiles', files, field.name, values.files)
                                                    form.setFieldValue('files', files)
                                                }}
                                                onFileRemove={(files) => form.setFieldValue('files', files)}
                                            />
                                        </>
                                    )}
                                </Field>
                            </FormItem>
                            {showData && (
                                <>
                                    <p>{datas?.document}</p>
                                </>
                            )}
                            <br />
                        </FormContainer>

                        <FormItem label="" className="col-span-1 w-[80%]">
                            <Field type="text" name="document" placeholder="Enter Document Url or Upload docs file" component={Input} />
                        </FormItem>
                    </FormContainer>

                    {/* ...............................IMAGES.......................................... */}
                    <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 w-full">
                        <div className="font-bold mb-3 mt-8">Upload Supporting Image</div>
                        <FormContainer className=" mt-5 ">
                            <div className=" image w-[50px] h-[50px] mt-5 flex gap-2  ">
                                {imagview ? (
                                    imagview.map((img, index) => <img key={index} src={img} alt="img" className="rounded-xl" />)
                                ) : (
                                    <p>No image</p>
                                )}
                            </div>
                            <FormItem label="" className="grid grid-rows-2">
                                <Field name="image">
                                    {({ form }: FieldProps<any>) => (
                                        <>
                                            <Upload
                                                multiple
                                                beforeUpload={beforeUpload}
                                                fileList={values.image}
                                                onChange={(files) => {
                                                    console.log('File of Image', files)
                                                    return form.setFieldValue('image', files)
                                                }}
                                                onFileRemove={(files) => form.setFieldValue('image', files)}
                                            />
                                        </>
                                    )}
                                </Field>
                            </FormItem>
                            {showImage && (
                                <>
                                    <p>{imagview}</p>
                                </>
                            )}
                            <br />
                            <br />
                        </FormContainer>
                    </FormContainer>
                </div>

                {/* <FormItem label="SLIKK OWNED">
                    <Field name="slikk_owned" component={Checkbox}>
                        Items purchased by SLIKK
                    </Field>
                </FormItem> */}

                <FormItem>
                    <Button type="reset" className="ltr:mr-2 rtl:ml-2" onClick={() => resetForm()}>
                        Reset
                    </Button>
                    <Button variant="solid" type="submit">
                        Submit
                    </Button>
                </FormItem>
            </FormContainer>
        </Form>
    )
}

export default GdnForm
