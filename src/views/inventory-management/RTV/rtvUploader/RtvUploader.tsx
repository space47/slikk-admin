import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import { FcImageFile } from 'react-icons/fc'
import { useState } from 'react'
import FormData from 'form-data'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { Select } from '@/components/ui'
import { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'

const IndentUploader = () => {
    const [file, setFile] = useState<File | null>(null)
    const [company, setCompany] = useState<number | null>(null)
    const companyList = useAppSelector<USER_PROFILE_DATA['company']>((state) => state.company.company)

    console.log('company is', company)

    const onFileUpload = (fileList: File[]) => {
        setFile(fileList[0])
    }

    const handleSave = async () => {
        if (!file) {
            notification.error({ message: 'No file uploaded' })
            return
        }

        const formData = new FormData()
        formData.append('rtv_products_file', file)
        formData.append('company', company)
        try {
            const response = await axioisInstance.post('/rtv-products/bulkupload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            notification.success({ message: response?.data?.message || 'File uploaded successfully' })
            setFile(null)
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error)
                notification.error({
                    message: `STATUS:- ${error?.response?.status}`,
                    description: error?.response?.data?.message || error?.message || 'File upload failed',
                })
            }
        }
    }

    return (
        <div className="w-full mb-5">
            <div className="flex justify-end mb-10">
                <a
                    className="p-2 rounded-xl bg-gradient-to-r bg-blue-500 hover:bg-blue-700 text-white no-underline flex gap-2 font-bold backdrop-blur-sm"
                    href="https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/SampleFiles-Dashboard/rtv_sample.csv"
                >
                    Download Sample File
                </a>
            </div>
            <Upload uploadLimit={1} onChange={onFileUpload} draggable>
                <div className="my-16 text-center">
                    <div className="text-6xl mb-4 flex justify-center">
                        <FcImageFile />
                    </div>
                    <p className="font-semibold">
                        <span className="text-gray-800 dark:text-white">Drop your file here, or </span>
                        <span className="text-blue-500">browse</span>
                    </p>
                    <p className="mt-1 opacity-60 dark:text-white">Support: jpeg, png, gif, csv</p>
                </div>
            </Upload>
            <div className="flex flex-row w-full space-x-[2%] items-center justify-center">
                <div className="flex flex-col w-full max-w-[400px]">
                    <label className="font-semibold text-gray-700 mb-1">Select Company</label>
                    <Select
                        isClearable
                        options={companyList}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id?.toString()}
                        onChange={(selectedOptions) => {
                            setCompany(selectedOptions?.id || null)
                        }}
                    />
                </div>
                <Button onClick={handleSave} variant="twoTone" className="mt-5">
                    Upload
                </Button>
            </div>
        </div>
    )
}

export default IndentUploader
