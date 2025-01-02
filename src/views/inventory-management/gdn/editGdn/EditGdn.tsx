import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Formik } from 'formik'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import GdnForm from '../GdnForm'
import { DocumentArrayGDN, receiveAddress } from '../commonGdn'
import axios from 'axios'

const EditGdn = () => {
    const [datas, setDatas] = useState<FormModel>()
    const [imagview, setImageView] = useState<string[]>([])
    const [showData, setShowData] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const [docsView, setDocsView] = useState<string[]>([])
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [companyData, setCompanyData] = useState<number>()
    const { document_number } = useParams()
    console.log('docs', docsView)
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`/goods/dispatch/${selectedCompany?.id}/${document_number}`)
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
    }, [selectedCompany])

    console.log('Datas', datas)

    const initialValue = {
        select: datas?.select || '',
        create_date: datas?.create_date ? moment(datas.create_date).format('YYYY-MM-DD') : '',
        singleCheckbox: datas?.singleCheckbox || false,
        file_type: datas?.file_type || '',
        document_number: datas?.document_number || '',
        company: datas?.company,
        files: datas?.files || [],
        document_date: datas?.document_date ? moment(datas?.document_date).format('YYYY-MM-DD') : '',
        origin_address: datas?.origin_address || '',
        delivery_address: datas?.delivery_address || '',
        slikk_owned: datas?.slikk_owned || false,
        total_sku: datas?.total_sku || null,
        total_quantity: datas?.total_quantity || null,
        document: datas?.document || '',
        images: datas?.images || '',
        image: datas?.image || [],
    }

    const handleUpload = async (files: File[]): Promise<string[]> => {
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

            notification.success({
                message: 'Success',
                description: response?.data?.message || 'File uploaded successfully',
            })

            return response.data.url // Ensure consistent return as an array
        } catch (error: any) {
            console.error('Error uploading files:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'File not uploaded',
            })
            return []
        }
    }

    const handleimage = async (files: File[]): Promise<string[]> => {
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
            console.log('response of image', response.data)

            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Image uploaded successfully',
            })

            return response.data?.url
        } catch (error: any) {
            console.error('Error uploading images:', error)
            notification.error({
                message: 'Failure',
                description: error?.response?.data?.message || 'Image not uploaded',
            })
            return []
        }
    }

    const processUpload = async (uploadHandler: any, value: any, existingValue: any) => {
        console.log('value inside Process', value)
        let uploadResult = null

        if (value && value.length > 0) {
            uploadResult = await uploadHandler(value)
            console.log('final result is ', uploadResult)
        }

        if (uploadResult && existingValue) {
            return [uploadResult, existingValue].join(',')
        } else if (uploadResult) {
            return uploadResult
        } else {
            return existingValue
        }
    }

    const handleSubmit = async (values: any) => {
        console.log('Values of edit GDN', values)
        const docsShow = await processUpload(handleUpload, values.files, values.document)
        const imageShow = await processUpload(handleimage, values.image, values.images)

        console.log('Doocs', docsShow)
        console.log('Imgs', imageShow)

        const formData = {
            document_number: values?.document_number,
            company: companyData,
            received_by: values?.received_by,
            document_date: values?.document_date,
            origin_address: values?.origin_address,
            delivery_address: values?.delivery_address,
            total_sku: values?.total_sku,
            total_quantity: values?.total_quantity,
            document: docsShow,
            images: imageShow,
            // store: 1,
        }

        console.log('formDaata', formData)

        try {
            const response = await axioisInstance.patch(`/goods/dispatch/${datas?.id}`, formData)

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
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, touched, errors, resetForm }) => (
                    <div>
                        <GdnForm
                            values={values}
                            resetForm={resetForm}
                            showData={showData}
                            showImage={showImage}
                            imagview={imagview}
                            receiveAddress={receiveAddress}
                            DocumentArray={DocumentArrayGDN}
                            setCompanyData={setCompanyData}
                            datas={datas}
                            companyList={companyList}
                        />
                    </div>
                )}
            </Formik>
        </div>
    )
}

export default EditGdn
