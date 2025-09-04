/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Field, Form, Formik, FieldProps } from 'formik' // Add FieldProps here
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { CREATE_POST } from './commonPost'
import Upload from '@/components/ui/Upload'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import CreatePostTable from './CreatePostTable'
import Spinner from '@/components/ui/Spinner'

type ProductTable = {
    sku: string
    barcode: string
    product: string
    image: string[]
    brand: string
}

interface Product {
    barcode: string
    mrp: string
    sp: string
    name: string
    brand: string
    product_feedback: string | null
    is_wish_listed: boolean
    is_try_and_buy: boolean
    trends: any | null
    styles: any | null
    inventory_count: number
    image: string
    division: string
    category: string
    sub_category: string
    product_type: string
    variants: any[]
}

interface Post {
    products: Product[]
    file: string
    file_array: File[]
    caption: string
    type: string
    latitude: string
    longitude: string
    thumbnail: string
    thumbnail_array: File[]
    mobile: string
}

const initialValue: Post = {
    products: [],
    file: '',
    file_array: [],
    caption: '',
    type: '',
    latitude: '',
    longitude: '',
    thumbnail: '',
    thumbnail_array: [],
    mobile: '',
}

const SegmentOptions = () => {
    return ['video', 'image'].map((option) => ({
        label: option,
        value: option,
    }))
}

const DROPDOWNARRAY = [
    { label: 'Name', value: 'name' },
    { label: 'SKU', value: 'sku' },
    { label: 'Barcode', value: 'barcode' },
]

