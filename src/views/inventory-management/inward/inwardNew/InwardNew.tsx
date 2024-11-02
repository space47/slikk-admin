import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
// import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import Checkbox from '@/components/ui/Checkbox'
import Upload from '@/components/ui/Upload'
import { Field, Form, Formik } from 'formik'
import type { FieldProps } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useState } from 'react'
import axios from 'axios'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { RichTextEditor } from '@/components/shared'
import { beforeUpload } from '@/common/beforeUpload'
import { FormModel, initialValue } from '../inwardCommon'
import { Dropdown, Select } from '@/components/ui'
import { setDefaultCompanyId } from '@/store/action/company.action'
import { DIVISION_STATE } from '@/store/types/division.types'

const MixedFormControl = () => {
    const [datas, setDatas] = useState()
    const [imagview, setImageView] = useState<string>('')
    const [showData, setShowData] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const dispatch = useAppDispatch()
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)

    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)

    const [companyData, setCompanyData] = useState<number>()

    const navigate = useNavigate()

    const handleUpload = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'grn')
        try {
            const response = await axios.post('fileupload/dashboard', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            const newData = response.data.url
            setDatas(newData)
            setShowData(true)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'File uploaded successfully',
            })
            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'File Not uploaded',
            })
            return 'Error'
        }
    }

    const handleimage = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'grn')

        try {
            const response = await axioisInstance.post('fileupload/dashboard', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            const newData = response.data.url
            setImageView(newData)

            setShowImage(true)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Image uploaded successfully',
            })
            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'File Not uploaded',
            })
            return 'Error'
        }
    }

    console.log('COMPANY DATA', companyData)

    const handleSubmit = async (values: FormModel) => {
        console.log('handleSubmit')
        let docsUpload = null
        if (values.files && values.files.length > 0) {
            docsUpload = await handleUpload(values.files)
        }

        let imageUpload = null
        if (values.image && values.image.length > 0) {
            imageUpload = await handleimage(values.image)
        }

        let docsShow = null
        if (docsUpload && values.document) {
            docsShow = [docsUpload, values.document].join(',')
        } else if (docsUpload) {
            docsShow = docsUpload
        } else if (values.document) {
            docsShow = values.document
        }

        let imageShow = null
        if (imageUpload && values.images) {
            imageShow = [imageUpload, values.images].join(',')
        } else if (imageUpload) {
            imageShow = imageUpload
        } else if (values.image) {
            imageShow = values.images
        }
        const formData = {
            ...values,
            company: companyData,

            document: docsShow,
            images: imageShow,
        }

        try {
            const response = await axioisInstance.post('goods/received', formData)

            console.log(response)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'GRN created Successfully',
            })
            navigate('/app/goods/received')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'GRN not created ',
            })
        }
    }

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem
                                    asterisk
                                    label="Document Number"
                                    invalid={errors.document_number && touched.document_number}
                                    errorMessage={errors.document_number}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field type="text" name="document_number" placeholder="Place your Document Number" component={Input} />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Date"
                                    invalid={errors.document_date && touched.document_date}
                                    errorMessage={errors.document_date}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field name="document_date" placeholder="Date">
                                        {({ field, form }: FieldProps<FormModel>) => (
                                            <DatePicker
                                                field={field}
                                                form={form}
                                                value={values.document_date}
                                                onChange={(date) => {
                                                    console.log(field.name)
                                                    form.setFieldValue(field.name, date)
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>

                            {/* <Dropdown key={selectedCompany.id} title={` ${selectedCompany.name}`} onClick={onDropdownClick}>
                                <div className="flex flex-col w-full overflow-y-scroll scrollbar-hide xl:h-[600px] xl:overflow-y-scroll ">
                                    {companyList.map((item, i) => (
                                        <Dropdown.Item key={i} eventKey={i.toString()} onSelect={onDropdownItemClick}>
                                            <div
                                                onClick={handleOption}
                                                className="text-[12px] capitalize whitespace-break-spaces  min-w-[250px] xl:w-[500px] xl:text-[14px]"
                                            >
                                                {item.name}, {item.registered_name}
                                            </div>
                                        </Dropdown.Item>
                                    ))}
                                </div>
                            </Dropdown> */}

                            <Field name="companyList">
                                {({ field }: FieldProps<any>) => {
                                    const fieldValue = Array.isArray(field.value) ? field.value : []

                                    return (
                                        <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                            <div className="font-semibold">Company List</div>
                                            <Select
                                                className="w-full"
                                                options={companyList}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id}
                                                defaultValue={companyList.filter((option) =>
                                                    fieldValue.some((item) => item === option.name),
                                                )}
                                                onChange={(newVal) => {
                                                    const selectedValues = newVal
                                                    setFieldValue('companyList', selectedValues)
                                                    setCompanyData(newVal?.id)
                                                }}
                                            />
                                        </div>
                                    )
                                }}
                            </Field>
                            <br />
                            {/* Second line/////////////////////////////////////////////////////////// */}

                            <FormContainer>
                                <FormItem label="Supplier Address" labelClass="!justify-start" className="col-span-1 w-full">
                                    <Field name="origin_address">
                                        {({ field, form }: FieldProps) => (
                                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                            <FormContainer>
                                <FormItem label="Receiver Address" labelClass="!justify-start" className="col-span-1 w-full">
                                    <Field name="received_address">
                                        {({ field, form }: FieldProps) => (
                                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                            {/* fffffffffffffffffffffffffffffffffffffff */}

                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem
                                    asterisk
                                    label="Received By"
                                    invalid={errors.received_by && touched.received_by}
                                    errorMessage={errors.received_by}
                                    className="col-span-1 w-1/3"
                                >
                                    <Field type="text" name="received_by" placeholder="Enter your Mobile Number" component={Input} />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Total SKUs"
                                    invalid={errors.total_sku && touched.total_sku}
                                    errorMessage={errors.total_sku}
                                    className="col-span-1 w-1/3"
                                >
                                    <Field type="number" name="total_sku" placeholder="Enter total Skus" component={Input} />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Total Quantity"
                                    invalid={errors.total_quantity && touched.total_quantity}
                                    errorMessage={errors.total_quantity}
                                    className="col-span-1 w-1/3"
                                >
                                    <Field type="number" name="total_quantity" placeholder="Enter total items received" component={Input} />
                                </FormItem>
                            </FormContainer>

                            {/* ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo */}

                            <div className="font-bold mb-3">Upload Supporting Document</div>
                            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                <FormContainer className=" mt-5 ">
                                    <FormItem
                                        label=""
                                        invalid={Boolean(errors.document && touched.document)}
                                        errorMessage={errors.document as string}
                                        className="grid grid-rows-2"
                                    >
                                        <Field name="document">
                                            {({ field, form }: FieldProps<FormModel>) => (
                                                <>
                                                    <Upload
                                                        beforeUpload={beforeUpload}
                                                        fileList={values.files} // uploadedd the file
                                                        onChange={(files) => {
                                                            console.log('OnchangeFiles', files, field.name, values.files)
                                                            form.setFieldValue('files', files)
                                                        }}
                                                        onFileRemove={(files) => form.setFieldValue('files', files)}
                                                        // uploadButtonText="Add Files"
                                                    />
                                                </>
                                            )}
                                        </Field>
                                    </FormItem>
                                    {showData && (
                                        <>
                                            <p>{datas}</p>
                                        </>
                                    )}
                                    <br />
                                </FormContainer>

                                <FormItem label="" className="col-span-1 w-[80%]">
                                    <Field
                                        type="text"
                                        name="document"
                                        placeholder="Enter Document Url or Upload docs file"
                                        component={Input}
                                    />
                                </FormItem>
                            </FormContainer>

                            {/* <div className="border border-gray-500 w-[85%] items-center justify-center flex py-2 mb-4">
                                {datas}
                            </div> */}

                            {/* ...............................IMAGES.......................................... */}
                            <div className="font-bold mb-3 mt-8">Upload Supporting Image</div>
                            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                <FormContainer className=" mt-5 ">
                                    <FormItem
                                        label=""
                                        invalid={Boolean(errors.files && touched.files)}
                                        errorMessage={errors.files as string}
                                        className="grid grid-rows-2"
                                    >
                                        <Field name="images">
                                            {({ form }: FieldProps<FormModel>) => (
                                                <>
                                                    <Upload
                                                        multiple
                                                        beforeUpload={beforeUpload}
                                                        fileList={values.image}
                                                        onChange={(files) => form.setFieldValue('image', files)}
                                                        onFileRemove={(files) => form.setFieldValue('image', files)}
                                                        // uploadButtonText="Add Files"
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

                                <FormItem
                                    label=""
                                    invalid={errors.images && touched.images}
                                    errorMessage={errors.images}
                                    className="col-span-1 w-[80%]"
                                >
                                    <Field type="text" name="images" placeholder="Enter ImageUrl or Upload Image file" component={Input} />
                                </FormItem>
                            </FormContainer>

                            <FormItem
                                label="SLIKK OWNED"
                                invalid={errors.slikk_owned && touched.slikk_owned}
                                // errorMessage={errors.singleCheckbox}
                            >
                                <Field name="slikk_owned" component={Checkbox}>
                                    Items purchased by SLIKK
                                </Field>
                            </FormItem>

                            <FormItem>
                                <Button type="reset" className="ltr:mr-2 rtl:ml-2" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    // onClick={() => handleSubmit()}
                                >
                                    Submit
                                </Button>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default MixedFormControl
