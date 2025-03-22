/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, Form, Formik, FieldProps } from 'formik'
import { useState } from 'react'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import Product from '@/views/category-management/catalog/CommonType'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { PRODUCT_EDIT_COMMON, PRODUCT_EDIT_COMMON_DOWN, INITIALVALUES } from './ProductCommon'
import AddProductImages from './AddProductImages'
import { beforeVideoUpload } from '@/common/beforUploadVideo'
import { beforeUpload } from '@/common/beforeUpload'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { Select } from '@/components/ui'

const AddProduct = () => {
    const [datas, setDatas] = useState()
    const [imagview, setImageView] = useState<string>('')
    const [showData, setShowData] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const navigate = useNavigate()
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const [companyData, setCompanyData] = useState<number>()

    const handleimage = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'product')

        try {
            console.log(formData.get('file'))
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log(response)
            const newData = response.data.url
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

    const handleVideo = async (files: File[]) => {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'product')

        try {
            console.log(formData.get('file'))
            const response = await axioisInstance.post('fileupload', formData, {
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
                description: response?.data?.message || 'Video uploaded successfully',
            })
            return newData
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Video Not uploaded',
            })
            return 'Error'
        }
    }

    const handleImageCheck = async (field: any) => {
        return field && field.length > 0 ? await handleimage(field) : null
    }
    const handleVideoCheck = async (field: any) => {
        return field && field.length > 0 ? await handleVideo(field) : null
    }

    const fileShow = (uploadFile: any, value: any) => {
        if (uploadFile && value) {
            return [uploadFile, value].join(',')
        }
        return uploadFile || value || null
    }

    const handleSubmit = async (values: Product) => {
        const imageUpload = await handleImageCheck(values.images)
        const colorlink = await handleImageCheck(values.color_code)
        const videoUpload = await handleVideoCheck(values.video)
        const sizeUpload = await handleImageCheck(values.size_chart_image_array)

        const imageShow = fileShow(imageUpload, values.image)
        const videoShow = fileShow(videoUpload, values.video_link)
        const sizeShow = fileShow(sizeUpload, values.size_chart_image_array)

        const formData = {
            ...values,
            color_code_link: colorlink ? colorlink : values.color_code_link,
            image: imageShow,
            size_chart_image: sizeShow,
            company: companyData,
            colorfamily: values.colorfamily,
            video_link: videoShow,
        }
        console.log('body  of add', formData)

        try {
            const response = await axioisInstance.post('product/add', formData)
            console.log(response)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Product created Successfully',
            })
            navigate('/app/catalog/products')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Product not created ',
            })
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }

    return (
        <div>
            <h3 className="mb-5 text-neutral-900">ADD NEW PRODUCT</h3>
            <Formik
                enableReinitialize
                initialValues={INITIALVALUES}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm, setFieldValue }) => (
                    <Form className="p-4 w-full shadow-xl rounded-xl" onKeyDown={handleKeyDown}>
                        <FormContainer>
                            <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
                                {PRODUCT_EDIT_COMMON.map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}

                                <AddProductImages
                                    label="Image"
                                    name="image"
                                    fileList={values.images}
                                    beforeUpload={beforeUpload}
                                    fieldNames="images"
                                />
                                <AddProductImages
                                    label="Color Code Thumbnail"
                                    name="color_code_link"
                                    fileList={values.color_code}
                                    beforeUpload={beforeUpload}
                                    fieldNames="color_code"
                                />
                                <AddProductImages
                                    label="Video"
                                    name="video_link"
                                    fileList={values.video}
                                    beforeUpload={beforeVideoUpload}
                                    fieldNames="video"
                                />
                                <AddProductImages
                                    label="Size Chart Upload"
                                    name="size_chart_image"
                                    fileList={values.size_chart_image_array}
                                    beforeUpload={beforeUpload}
                                    fieldNames="size_chart_image_array"
                                />
                                {PRODUCT_EDIT_COMMON_DOWN.slice(0, 5).map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={item.component}
                                        />
                                    </FormItem>
                                ))}

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

                                {PRODUCT_EDIT_COMMON_DOWN.slice(5).map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.classname}>
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={item.component}
                                        />
                                    </FormItem>
                                ))}
                            </div>

                            <FormContainer className="flex justify-end mt-5">
                                <Button type="reset" className="mr-2" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit" className="bg-blue-500 text-white">
                                    Submit
                                </Button>
                            </FormContainer>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddProduct
