import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
// import { HiOutlineCloudUpload } from 'react-icons/hi';
import { FcImageFile } from 'react-icons/fc'
import { useState } from 'react'
// import axios from 'axios';
import FormData from 'form-data'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'

const QcActionArray = [
    { label: 'Add', value: 'add' },
    { label: 'Replace', value: 'replace' },
]

const QCUploader = () => {
    const [file, setFile] = useState(null)
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(QcActionArray[0])

    const handleSelect = (value: any) => {
        const selected = QcActionArray.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    console.log('current', currentSelectedPage?.value)

    const onFileUpload = (fileList: any) => {
        console.log('File uploaded:', fileList[0])
        setFile(fileList[0])
    }

    const handleSave = async () => {
        if (!file) {
            console.log('No file uploaded')
            return
        }

        console.log('File to be uploaded:', file)

        const data = new FormData()
        data.append('qc_file', file)
        data.append('company', '1')
        data.append('qc_update_type', currentSelectedPage?.value)

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'goods/qcbulkupload',
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
                <div className="bg-gray-200  px-1 rounded-lg font-bold text-[15px]">
                    <Dropdown
                        className="border   text-black text-lg font-semibold "
                        title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                        onSelect={handleSelect}
                    >
                        <div className="flex flex-col w-full overflow-y-scroll scrollbar-hide xl:h-[600px] xl:overflow-y-scroll font-bold ">
                            {QcActionArray?.map((item, key) => (
                                <DropdownItem key={key} eventKey={item?.value} className="h-1">
                                    {item?.label}
                                </DropdownItem>
                            ))}
                        </div>
                    </Dropdown>
                </div>

                <Button onClick={handleSave}>Save</Button>
                <Button>Download</Button>
            </div>
        </div>
    )
}

export default QCUploader
