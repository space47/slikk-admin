/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { INITIALVALUES } from '../catalog/ProductCommon'
import { AiOutlineCopy } from 'react-icons/ai'
import Spinner from '@/components/ui/Spinner'
import UploaderComponent from './UploaderComponent/UploaderComponent'
import { beforeUpload } from '@/common/beforeUpload'
import { beforeVideoUpload } from '@/common/beforUploadVideo'

const Uploader = () => {
    const [finalImage, setFinalImage] = useState('')
    const [finalVideo, setFinalVideo] = useState('')
    const [finalColorLink, setFinalColorLink] = useState('')
    const [finalSizeChart, setFinalSizeChart] = useState('')
    const [showLoading, setShowLoading] = useState(false)

    const DataArrays = [
        { label: 'Image', value: finalImage },
        { label: 'Video', value: finalVideo },
        { label: 'Size Chart', value: finalSizeChart },
        { label: 'Color Link', value: finalColorLink },
    ]

    const handleimage = async (files: File[]) => {
        console.log('filles ara', files)
        const formData = new FormData()
        files.forEach((file) => {
            formData.append('file', file)
        })
        formData.append('file_type', 'product')
        formData.append('file_type', 'product')
        formData.append('compression_service', 'slikk')
        try {
            console.log(formData.get('file'))
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            const newData = response.data.url
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
        formData.append('compression_service', 'slikk')

        try {
            console.log(formData.get('file'))
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log(response)
            const newData = response.data.url
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

    const handleSubmit = async (values: any) => {
        setShowLoading(true)
        const imageUpload = await handleImageCheck(values.images)
        const colorlink = await handleImageCheck(values.color_code)
        const videoUpload = await handleVideoCheck(values.video)
        const sizeChartUpload = await handleImageCheck(values.sizeChartArray)
        const imageShow = fileShow(imageUpload, values.image)
        const colorCodeShow = fileShow(colorlink, values.color_code_link)
        const videoShow = fileShow(videoUpload, values.video_link)
        const sizeChartShow = fileShow(sizeChartUpload, values.sizeChart)
        notification.success({ message: 'Link has been Generated' })
        setFinalImage(imageShow)
        setFinalColorLink(colorCodeShow)
        setFinalVideo(videoShow)
        setFinalSizeChart(sizeChartShow)
        setShowLoading(false)
    }

    const handleCopy = (file: any) => {
        navigator.clipboard.writeText(file)
        notification.success({ message: 'Copied' })
    }

    const handleDataReset = () => {
        setFinalImage('')
        setFinalVideo('')
        setFinalColorLink('')
        setFinalSizeChart('')
    }

    return (
        <div>
            <div className="text-xl mb-2 font-bold">Upload to Generate Links</div>
            <Formik enableReinitialize initialValues={INITIALVALUES} onSubmit={handleSubmit}>
                {({ values, resetForm }) => (
                    <Form className="w-full shadow-xl p-4 rounded-xl">
                        <FormContainer>
                            <UploaderComponent
                                name="image"
                                label="IMAGE"
                                fieldname="images"
                                fileList={values.images}
                                beforeFileUpload={beforeUpload}
                            />
                            <UploaderComponent
                                name="color_code"
                                label="COLOR CODE THUMBNAIL"
                                fieldname="color_code"
                                fileList={values.color_code}
                                beforeFileUpload={beforeUpload}
                            />
                            <UploaderComponent
                                name="sizeChart"
                                label="SIZE CHART"
                                fieldname="sizeChartArray"
                                fileList={values.sizeChartArray}
                                beforeFileUpload={beforeUpload}
                            />
                            <UploaderComponent
                                name="video_link"
                                label="VIDEO"
                                fieldname="video"
                                fileList={values.video}
                                beforeFileUpload={beforeVideoUpload}
                            />
                            <FormContainer className="flex justify-end mt-5">
                                <Button type="reset" className="mr-2" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit" className="bg-blue-500 text-white">
                                    Generate
                                </Button>
                            </FormContainer>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
            {DataArrays?.map((item, index) => (
                <div key={index} className="flex flex-col mt-10">
                    {item?.value && !showLoading && (
                        <div className="flex gap-2 items-center">
                            <p className="text-lg font-bold">{item?.label}:</p>
                            <div className="flex gap-2 shadow-lg w-[660px] h-[30px] items-center text-md overflow-hidden text-ellipsis text-xl">
                                <p className="truncate">{item?.value}</p>
                            </div>
                            <AiOutlineCopy className="text-gray-500 cursor-pointer text-xl" onClick={() => handleCopy(item?.value)} />
                        </div>
                    )}
                </div>
            ))}
            {finalImage || finalColorLink || finalVideo || finalSizeChart ? (
                <div className="">
                    <Button variant="default" size="sm" onClick={handleDataReset}>
                        Reset Data
                    </Button>
                </div>
            ) : (
                ''
            )}
            {showLoading && (
                <div className="flex justify-center items-center">
                    <Spinner size="40px" />
                </div>
            )}
        </div>
    )
}

export default Uploader
