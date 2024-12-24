/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Upload from '@/components/ui/Upload'
import { Field, Form, Formik } from 'formik'
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
import { beforeUpload } from '@/common/beforeUpload'
import { Addresses, DocumentArray, FormModel, receiveAddress } from './inwardEditCommon'

const InwardEdit = () => {
    const [datas, setDatas] = useState<FormModel>()
    const [imagview, setImageView] = useState<string[]>([])
    const [showData, setShowData] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const [docsView, setDocsView] = useState<string[]>([])
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const [companyData, setCompanyData] = useState<number>()
    const { grn } = useParams()
    console.log('docs', docsView)
    const navigate = useNavigate()

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
            const response = await axioisInstance.post('fileupload/dashboard', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            const newData = response.data.images
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

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`goods/received?grn_number=${grn}`)
            const inwardData = response.data?.data
            setDatas(inwardData)
            setImageView(inwardData?.images ? inwardData.images.split(',') : [])
            setDocsView(inwardData ? inwardData.document_url.split(',') : [])
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

    const processUpload = async (uploadHandler: any, value: any, existingValue: any) => {
        let uploadResult = null

        if (value && value.length > 0) {
            uploadResult = await uploadHandler(value)
        }

        if (uploadResult && existingValue) {
            return [uploadResult, existingValue].join(',')
        } else if (uploadResult) {
            return uploadResult
        } else {
            return existingValue
        }
    }

    const handleSubmit = async (values: FormModel) => {
        const docsShow = await processUpload(handleUpload, values.files, values.document)
        const imageShow = await processUpload(handleimage, values.image, values.images)

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
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, touched, errors, resetForm }) => (
                    <Form className="w-full">
                        <FormContainer>
                            <FormContainer className="flex flex-row gap-3 ">
                                {DocumentArray.map((item, key) => {
                                    return (
                                        <FormItem key={key} label={item.label} className="col-span-1 w-1/4">
                                            <Field
                                                type={item.type}
                                                name={item?.name}
                                                placeholder={`place ${item.label}`}
                                                component={Input}
                                            />
                                        </FormItem>
                                    )
                                })}
                            </FormContainer>

                            <Field name="company">
                                {({ form }: FieldProps<any>) => {
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
                            <br />
                            {receiveAddress.map((item, key) => {
                                return (
                                    <FormItem key={key} label={item.label} className="col-span-1 w-1/2">
                                        <Field type={item.type} name={item?.name} placeholder={`place ${item.label}`} component={Input} />
                                    </FormItem>
                                )
                            })}
                            <FormContainer className="flex flex-row gap-3 ">
                                {Addresses.map((item, key) => {
                                    return (
                                        <FormItem key={key} label={item.label} className="col-span-1 w-1/4">
                                            <Field
                                                type={item.type}
                                                name={item?.name}
                                                placeholder={`place ${item.label}`}
                                                component={Input}
                                            />
                                        </FormItem>
                                    )
                                })}
                            </FormContainer>

                            {/* ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo */}

                            <div className="flex gap-2">
                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 w-full">
                                    <div className="font-bold mb-3">Upload Supporting Document</div>
                                    <FormContainer className=" mt-5 ">
                                        <FormItem label="" errorMessage={errors.document as string} className="grid grid-rows-2">
                                            <Field name="files">
                                                {({ field, form }: FieldProps<FormModel>) => (
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
                                        <Field
                                            type="text"
                                            name="document"
                                            placeholder="Enter Document Url or Upload docs file"
                                            component={Input}
                                        />
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

                            <FormItem label="SLIKK OWNED" invalid={errors.slikk_owned && touched.slikk_owned}>
                                <Field name="slikk_owned" component={Checkbox}>
                                    Items purchased by SLIKK
                                </Field>
                            </FormItem>

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
                )}
            </Formik>
        </div>
    )
}

export default InwardEdit