const CreatePost = () => {
    const navigate = useNavigate()

    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>()
    const [searchInput, setSearchInput] = useState<string>('')
    const [showTable, setShowTable] = useState(false)
    const [tableData, setTableData] = useState<ProductTable[]>([])
    const [productData, setProductData] = useState<string[]>([])
    const [submitLoader, setSubmitLoader] = useState(false)

    const handleSelect = (value: any) => {
        const selected = DROPDOWNARRAY.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    const MAX_UPLOAD = 1000000000000000

    const beforeUpload = (file: FileList | null, fileList: File[]) => {
        let valid: string | boolean = true

        const allowedFileType = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'image/png',
            'image/JPEG',
            'image/JPG',
            'image/WEBP',
            'image/PNG',
            'text/csv',
            'video/mp4',
            'video/mov',
            'video/flv',
            'video/avi',
            'video/wmv',
            'video/webm',
            'video/avchd',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/zip',
            'application/json',
            'video/lottie+json',
            'application/x-zip',
            'application/x-zip-compressed',
            'application/octet-stream',
            'multipart/x-zip',
        ]
        const MAX_FILE_SIZE = 50000000000000

        if (fileList.length >= MAX_UPLOAD) {
            return `You can only upload ${MAX_UPLOAD} file(s)`
        }

        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload a valid file format'
                }

                if (f.size >= MAX_FILE_SIZE) {
                    valid = 'Upload image cannot more then 50MB!'
                }
            }
        }

        return valid
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
        setShowTable(true)
    }

    const fetchInput = async () => {
        try {
            if (searchInput) {
                const qname =
                    currentSelectedPage?.value === 'sku'
                        ? 'sku'
                        : currentSelectedPage?.value === 'name'
                          ? 'name'
                          : currentSelectedPage?.value === 'barcode'
                            ? 'barcode'
                            : ''
                const response = await axioisInstance.get(`/merchant/products?dashboard=true&${qname}=${searchInput}`)
                const data = response.data.data.results
                setTableData(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchInput()
    }, [searchInput])

    const handleActionClick = (value: any) => {
        console.log('Barcode', value)
        setProductData((prev) => (prev ? [...prev, value] : [value]))
        setShowTable(false)
        setSearchInput('')
    }

    console.log('DATATOFTHEHERO', productData)

    const handleSubmit = async (values: Post) => {
        console.log('Type', values.type)
        console.log('Products', values.products)

        // if (productData.length === 0) {
        //     notification.warning({
        //         message: 'CAUTION',
        //         description: 'Please add at least one product',
        //     })
        //     return
        // }
        setSubmitLoader(true)

        try {
            console.log('Checking formdata')

            console.log('Product Data:', productData)
            console.log('Joining', productData.join(','))

            const formData = new FormData()

            if (values.file_array.length > 0) {
                formData.append('file', values.file_array[0])
            }

            if (values.thumbnail_array.length > 0) {
                formData.append('thumbnail', values.thumbnail_array[0])
            }

            formData.append('caption', values.caption)
            formData.append('products', productData.join(','))
            formData.append('type', values.type)
            formData.append('latitude', values.latitude)
            formData.append('longitude', values.longitude)
            formData.append('mobile', values.mobile)
            console.log('Finished checking formdata')
            console.log('Starting API call')
            const response = await axioisInstance.post('merchant/userpost', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            setSubmitLoader(false)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'POST created successfully',
            })
            navigate('/app/uploadPost')
            console.log('Ending API call')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            setSubmitLoader(false)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'POST not created',
            })
        }
    }

    return (
        <div>
            <h3 className="mb-5 from-neutral-900">Create Post</h3>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, resetForm, setFieldValue }) => (
                    <Form className="w-2/3" onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}>
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {CREATE_POST.map((item, key) => (
                                    <FormItem key={key} label={item.label} className={item.className}>
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}

                                <FormItem asterisk label="Type" className="col-span-1 w-full">
                                    <Field name="type">
                                        {({ field, form }: FieldProps) => (
                                            <Select
                                                {...field}
                                                value={SegmentOptions().find((option) => option.value === field.value)}
                                                options={SegmentOptions()}
                                                onChange={(option) => form.setFieldValue('type', option?.value)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>

                            {/* ---------I--M--A--G--E--S------------------------------------------------------------------------------- */}
                            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                Image / Video
                                <FormContainer className=" mt-5 ">
                                    <FormItem label="" className="grid grid-rows-2">
                                        <Field name="file_array">
                                            {({ form }: FieldProps<Product>) => (
                                                <>
                                                    <Upload
                                                        multiple
                                                        beforeUpload={beforeUpload}
                                                        fileList={values.file_array}
                                                        onChange={(files) => form.setFieldValue('file_array', files)}
                                                        onFileRemove={(files) => form.setFieldValue('file_array', files)}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                    </FormItem>
                                </FormContainer>
                            </FormContainer>
                            {/*  */}

                            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4">
                                Thumbnail
                                <FormContainer className=" mt-5 ">
                                    <FormItem label="" className="grid grid-rows-2">
                                        <Field name="thumbnail_array">
                                            {({ form }: FieldProps<Product>) => (
                                                <>
                                                    <Upload
                                                        multiple
                                                        beforeUpload={beforeUpload}
                                                        fileList={values.thumbnail_array}
                                                        onChange={(files) => form.setFieldValue('thumbnail_array', files)}
                                                        onFileRemove={(files) => form.setFieldValue('thumbnail_array', files)}
                                                        // uploadButtonText="Add Files"
                                                    />
                                                </>
                                            )}
                                        </Field>
                                    </FormItem>
                                </FormContainer>
                            </FormContainer>
                            {/*  */}

                            <FormContainer className="flex flex-col gap-4 ">
                                <div className="text-xl">Barcode</div>
                                <div className="flex gap-10">
                                    <div className="flex justify-start ">
                                        <input
                                            type="search"
                                            name="search"
                                            id=""
                                            placeholder="search SKU for product"
                                            value={searchInput}
                                            className=" w-[250px] rounded-[10px]"
                                            onChange={handleSearch}
                                        />
                                    </div>
                                    <div className="bg-gray-200 rounded-[10px] font-bold text-lg ">
                                        <Dropdown
                                            className=" text-xl text-black bg-gray-200 font-bold "
                                            title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                            onSelect={handleSelect}
                                        >
                                            {DROPDOWNARRAY?.map((item, key) => {
                                                return (
                                                    <DropdownItem key={key} eventKey={item.value}>
                                                        <span>{item.label}</span>
                                                    </DropdownItem>
                                                )
                                            })}
                                        </Dropdown>
                                    </div>
                                </div>

                                {showTable && searchInput && <CreatePostTable data={tableData} handleActionClick={handleActionClick} />}

                                <FormItem label="Product" className="w-1/2">
                                    <Field
                                        type="text"
                                        name="products"
                                        value={productData}
                                        onChange={(e: any) => {
                                            setProductData(e.target.value)
                                            setFieldValue('products', e.target.value)
                                        }}
                                        placeholder="Enter product barcode"
                                    />
                                </FormItem>
                            </FormContainer>

                            <FormContainer className="flex justify-end mt-5">
                                {submitLoader ? (
                                    <Spinner className="mr-4" size="50px" />
                                ) : (
                                    <>
                                        <Button type="reset" className="mr-2 bg-gray-600" onClick={() => resetForm()}>
                                            Reset
                                        </Button>
                                        <Button variant="solid" type="submit" className=" text-white">
                                            Submit
                                        </Button>
                                    </>
                                )}
                            </FormContainer>
                            <div className="flex justify-end items-center mt-6"></div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default CreatePost
