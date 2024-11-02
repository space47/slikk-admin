/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
// import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
// import TimeInput from '@/components/ui/TimeInput'
import Checkbox from '@/components/ui/Checkbox'
// import Radio from '@/components/ui/Radio'
// import Switcher from '@/components/ui/Switcher'
// import Segment from '@/components/ui/Segment'
import Upload from '@/components/ui/Upload'
// import SegmentItemOption from '@/components/shared/SegmentItemOption'
// import { HiCheckCircle } from 'react-icons/hi'
import { Field, Form, Formik } from 'formik'
// import CreatableSelect from 'react-select/creatable'
// import * as Yup from 'yup'
import type { FieldProps } from 'formik'

import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'

import moment from 'moment'
import { Select } from '@/components/ui'

type ReceivedBy = {
    name: string
    email: string
    mobile: string
}

type FormModel = {
    select: string
    create_date: string | null
    singleCheckbox: boolean | false
    files: File[]
    file_type: string
    document_number: string
    company?: number
    received_by: ReceivedBy
    document_date: Date | string
    origin_address: string
    received_address: string
    slikk_owned: boolean
    total_sku: number | null
    total_quantity: number | null
    document: string
    images: string
    image: File[]
}

const MAX_UPLOAD = 8

// const validationSchema = Yup.object().shape({
//     document_number: Yup.string().required('Document Number is required'),
//     document_date: Yup.date().required('Document Date is required').nullable(),
//     // origin_address: Yup.string()
//     //     .required('Supplier Address is required')
//     //     .transform((value) => value.trim()),
//     // received_address: Yup.string()
//     //     .required('Receiver Address is required')
//     //     .transform((value) => value.trim()),
//     received_by: Yup.string()
//         .required('Received By is required')
//         .matches(/^[6-9]\d{9}$/, 'Mobile Number is not valid'),
//     total_sku: Yup.number()
//         .required('Total SKUs is required')
//         .integer('Must be an integer'),
//     total_quantity: Yup.number()
//         .required('Total Quantity is required')
//         .integer('Must be an integer'),
//     singleCheckbox: Yup.boolean(),
//     // images: Yup.string().nullable(),
//     // document: Yup.string().nullable(),
// })

