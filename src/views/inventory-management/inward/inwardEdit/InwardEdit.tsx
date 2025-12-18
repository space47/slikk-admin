/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import moment from 'moment'
import { FormModel } from './inwardEditCommon'
import InwardForm from '../inwardUtils/InwardForm'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { filterEmptyChangedValues, getChangedValues } from '@/utils/apiBodyUtility'
import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import LoadingSpinner from '@/common/LoadingSpinner'
import { textParser } from '@/common/textParser'

const InwardEdit = () => {
    const [grnData, setGrnData] = useState<FormModel>()
    const [imagview, setImageView] = useState<string[]>([])
    const [showData, setShowData] = useState(false)
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const [companyData, setCompanyData] = useState<number>()
    const { grn } = useParams()

    const navigate = useNavigate()

    const { data, loading } = useFetchSingleData<FormModel>({ url: `goods/received?grn_number=${grn}`, initialData: undefined })

    console.log('data is', data)

    useEffect(() => {
        if (data) {
            setGrnData(data)
            setImageView(data?.images?.split(',') || [])
        }
    }, [data])

    const handleUpload = async (files: File[]) => {
        const formData = new FormData()
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
            setGrnData(newData)
            setShowData(true)
            successMessage(response)
            return newData
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
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
            successMessage(response)
            return newData
        } catch (error: any) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
            return 'Error'
        }
    }

    const initialValue: FormModel = {
        select: grnData?.select || '',
        create_date: grnData?.create_date ? moment(grnData.create_date).format('YYYY-MM-DD') : '',
        singleCheckbox: grnData?.singleCheckbox || false,
        file_type: grnData?.file_type || '',
        document_number: grnData?.document_number || '',
        company: grnData?.company,
        files: grnData?.files || [],
        received_by: {
            name: grnData?.received_by?.name || '',
            mobile: grnData?.received_by?.mobile || '',
            email: grnData?.received_by?.email || '',
        },
        document_date: grnData?.document_date ? moment(grnData?.document_date).format('YYYY-MM-DD') : '',
        origin_address: grnData?.origin_address || '',
        received_address: grnData?.received_address || '',
        slikk_owned: grnData?.slikk_owned || false,
        total_sku: grnData?.total_sku || null,
        total_quantity: grnData?.total_quantity || null,
        document: grnData?.document || '',
        images: grnData?.images || '',
        image: grnData?.image || [],
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
        const imageShow = values.image?.length > 0 ? await processUpload(handleimage, values.image, values.images) : ''
        const receiverAddress = textParser(values?.received_address) || ''
        const originAddress = textParser(values?.origin_address) || ''

        const formData = {
            document_date: values?.document_date,
            total_quantity: values?.total_quantity,
            total_sku: values?.total_sku,
            slikk_owned: values?.slikk_owned,
            received_by: typeof values?.received_by === 'object' ? (values?.received_by as any)?.mobile : values?.received_by,
            document_number: values?.document_number,
            received_address: receiverAddress,
            origin_address: originAddress,
            company: companyData,
            document: docsShow,
            images: imageShow || '',
        }

        const changedValues = getChangedValues(initialValue, formData as any)
        const filteredBody = filterEmptyChangedValues(initialValue, changedValues)

        try {
            const response = await axioisInstance.patch(`goods/received/${grnData?.id}`, filteredBody)
            successMessage(response)
            navigate('/app/goods/received')
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }
    return (
        <div>
            {loading && <LoadingSpinner />}
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, resetForm }) => (
                    <InwardForm
                        isEdit
                        companyList={companyList}
                        datas={grnData}
                        imagview={imagview}
                        resetForm={resetForm}
                        setCompanyData={setCompanyData}
                        showData={showData}
                        values={values}
                    />
                )}
            </Formik>
        </div>
    )
}

export default InwardEdit
