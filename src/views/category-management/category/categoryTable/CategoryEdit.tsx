import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Upload from '@/components/ui/Upload'
import Textarea from '@/views/ui-components/forms/Input/Textarea'
import { Field, Form, Formik } from 'formik'
import Select from '@/components/ui/Select'
import * as Yup from 'yup'
import type { FieldProps } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

type FormModel = {
    id: number | undefined
    name: string | undefined
    division: number | undefined

    title: string | undefined
    description: string | undefined
    image: string | undefined
    footer: string | undefined
    quick_filter_tags: string | undefined
    position: number | undefined
    gender: string | undefined
    is_active: boolean | undefined
    create_date: string | undefined
    update_date: string | undefined
    is_try_and_buy: boolean | undefined
    last_updated_by: string | undefined
    images: File[]
}

type Division = {
    id: number
    name: string
    description: string
    image: string
    footer: string
    quick_filter_tags: string
    seo_tags: string
    position: number
    is_active: true
    create_date: string
    update_date: string
    last_updated_by: string
}
interface Option {
    value: number
    label: string
}

const MIN_UPLOAD = 1
const MAX_UPLOAD = 8

// const validationSchema = Yup.object().shape({
//     document_number: Yup.string().required('Document Number is required'),
//     document_date: Yup.date().required('Document Date is required').nullable(),
//     origin_address: Yup.string()
//         .required('Supplier Address is required')
//         .transform((value) => value.trim()),
//     received_address: Yup.string()
//         .required('Receiver Address is required')
//         .transform((value) => value.trim()),
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

