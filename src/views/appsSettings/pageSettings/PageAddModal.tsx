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
import { Dropdown, Button } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'

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
    data: any
    setData: (data: any) => void
}

const dataType = [
    { name: 'Barcodes', value: 'barcodes' },
    { name: 'Brands', value: 'brands' },
    { name: 'Handles', value: 'handles' },
    { name: 'Posts', value: 'posts' },
]

const PageAddModal: React.FC<modalProps> = ({
    isModalOpen,
    setIsModalOpen,
    handleOk,
    handleCancel,
    formikRef,
    data,
    setData,
}) => {
    const MAX_UPLOAD = 10000
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

    const [initialValue, setInitalValue] = useState<any>({
        data_type: {
            type: '',
            filters: [],
            barcodes: '',
            posts: '',
            brands: '',
            handles: '',
        },
        footer_config: {
            icon: '',
            text: '',
            image: '',
            style: '',
            position: '',
        },
        header_config: {
            icon: '',
            text: '',
            image: '',
            style: '',
            position: '',
        },
        component_type: '',
        section_heading: '',
        background_image: '',
        sub_header_config: {
            icon: '',
            text: '',
            image: '',
            style: '',
            position: '',
        },
        background_image_array: [],
        footer_config_icon_Array: [],
        footer_config_image_Array: [],
        header_config_icon_Array: [],
        header_config_image_Array: [],
        sub_header_config_icon_Array: [],
        sub_header_config_image_Array: [],
    })
    const [selectedType, setSelectedType] = useState('')

    const [inputValue, setInputValue] = useState('')

    const handleSelectdrop = (key: string) => {
        console.log('ddddddddddd', key)
        setSelectedType(key)
    }

    const handleInputDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleimage = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'banners') //............................................................................

        try {
            console.log(formData.get('file'))
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log(response)
            const newData = response.data.url
            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Image uploaded successfully',
            })
            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Failure',
                description:
                    error?.response?.data?.message || 'File Not uploaded',
            })
            return 'Error'
        }
    }
    const handleSelect = (a: any, b: any) => {
        console.log('data.....................', a, b)
        // setCurrentSelectedPage({
        //     value: a,
        //     name: BANNER_PAGE_NAME.find((p) => p.value == a)?.name || '',
        // })
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
        const newRowAdd = {
            ...row,
            background_image:
                row.background_image_array.length > 0 ? imageUpload : '',
            footer_config: {
                ...row.footer_config,
                image:
                    row.footer_config_image_Array.length > 0
                        ? footerImageUpload
                        : '',
            },
            header_config: {
                ...row.header_config,
                image:
                    row.header_config_image_Array.length > 0
                        ? headerImageUpload
                        : '',
            },
            sub_header_config: {
                ...row.sub_header_config,
                image:
                    row.sub_header_config_image_Array.length > 0
                        ? subHeaderImageUpload
                        : '',
            },
            data_type: {
                ...row.data_type,
                selectedType: initialValue,
            },
        }

        setData((prevData: WebType[]) => [...prevData, newRowAdd])
        setSelectedType('')
        setInitalValue('')

        setIsModalOpen(false)
    }

    console.log('---------------')

    return (
        <>
            <Modal
                title="ADD PAGE SECTION"
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
                    // ONSUBMIT LOGICCCCCCC....................................................................................................
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
                                    <Field
                                        type="text"
                                        name="component_type"
                                        placeholder="Place your Section heading"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* image */}
                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[170px] items-center h-[160px] rounded-xl mb-2">
                                    <div className="font-semibold mb-1">
                                        Background Image
                                    </div>

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
                                    <Dropdown
                                        className="text-xl text-black"
                                        title={selectedType}
                                        onSelect={handleSelectdrop}
                                    >
                                        {dataType?.map((item, key) => (
                                            <DropdownItem
                                                key={key}
                                                eventKey={item.value}
                                            >
                                                <span>{item.name}</span>
                                            </DropdownItem>
                                        ))}
                                    </Dropdown>
                                </FormItem>

                                <FormItem
                                    label="Data Type Values"
                                    className="col-span-1 w-[60%] h-[80%]"
                                >
                                    <Field
                                        type="text"
                                        name="data_type.type"
                                        placeholder="Enter comma separated values"
                                        component={Input}
                                        value={inputValue}
                                        onChange={handleInputDrop}
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

export default PageAddModal
