/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { Modal, notification } from 'antd'
import { Field, Form, Formik } from 'formik'
import Upload from '@/components/ui/Upload'
import type { FieldProps } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { COMPONENT_CATEGORY_TYPES } from '@/common/banner'

interface DataType {
    type: string
    filters: any[]
    barcodes: string
    posts: string
    brands: string
    handles: string
}

interface Config {
    icon: string
    text: string
    image: string
    style: string
    position: string
}

type WebType = {
    data_type: DataType
    footer_config: Config
    header_config: Config
    component_type: string
    section_heading: string
    background_image: string
    sub_header_config: Config
    background_image_array: File[]
    footer_config_icon_Array: File[] //.........
    footer_config_image_Array: File[]
    header_config_icon_Array: File[]
    header_config_image_Array: File[]
    sub_header_config_icon_Array: File[]
    sub_header_config_image_Array: File[]
}

type modalProps = {
    isModalOpen: boolean
    setIsModalOpen: (open: boolean) => void
    handleOk: () => void
    handleCancel: () => void
    formikRef: React.RefObject<any>
    particularRow: any
    setParticularRow: (data: any) => void
}

const PageModal: React.FC<modalProps> = ({
    isModalOpen,
    setIsModalOpen,
    handleOk,
    handleCancel,
    formikRef,
    particularRow,
    setParticularRow,
}) => {
    const MAX_UPLOAD = 10000
    const beforeUpload = (file: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'image/png',
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

    const [initialValue, setInitalValue] = useState<any>({
        data_type: particularRow.data_type,
        footer_config: particularRow.footer_config,
        header_config: particularRow.header_config,
        component_type: particularRow.component_type,
        section_heading: particularRow.section_heading,
        background_image: particularRow.background_image,
        sub_header_config: particularRow.sub_header_config,
    })

    const handleimage = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'banners')
        try {
            await axioisInstance
                .post('fileupload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    const newData = response.data.url
                    notification.success({
                        message: 'Success',
                        description:
                            response?.data?.message ||
                            'Image uploaded successfully',
                    })
                    return newData
                })
                .catch((error) => {
                    console.error(error)
                    notification.error({
                        message: 'Upload Failed',
                        description:
                            error?.response?.data?.message ||
                            'Image upload failed',
                    })
                    return 'Error'
                })
        } catch (error: any) {
            console.error('Error uploading files:', error)
        }
    }

    const handleSubmit = async (row: WebType) => {
        const imageUpload = await handleimage(row.background_image_array)

        const footerImageUpload = await handleimage(
            row.footer_config_image_Array,
        )

        const headerImageUpload = await handleimage(
            row.header_config_image_Array,
        )

        const subHeaderImageUpload = await handleimage(
            row.sub_header_config_image_Array,
        )

        const newRow = {
            ...row,
            background_image: row.background_image_array ? 'imageUpload' : '',
            footer_config: {
                ...row.footer_config,
                image: row.footer_config_image_Array ? 'footerImageUpload' : '',
            },
            header_config: {
                ...row.header_config,
                image: row.header_config_image_Array ? 'headerImageUpload' : '',
            },
            sub_header_config: {
                ...row.sub_header_config,
                image: row.sub_header_config_image_Array
                    ? 'subHeaderImageUpload'
                    : '',
            },
            data_type: {
                ...row.data_type,
            },
        }
        console.log('row', newRow)

        setParticularRow(newRow)
    }

    console.log('---------------', particularRow)
    const handleRemoveImage = () => {
        setInitalValue((prev: any) => ({
            ...prev,
            background_image: null,
        }))
    }

    const getDataType = (data: DataType): { key: string; value: string } => {
        if (data.barcodes) {
            return { key: 'Barcode', value: data.barcodes }
        } else if (data.posts) {
            return { key: 'Posts', value: data.posts }
        } else if (data.brands) {
            return { key: 'Brands', value: data.brands }
        } else if (data.handles) {
            return { key: 'Handles', value: data.handles }
        }
        return { key: '', value: '' }
    }

    const [initialDataType, setInitialDataType] = useState(
        getDataType(particularRow.data_type).value,
    )

    const handleChangeDtata = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInitialDataType(e.target.value)
    }

    return (
        <>
            <Modal
                title="EDIT SECTION"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1500}
                okText="Edit"
            >
                <Formik
                    enableReinitialize
                    initialValues={initialValue}
                    innerRef={formikRef}
                    // validationSchema={validationSchema}

                    onSubmit={handleSubmit}
                >
                    {({ values, touched, errors, resetForm }) => (
                        <Form className="w-full">
                            <FormContainer className="grid grid-cols-2 gap-3">
                                <FormItem
                                    asterisk
                                    label="Section Header"
                                    // invalid={
                                    //     errors.document_number &&
                                    //     touched.document_number
                                    // }
                                    // errorMessage={errors.document_number}
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="section_heading"
                                        placeholder="Place your Section heading"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Component Types"
                                    // invalid={
                                    //     errors.document_number &&
                                    //     touched.document_number
                                    // }
                                    // errorMessage={errors.document_number}
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field name="component_type">
                                        {({ field, form }: FieldProps<any>) => {
                                            const componentOptions =
                                                COMPONENT_CATEGORY_TYPES

                                            return (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={componentOptions}
                                                    value={componentOptions.find(
                                                        (option) =>
                                                            option.value ===
                                                            field.value,
                                                    )}
                                                    onChange={(option) =>
                                                        form.setFieldValue(
                                                            field.name,
                                                            option?.value,
                                                        )
                                                    }
                                                    onKeyDown={(e) =>
                                                        e.key === 'Enter' &&
                                                        e.preventDefault()
                                                    }
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>

                                {/* image */}
                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[170px] items-center h-[160px] rounded-xl mb-2">
                                    <div className="font-semibold mb-1">
                                        Image
                                    </div>
                                    {initialValue.background_image ? (
                                        <div className="flex flex-col items-center justify-center min-w-[100px]">
                                            <img
                                                src={
                                                    initialValue.background_image
                                                }
                                                alt={`Image `}
                                                className="w-[100px] h-[40px] flex object-contain "
                                            />
                                            <button
                                                className="text-red-500 text-md "
                                                onClick={handleRemoveImage}
                                            >
                                                x
                                            </button>
                                        </div>
                                    ) : (
                                        'No Image'
                                    )}
                                    <FormContainer className=" mt-5 ">
                                        <FormItem
                                            label=""
                                            // invalid={Boolean(
                                            //     errors.document &&
                                            //         touched.document,
                                            // )}
                                            // errorMessage={
                                            //     errors.document as string
                                            // }
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="background_image_array">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps<WebType>) => (
                                                    <>
                                                        <Upload
                                                            beforeUpload={
                                                                beforeUpload
                                                            }
                                                            fileList={
                                                                values.background_image_array
                                                            } // uploadedd the file
                                                            onChange={(
                                                                files,
                                                            ) => {
                                                                console.log(
                                                                    'OnchangeFiles',
                                                                    files,
                                                                    field.name,
                                                                    values.background_image_array,
                                                                )
                                                                form.setFieldValue(
                                                                    'background_image_array',
                                                                    files,
                                                                )
                                                            }}
                                                            className=""
                                                            onFileRemove={(
                                                                files,
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'background_image_array',
                                                                    files,
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </FormContainer>
                                </FormContainer>

                                <FormItem
                                    label=""
                                    // invalid={
                                    //     errors.document_number &&
                                    //     touched.document_number
                                    // }
                                    // errorMessage={errors.document_number}
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    {' '}
                                </FormItem>

                                {/* ............Header Config................................................. */}

                                <FormItem
                                    asterisk
                                    label="Header Style"
                                    // invalid={
                                    //     errors.document_number &&
                                    //     touched.document_number
                                    // }
                                    // errorMessage={errors.document_number}
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="header_config.style"
                                        placeholder="Place your header Style"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Header Text"
                                    // invalid={
                                    //     errors.document_number &&
                                    //     touched.document_number
                                    // }
                                    // errorMessage={errors.document_number}
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="header_config.text"
                                        placeholder="Place your header Text"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* .................................................................... */}
                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[170px] items-center h-[160px] rounded-xl mb-2">
                                    <div className="font-semibold mb-1">
                                        Header Image
                                    </div>
                                    {particularRow.header_config.image && (
                                        <div className="flex flex-col items-center justify-center min-w-[100px]">
                                            <img
                                                src={
                                                    particularRow.header_config
                                                        .image
                                                }
                                                alt={`Image `}
                                                className="w-[100px] h-[40px] flex object-contain "
                                            />
                                            <button
                                                className="text-red-500 text-md "
                                                onClick={handleRemoveImage}
                                            >
                                                x
                                            </button>
                                        </div>
                                    )}
                                    <FormContainer className=" mt-5 ">
                                        <FormItem
                                            label=""
                                            // invalid={Boolean(
                                            //     errors.document &&
                                            //         touched.document,
                                            // )}
                                            // errorMessage={
                                            //     errors.document as string
                                            // }
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="header_config_image_Array">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps<WebType>) => (
                                                    <>
                                                        <Upload
                                                            beforeUpload={
                                                                beforeUpload
                                                            }
                                                            fileList={
                                                                values.header_config_image_Array
                                                            } // uploadedd the file
                                                            onChange={(
                                                                files,
                                                            ) => {
                                                                console.log(
                                                                    'OnchangeFiles',
                                                                    files,
                                                                    field.name,
                                                                    values.header_config_image_Array,
                                                                )
                                                                form.setFieldValue(
                                                                    'header_config_image_Array',
                                                                    files,
                                                                )
                                                            }}
                                                            className=""
                                                            onFileRemove={(
                                                                files,
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'header_config_image_Array',
                                                                    files,
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </FormContainer>
                                </FormContainer>
                                <FormItem
                                    asterisk
                                    label="Header Position"
                                    // invalid={
                                    //     errors.document_number &&
                                    //     touched.document_number
                                    // }
                                    // errorMessage={errors.document_number}
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="header_config.position"
                                        placeholder="Place your header Position"
                                        component={Input}
                                    />
                                </FormItem>
                                {/* ................................................................................ */}
                                {/* .......sub_header....................... */}
                                <FormItem
                                    asterisk
                                    label="Sub Header Style"
                                    // invalid={
                                    //     errors.document_number &&
                                    //     touched.document_number
                                    // }
                                    // errorMessage={errors.document_number}
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="sub_header_config.style"
                                        placeholder="Place your header Style"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Sub Header Text"
                                    // invalid={
                                    //     errors.document_number &&
                                    //     touched.document_number
                                    // }
                                    // errorMessage={errors.document_number}
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="sub_header_config.text"
                                        placeholder="Place your header Text"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[170px] items-center h-[160px] rounded-xl mb-2">
                                    <div className="font-semibold mb-1">
                                        Sub Header Image
                                    </div>
                                    {particularRow.sub_header_config.image && (
                                        <div className="flex flex-col items-center justify-center min-w-[100px]">
                                            <img
                                                src={
                                                    particularRow
                                                        .sub_header_config.image
                                                }
                                                alt={`Image `}
                                                className="w-[100px] h-[40px] flex object-contain "
                                            />
                                            <button
                                                className="text-red-500 text-md "
                                                onClick={(e) =>
                                                    handleRemoveImage(e)
                                                }
                                            >
                                                x
                                            </button>
                                        </div>
                                    )}
                                    <FormContainer className=" mt-5 ">
                                        <FormItem
                                            label=""
                                            // invalid={Boolean(
                                            //     errors.document &&
                                            //         touched.document,
                                            // )}
                                            // errorMessage={
                                            //     errors.document as string
                                            // }
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="sub_header_config_image_Array">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps<WebType>) => (
                                                    <>
                                                        <Upload
                                                            beforeUpload={
                                                                beforeUpload
                                                            }
                                                            fileList={
                                                                values.sub_header_config_image_Array
                                                            } // uploadedd the file
                                                            onChange={(
                                                                files,
                                                            ) => {
                                                                console.log(
                                                                    'OnchangeFiles',
                                                                    files,
                                                                    field.name,
                                                                    values.sub_header_config_image_Array,
                                                                )
                                                                form.setFieldValue(
                                                                    'sub_header_config_image_Array',
                                                                    files,
                                                                )
                                                            }}
                                                            className=""
                                                            onFileRemove={(
                                                                files,
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'sub_header_config_image_Array',
                                                                    files,
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </FormContainer>
                                </FormContainer>
                                <FormItem
                                    asterisk
                                    label="Sub Header Position"
                                    // invalid={
                                    //     errors.document_number &&
                                    //     touched.document_number
                                    // }
                                    // errorMessage={errors.document_number}
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="sub_header_config.position"
                                        placeholder="Place your header Position"
                                        component={Input}
                                    />
                                </FormItem>
                                {/* ........................................................ */}

                                {/* ............Footer COnfig>>>>>>>>>>>>>>>>>>>>>> */}

                                <FormItem
                                    asterisk
                                    label="Footer Style"
                                    // invalid={
                                    //     errors.document_number &&
                                    //     touched.document_number
                                    // }
                                    // errorMessage={errors.document_number}
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="footer_config.style"
                                        placeholder="Place your header Style"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Footer Text"
                                    // invalid={
                                    //     errors.document_number &&
                                    //     touched.document_number
                                    // }
                                    // errorMessage={errors.document_number}
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="footer_config.text"
                                        placeholder="Place your header Text"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[170px] items-center h-[160px] rounded-xl mb-2">
                                    <div className="font-semibold mb-1">
                                        Footer Image
                                    </div>
                                    {particularRow.footer_config.image && (
                                        <div className="flex flex-col items-center justify-center min-w-[100px]">
                                            <img
                                                src={
                                                    particularRow.footer_config
                                                        .image
                                                }
                                                alt={`Image `}
                                                className="w-[100px] h-[40px] flex object-contain "
                                            />
                                            <button
                                                className="text-red-500 text-md "
                                                onClick={(e) =>
                                                    handleRemoveImage(e)
                                                }
                                            >
                                                x
                                            </button>
                                        </div>
                                    )}
                                    <FormContainer className=" mt-5 ">
                                        <FormItem
                                            label=""
                                            // invalid={Boolean(
                                            //     errors.document &&
                                            //         touched.document,
                                            // )}
                                            // errorMessage={
                                            //     errors.document as string
                                            // }
                                            className="grid grid-rows-2"
                                        >
                                            <Field name="footer_config_image_Array">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps<WebType>) => (
                                                    <>
                                                        <Upload
                                                            beforeUpload={
                                                                beforeUpload
                                                            }
                                                            fileList={
                                                                values.footer_config_image_Array
                                                            } // uploadedd the file
                                                            onChange={(
                                                                files,
                                                            ) => {
                                                                console.log(
                                                                    'OnchangeFiles',
                                                                    files,
                                                                    field.name,
                                                                    values.footer_config_image_Array,
                                                                )
                                                                form.setFieldValue(
                                                                    'footer_config_image_Array',
                                                                    files,
                                                                )
                                                            }}
                                                            className=""
                                                            onFileRemove={(
                                                                files,
                                                            ) =>
                                                                form.setFieldValue(
                                                                    'footer_config_image_Array',
                                                                    files,
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </FormContainer>
                                </FormContainer>
                                <FormItem
                                    asterisk
                                    label="Footer Position"
                                    // invalid={
                                    //     errors.document_number &&
                                    //     touched.document_number
                                    // }
                                    // errorMessage={errors.document_number}
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="footer_config.position"
                                        placeholder="Place your header Position"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* ..................................................... */}

                                {/* Data Types.......................................... */}

                                <FormItem
                                    asterisk
                                    label="Data Type"
                                    // invalid={
                                    //     errors.document_number &&
                                    //     touched.document_number
                                    // }
                                    // errorMessage={errors.document_number}
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="data_type.type"
                                        placeholder="Place your header Style"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Filters"
                                    // invalid={
                                    //     errors.document_number &&
                                    //     touched.document_number
                                    // }
                                    // errorMessage={errors.document_number}
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="data_type.filters"
                                        placeholder="Place your header Text"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Data Type Key"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="data_type.type"
                                        placeholder="Place your dataType"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Data Type Barcode"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="data_type.barcodes"
                                        placeholder="Place your dataType"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Data Type Posts"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="data_type.posts"
                                        placeholder="Place your dataType"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Data Type Brands"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="data_type.brands"
                                        placeholder="Place your dataType"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Data Type Handles"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="data_type.handles"
                                        placeholder="Place your dataType"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* ..................................................... */}
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </>
    )
}

export default PageModal