const CategoryEdit = () => {
    const [catedate, setCateData] = useState<FormModel | null>(null)
    const [divdata, setDivData] = useState<Division[]>()
    const [options, setOptions] = useState<Option[]>([])
    const [imagview, setImageView] = useState<string[]>([])
    const [footer, setFooter] = useState()

    const { id } = useParams()
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`category?id=${id}`)
            const categoryData = response.data?.data[0] || {}
            setCateData(categoryData)
            setImageView(categoryData.image ? [categoryData.image] : [])
        } catch (error) {
            console.log(error)
        }
    }

    const fetchDivision = async () => {
        try {
            const response = await axioisInstance.get(`division`)
            const divisionData = response.data?.data || []
            setDivData(divisionData)
            const transformedOptions = divisionData.map((item: Division) => ({
                value: item.id,
                label: item.name,
            }))
            setOptions(transformedOptions)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        fetchDivision()
    }, [])

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
    const handleFooterChange = (e: any) => {
        setFooter(e.target.value)
    }

    const handleFileupload = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'category')

        try {
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            const newData = response.data.url
            setImageView(newData)
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

    const handleSubmit = async (values: FormModel) => {
        const formData = {
            ...values,
            images: values.image,
        }

        console.log('formDaata', formData)

        try {
            const response = await axioisInstance.patch('category', formData)

            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'Category Changed Successfully',
            })
            navigate('/app/category/category')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Failed to edit',
            })
        }
    }

    if (!catedate) {
        return <div>Loading...</div>
    }

    const initialValue: FormModel = {
        id: catedate.id,
        name: catedate.name,
        division: catedate.division,
        title: catedate.title,
        description: catedate.description,
        image: catedate.image,
        footer: catedate.footer,
        quick_filter_tags: catedate.quick_filter_tags,
        position: catedate.position,
        gender: catedate.gender,
        is_active: catedate.is_active,
        create_date: catedate.create_date,
        update_date: catedate.update_date,
        is_try_and_buy: catedate.is_try_and_buy,
        last_updated_by: catedate.last_updated_by,
        images: [],
    }

    return (
        <div>
            <div className="text-xl mb-10">Category Edit</div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="flex flex-row gap-7">
                                <FormItem
                                    asterisk
                                    label="Category Name"
                                    invalid={errors.name && touched.name}
                                    errorMessage={errors.name}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="name"
                                        component={Input}
                                        onKeyDown={(e) => {
                                            e.key === 'Enter' &&
                                                e.preventDefault()
                                        }}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Division Name"
                                    invalid={
                                        errors.division && touched.division
                                    }
                                    errorMessage={errors.division}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        name="division"
                                        onKeyDown={(e) => {
                                            e.key === 'Enter' &&
                                                e.preventDefault()
                                        }}
                                    >
                                        {({ field, form }: FieldProps<any>) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={options}
                                                value={options.find(
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
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>

                            {/* Image upload section */}

                            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                <div className="image w-[10%] h-[20%] mt-5">
                                    {imagview && imagview.length > 0 ? (
                                        imagview.map((img, index) => (
                                            <img
                                                key={index}
                                                src={img}
                                                alt="img"
                                                className="rounded-xl"
                                            />
                                        ))
                                    ) : (
                                        <p>No image</p>
                                    )}
                                </div>
                                <FormContainer className="mt-5">
                                    <FormItem
                                        label="ADD NEW IMAGE"
                                        invalid={Boolean(
                                            errors.image && touched.image,
                                        )}
                                        errorMessage={errors.image as string}
                                        className="grid grid-rows-2"
                                    >
                                        <Field
                                            name="image"
                                            onKeyDown={(e) => {
                                                e.key === 'Enter' &&
                                                    e.preventDefault()
                                            }}
                                        >
                                            {({
                                                form,
                                            }: FieldProps<FormModel>) => (
                                                <>
                                                    <Upload
                                                        beforeUpload={
                                                            beforeUpload
                                                        }
                                                        fileList={values.images}
                                                        onChange={async (
                                                            files,
                                                        ) => {
                                                            const uploadedImage =
                                                                await handleFileupload(
                                                                    files,
                                                                )
                                                            form.setFieldValue(
                                                                'image',
                                                                uploadedImage,
                                                            )
                                                            setImageView([
                                                                uploadedImage,
                                                            ])
                                                        }}
                                                        onFileRemove={(files) =>
                                                            form.setFieldValue(
                                                                'image',
                                                                files,
                                                            )
                                                        }
                                                        showList={false}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                    </FormItem>
                                    <br />
                                </FormContainer>
                            </FormContainer>

                            {/* Text area section */}

                            <FormContainer className="flex flex-row gap-7">
                                <FormItem
                                    label="Footer"
                                    invalid={errors.footer && touched.footer}
                                    errorMessage={errors.footer}
                                    className="col-span-1 w-full"
                                >
                                    <textarea
                                        name="footer"
                                        value={footer}
                                        onChange={handleFooterChange}
                                        id=""
                                        className="w-full border border-gray-200 rounded-lg items-center h-[200px] p-2"
                                    ></textarea>
                                </FormItem>
                            </FormContainer>

                            {/* Quick Filter Tag, Position, and Gender */}

                            <FormContainer className="flex flex-row gap-7">
                                <FormItem
                                    asterisk
                                    label="Quick Filter Tag"
                                    invalid={
                                        errors.quick_filter_tags &&
                                        touched.quick_filter_tags
                                    }
                                    errorMessage={errors.quick_filter_tags}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="quick_filter_tags"
                                        component={Input}
                                        onKeyDown={(e) => {
                                            e.key === 'Enter' &&
                                                e.preventDefault()
                                        }}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Position"
                                    invalid={
                                        errors.position && touched.position
                                    }
                                    errorMessage={errors.position}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="position"
                                        component={Input}
                                        onKeyDown={(e) => {
                                            e.key === 'Enter' &&
                                                e.preventDefault()
                                        }}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Gender"
                                    invalid={errors.gender && touched.gender}
                                    errorMessage={errors.gender}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        name="gender"
                                        onKeyDown={(e) => {
                                            e.key === 'Enter' &&
                                                e.preventDefault()
                                        }}
                                    >
                                        {({ field, form }: FieldProps<any>) => {
                                            const genderOptions = [
                                                { value: 'Men', label: 'Men' },
                                                {
                                                    value: 'Women',
                                                    label: 'Women',
                                                },
                                            ]

                                            return (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={genderOptions}
                                                    value={genderOptions.find(
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
                                                />
                                            )
                                        }}
                                    </Field>
                                </FormItem>
                            </FormContainer>

                            {/* Select boxes */}

                            <FormItem
                                label="ACTIVE"
                                invalid={errors.is_active && touched.is_active}
                            >
                                <Field
                                    name="is_active"
                                    component={Checkbox}
                                    onKeyDown={(e) => {
                                        e.key === 'Enter' && e.preventDefault()
                                    }}
                                >
                                    Active
                                </Field>
                            </FormItem>

                            <FormItem
                                label="TRY & BUY"
                                invalid={
                                    errors.is_try_and_buy &&
                                    touched.is_try_and_buy
                                }
                            >
                                <Field
                                    name="is_try_and_buy"
                                    component={Checkbox}
                                    onKeyDown={(e) => {
                                        e.key === 'Enter' && e.preventDefault()
                                    }}
                                >
                                    Try and Buy
                                </Field>
                            </FormItem>

                            {/* Handle Submit */}

                            <FormItem>
                                <Button
                                    type="reset"
                                    className="ltr:mr-2 rtl:ml-2"
                                    onClick={() => resetForm()}
                                >
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

export default CategoryEdit
