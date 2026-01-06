import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import { FcImageFile } from 'react-icons/fc'
import { useState } from 'react'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'

type UploadAction = 'create' | 'update'

const ProductUploader = () => {
    const [file, setFile] = useState<File | null>(null)
    const [loadingAction, setLoadingAction] = useState<UploadAction | null>(null)

    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)

    const onFileUpload = (fileList: File[]) => {
        setFile(fileList[0] ?? null)
    }

    const uploadProductFile = async (action: UploadAction) => {
        if (!file) {
            notification.error({ message: 'File is required' })
            return
        }

        const formData = new FormData()
        formData.append('catalogue_file', file)
        formData.append('company', String(selectedCompany.id))

        if (action === 'update') {
            formData.append('action', 'bulk_update')
        }

        try {
            setLoadingAction(action)

            const response = await axioisInstance.post('products/bulkupload', formData)

            successMessage(response)
            setFile(null)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        } finally {
            setLoadingAction(null)
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
                    <p className="mt-1 opacity-60 dark:text-white">Support: csv/xlsx</p>
                </div>
            </Upload>

            <div className="flex justify-center gap-4">
                <Button
                    variant="twoTone"
                    color="green"
                    loading={loadingAction === 'create'}
                    disabled={!!loadingAction}
                    onClick={() => uploadProductFile('create')}
                >
                    Save
                </Button>

                <Button
                    variant="twoTone"
                    color="blue"
                    loading={loadingAction === 'update'}
                    disabled={!!loadingAction}
                    onClick={() => uploadProductFile('update')}
                >
                    Update
                </Button>
            </div>
        </div>
    )
}

export default ProductUploader
