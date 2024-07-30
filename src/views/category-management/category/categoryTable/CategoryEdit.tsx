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
import Select from '@/components/ui/Select'
import * as Yup from 'yup'
import type { FieldProps } from 'formik'
import Textarea from '@/views/ui-components/forms/Input/Textarea'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import Infor from '@/components/template/VerticalMenuContent/Infor'
import Dropdown from '@/components/ui/Dropdown/Dropdown'

type FormModel = {
    id: number
    name: string
    division: number
    division_name: string
    title: string
    description: string
    image: string
    footer: string
    quick_filter_tags: string
    position: number
    gender: string
    is_active: boolean
    create_date: string
    update_date: string
    is_try_and_buy: boolean
    last_updated_by: string
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
    value: string
    label: string
}

const MIN_UPLOAD = 1
const MAX_UPLOAD = 8

const validationSchema = Yup.object().shape({
    document_number: Yup.string().required('Document Number is required'),
    document_date: Yup.date().required('Document Date is required').nullable(),
    origin_address: Yup.string()
        .required('Supplier Address is required')
        .transform((value) => value.trim()),
    received_address: Yup.string()
        .required('Receiver Address is required')
        .transform((value) => value.trim()),
    received_by: Yup.string()
        .required('Received By is required')
        .matches(/^[6-9]\d{9}$/, 'Mobile Number is not valid'),
    total_sku: Yup.number()
        .required('Total SKUs is required')
        .integer('Must be an integer'),
    total_quantity: Yup.number()
        .required('Total Quantity is required')
        .integer('Must be an integer'),
    singleCheckbox: Yup.boolean(),
    // images: Yup.string().nullable(),
    // document: Yup.string().nullable(),
})

const CategoryEdit = () => {
    const [datas, setDatas] = useState()
    const [imagview, setImageView] = useState<string>('')
    const [showData, setShowData] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const { id } = useParams()
    const [catedate, setCateData] = useState<FormModel>()
    const [divdata, setDivData] = useState<Division[]>()
    const [options, setOptions] = useState<Option[]>([])

    const navigate = useNavigate()

    console.log(datas)
    console.log(imagview)
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

    // 1st api................................................................................

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`category?id=${id}`)
            const categoryData = response.data?.data[0] || []
            setCateData(categoryData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const fetchDivision = async () => {
        try {
            const response = await axioisInstance.get(`division`)
            const divisionData = response.data?.data || []
            setDivData(divisionData)
            const transformedOptions = divisionData.map((item: Division) => ({
                value: item.name,
                label: item.name,
            }))
            setOptions(transformedOptions)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchDivision()
    }, [])

    const handleSubmit = async (values: FormModel) => {
        console.log('handleSubmit')
        const docsUpload = await handleUpload(values.files)

        if (docsUpload === 'Error') {
            return
        }
        const imageUpload = await handleimage(values.image)
        if (imageUpload === 'Error') {
            return
        }

        console.log('Dataas', docsUpload)
        console.log('Immage', imageUpload)
        const formData = {
            ...values,
            document: docsUpload,
            images: imageUpload,
        }

        console.log('formDaata', formData)

        try {
            const response = await axioisInstance.post(
                'goods/received',
                formData,
            )

            console.log(response)
            notification.success({
                message: 'Success',
                description:
                    response?.data?.message || 'GRN created Successfully',
            })
            navigate('/app/goods/received')
        } catch (error: any) {
            console.error('Error submitting form:', error)
            notification.error({
                message: 'Failure',
                description:
                    error?.response?.data?.message || 'GRN not created ',
            })
        }
    }

    const initialValue: FormModel = {
        id: 1,
        name: catedate?.name,
        division: 1,
        division_name: catedate?.division_name,
        title: '',
        description: '',
        image: '',
        footer: catedate?.footer,
        quick_filter_tags: '',
        position: 1,
        gender: '',
        is_active: false,
        create_date: '',
        update_date: '',
        is_try_and_buy: false,
        last_updated_by: '',
    }
    const prefilledForm = () => {}

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                validationSchema={validationSchema}
                // ONSUBMIT LOGICCCCCCC....................................................................................................
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="flex flex-row gap-7 ">
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
                                        // initialValues={{ name: catedate?.name }}
                                        // placeholder={catedate?.name}
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label="Division Name"
                                    invalid={
                                        errors.division_name &&
                                        touched.division_name
                                    }
                                    errorMessage={errors.division_name}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field name="division_name">
                                        {({ field, form }: FieldProps<any>) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={options}
                                                className=""
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
                            {/* Second line/////////////////////////////////////////////////////////// */}
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default CategoryEdit