const InwardEdit = () => {
    const [datas, setDatas] = useState<FormModel>()
    const [imagview, setImageView] = useState<string[]>([])
    const [showData, setShowData] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const [docsView, setDocsView] = useState<string[]>([])
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)

    const [companyData, setCompanyData] = useState<number>()

    console.log('COMPANYLIST', companyList)

    const { grn } = useParams()

    console.log('sss', grn)

    const navigate = useNavigate()

    const beforeUpload = (file: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]
        const MAX_FILE_SIZE = 5000000

        if (fileList.length >= MAX_UPLOAD) {
            return `You can only upload ${MAX_UPLOAD} file(s)`
        }

        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload a valid file format'
                }

                if (f.size >= MAX_FILE_SIZE) {
                    valid = 'Upload image cannot more then 500kb!'
                }
            }
        }

        return valid
    }

    const handleUpload = async (files: File[]) => {
        const formData = new FormData()
        console.log('fiiiles', files)
        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'grn')
        try {
            console.log(formData.get('file'))
            const response = await axios.post('fileupload/dashboard', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log(response)
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
            console.log(formData.get('file'))
            const response = await axioisInstance.post(
                'fileupload/dashboard', //only fileupload // image
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            )
            console.log(response)
            const newData = response.data.images
            setImageView(newData)
            console.log(newData)
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

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`goods/received?grn_number=${grn}`)
            const inwardData = response.data?.data
            setDatas(inwardData)
            setImageView(inwardData?.images ? inwardData.images.split(',') : [])
            console.log('ssdsdsdsd', imagview)
            setDocsView(inwardData ? inwardData.document_url.split(',') : [])
            console.log('doocs', docsView)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const initialValue: FormModel = {
        select: datas?.select || '',
        create_date: datas?.create_date ? moment(datas.create_date).format('YYYY-MM-DD') : '',
        singleCheckbox: datas?.singleCheckbox || false,
        file_type: datas?.file_type || '',
        document_number: datas?.document_number || '',
        company: datas?.company,
        files: datas?.files || [],
        received_by: {
            name: datas?.received_by?.name || '',
            mobile: datas?.received_by?.mobile || '',
            email: datas?.received_by?.email || '',
        },
        document_date: datas?.document_date ? moment(datas?.document_date).format('YYYY-MM-DD') : '',
        origin_address: datas?.origin_address || '',
        received_address: datas?.received_address || '',
        slikk_owned: datas?.slikk_owned || false,
        total_sku: datas?.total_sku || null,
        total_quantity: datas?.total_quantity || null,
        document: datas?.document || '',
        images: datas?.images || '',
        image: datas?.image || [],
    }

    console.log('COMNPANY CHECK', companyList.find((option) => option.id === initialValue.company)?.name)

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

        console.log('Dataas', docsUpload)
        console.log('Immage', imageUpload)
        const formData = {
            ...values,
            company: companyData,
            document: docsShow,
            images: imageShow,
        }

        console.log('formDaata', formData)

        try {
            const response = await axioisInstance.patch(
                'goods/received', //
                formData,
            )

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
    console.log('ssdsdsdsd', imagview)

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                // ONSUBMIT LOGICCCCCCC....................................................................................................
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
                                <FormItem asterisk label="Date" className="col-span-1 w-1/4">
                                    <Field type="Date" name="document_date" placeholder="Place your Document Number" component={Input} />
                                </FormItem>
                            </FormContainer>

                            <Field name="company">
                                {({ field, form }: FieldProps<any>) => {
                                    const selectedCompany = companyList.find((option) => option.id === form.values.company)

                                    return (
                                        <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                            <div className="font-semibold">Select Company</div>
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
                            {/* Second line/////////////////////////////////////////////////////////// */}

                            <FormItem
                                asterisk
                                label="Supplier Address"
                                invalid={errors.origin_address && touched.origin_address}
                                errorMessage={errors.origin_address}
                                className="col-span-1 w-full"
                            >
                                <Field
                                    type="text"
                                    name="origin_address"
                                    placeholder="Supplier Address"
                                    component={Input}
                                    style={{ height: '100px' }}
                                />
                            </FormItem>
                            <FormItem
                                asterisk
                                label="Receiver Address"
                                invalid={errors.received_address && touched.received_address}
                                errorMessage={errors.received_address}
                                className="col-span-1 w-full"
                            >
                                <Field
                                    type="text"
                                    name="received_address"
                                    placeholder="Receiver Address"
                                    component={Input}
                                    style={{ height: '100px' }}
                                />
                            </FormItem>

                            {/* fffffffffffffffffffffffffffffffffffffff */}

                            <FormContainer className="flex flex-row gap-3 ">
                                <FormItem
                                    asterisk
                                    label="Received By Name"
                                    invalid={errors.received_by?.name && touched.received_by?.name}
                                    errorMessage={errors.received_by?.name}
                                    className="col-span-1 w-1/3"
                                >
                                    <Field type="text" name="received_by.name" placeholder="Enter your Name" component={Input} />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Received By Mobile"
                                    invalid={errors.received_by?.mobile && touched.received_by?.mobile}
                                    errorMessage={errors.received_by?.mobile}
                                    className="col-span-1 w-1/3"
                                >
                                    <Field type="text" name="received_by.mobile" placeholder="Enter your Mobile Number" component={Input} />
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
                                    <FormItem label="" errorMessage={errors.document as string} className="grid grid-rows-2">
                                        <Field name="files">
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
                                            <p>{datas?.document}</p>
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
                                    <div className=" image w-[50px] h-[50px] mt-5 flex gap-2  ">
                                        {imagview ? (
                                            imagview.map((img, index) => <img key={index} src={img} alt="img" className="rounded-xl" />)
                                        ) : (
                                            <p>No image</p>
                                        )}
                                    </div>
                                    <FormItem
                                        label=""
                                        invalid={Boolean(errors.files && touched.files)}
                                        errorMessage={errors.files as string}
                                        className="grid grid-rows-2"
                                    >
                                        <Field name="image">
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

                                {/* <FormItem
                                    label=""
                                    invalid={errors.images && touched.images}
                                    errorMessage={errors.images}
                                    className="col-span-1 w-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="images"
                                        placeholder="Enter ImageUrl or Upload Image file"
                                        component={Input}
                                    />
                                </FormItem> */}
                            </FormContainer>

                            {/* {imagview && (
                                <div className="border border-gray-500 w-[85%] items-center justify-center flex py-2 mb-4">
                                    {imagview}
                                </div>
                            )} */}

                            {/* ----------------------------------------------------------------------------------------- */}

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

export default InwardEdit
