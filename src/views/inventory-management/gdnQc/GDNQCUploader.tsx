import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import { FcImageFile } from 'react-icons/fc'
import { useState } from 'react'
import FormData from 'form-data'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { useAppSelector } from '@/store'

const GDNQCUploader = () => {
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const [file, setFile] = useState(null)
    const [isSingle, setIsSingle] = useState(false)
    const [loader, setLoader] = useState(false)

    const onFileUpload = (fileList: any) => {
        console.log('File uploaded:', fileList[0])
        setFile(fileList[0])
    }

    const handleSingleGdn = () => {
        setIsSingle((prev) => !prev)
    }

    const handleSave = async () => {
        if (!file) {
            console.log('No file uploaded')
            return
        }

        console.log('File to be uploaded:', file)

        const data = new FormData()
        data.append('dispatch_products_file', file)
        data.append('company', selectedCompany?.id)
        data.append('create_single_gdn', isSingle)

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '/goods/dispatchproductbulkupload',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: data,
        }

        try {
            setLoader(true)
            const response = await axioisInstance(config)
            console.log('File uploaded successfully:', JSON.stringify(response.data))

            notification.success({
                message: 'Success',
                description: response?.data?.message || 'File uploaded successfully',
            })
            setFile(null)
        } catch (error) {
            console.error('File upload error:', error)
            notification.error({
                message: 'failure',
                description: 'File upload failed',
            })
        } finally {
            setLoader(false)
        }
    }

    return (
        <div className="w-full">
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
            <div className="flex flex-row w-full space-x-[3%] items-center justify-center">
                <Button onClick={handleSave} variant="twoTone" size="sm" loading={loader} disabled={loader}>
                    Save
                </Button>
                <div className="flex flex-col gap-2 items-center">
                    <label htmlFor="" className="text-blue-700 font-semibold">
                        Single GDN
                    </label>
                    <input type="checkbox" checked={isSingle} onChange={handleSingleGdn} className="cursor-pointer" />
                </div>
            </div>
        </div>
    )
}

export default GDNQCUploader
