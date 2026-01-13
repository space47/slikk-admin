/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'

import { FormModel, initialValue } from '../inwardCommon'

import InwardForm from '../inwardUtils/InwardForm'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { textParser } from '@/common/textParser'
import { inwardService } from '@/store/services/inwardService'
import { notification } from 'antd'

const MixedFormControl = () => {
    const [datas, setDatas] = useState()
    const [showData, setShowData] = useState(false)
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const [companyData, setCompanyData] = useState<number>()
    const [addGrn, addResponse] = inwardService.useAddNewGrnMutation()

    const navigate = useNavigate()

    useEffect(() => {
        if (addResponse?.isSuccess) {
            notification.success({ message: 'Successfully Added' })
            navigate('/app/goods/received')
        }
        if (addResponse?.isError) {
            notification.error({ message: (addResponse.error as any).data?.message || 'Failed to add' })
        }
    }, [addResponse.isError, addResponse.isSuccess])

    const handleUpload = async (files: File[]) => {
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

            const newData = response.data.url
            setDatas(newData)
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
            const response = await axioisInstance.post('fileupload/dashboard', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            const newData = response.data.url
            successMessage(response)
            return newData
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
            return 'Error'
        }
    }

    const handleSubmit = async (values: FormModel) => {
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
        const receiverAddress = textParser(values?.received_address) || ''
        const originAddress = textParser(values?.origin_address) || ''
        const formData = {
            document_date: values?.document_date,
            document_number: values?.document_number,
            total_quantity: values?.total_quantity,
            total_sku: values?.total_sku,
            slikk_owned: values?.slikk_owned,
            company: companyData,
            received_address: receiverAddress,
            origin_address: originAddress,
            document: docsShow,
            received_by: typeof values?.received_by === 'object' ? (values?.received_by as any)?.mobile : values?.received_by,
            images: imageShow,
        }

        addGrn(formData)
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, resetForm }) => (
                    <InwardForm
                        companyList={companyList}
                        datas={datas}
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

export default MixedFormControl
