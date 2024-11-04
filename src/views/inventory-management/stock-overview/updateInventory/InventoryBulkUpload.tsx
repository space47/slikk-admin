import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
// import { HiOutlineCloudUpload } from 'react-icons/hi';
import { FcImageFile } from 'react-icons/fc'
import { useState } from 'react'
// import axios from 'axios';
import FormData from 'form-data'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

const InventoryBulkUpload = () => {
    const [file, setFile] = useState(null)

    const onFileUpload = (fileList: any) => {
        console.log('File uploaded:', fileList[0])
        setFile(fileList[0])
    }

    const handleSave = async () => {
        if (!file) {
            console.log('No file uploaded')
            return
        }

        const data = new FormData()
        data.append('inventory_file', file)
        data.append('company', '1')

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'inventory/bulk/upload',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: data,
        }

        try {
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
            <div className="flex flex-row w-full space-x-[2%] items-center justify-center">
                <Button onClick={handleSave}>Save</Button>
                <Button>Download</Button>
            </div>
        </div>
    )
}

export default InventoryBulkUpload
