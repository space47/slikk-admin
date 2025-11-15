import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import { FcImageFile } from 'react-icons/fc'
import { useState } from 'react'
import FormData from 'form-data'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { useAppSelector } from '@/store'
import { AxiosError } from 'axios'
import { Select } from '@/components/ui'

const IndentUploader = () => {
    // const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [file, setFile] = useState<File | null>(null)
    const [storeCode, setStoreCode] = useState('')
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)

    const onFileUpload = (fileList: File[]) => {
        setFile(fileList[0])
    }

    const handleSave = async () => {
        if (!file) {
            notification.error({ message: 'No file uploaded' })
            return
        }
        if (!storeCode) {
            notification.error({ message: 'No store selected' })
            return
        }
        const formData = new FormData()
        formData.append('indent_file', file)
        formData.append('target_store', storeCode)

        try {
            const response = await axioisInstance.post('/indent/bulkupload', formData, {
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
                    className="p-2 rounded-xl bg-gradient-to-r from-blue-500/80 to-blue-700/80 hover:from-blue-600/90 hover:to-blue-800/90 text-white no-underline flex gap-2 font-bold backdrop-blur-sm"
                    href="https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/Indent-Sample-File.csv"
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
                    <label className="font-semibold text-gray-700 mb-1">Select Target Store</label>
                    <Select
                        isClearable
                        options={storeList}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id?.toString()}
                        onChange={(selectedOptions) => {
                            setStoreCode(selectedOptions?.code || '')
                        }}
                    />
                </div>
                <Button onClick={handleSave} className="mt-5">
                    Upload
                </Button>
            </div>
        </div>
    )
}

export default IndentUploader
