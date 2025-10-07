import { Button, Dialog, Spinner } from '@/components/ui'
import { AxiosError } from 'axios'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { filterEmptyValues } from '@/utils/apiBodyUtility'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'

interface Props {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    storeId: number
    checked: boolean
}

const ActiveStoreModal: React.FC<Props> = ({ isOpen, setIsOpen, storeId, checked }) => {
    const [spinning, setSpinning] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async () => {
        setSpinning(true)
        const body = {
            store_id: storeId,
            status: checked ? 'close' : 'open',
        }

        const filteredBody = filterEmptyValues(body)

        try {
            const res = await axiosInstance.post(`/update/store/availability`, filteredBody)
            successMessage(res)
            setTimeout(() => {
                navigate(0)
            }, 2000)
        } catch (error) {
            errorMessage(error as AxiosError)
        } finally {
            setSpinning(false)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className="p-6 space-y-6 text-center">
                <h2 className="text-lg font-semibold text-gray-800">{checked ? 'Deactivate Store' : 'Activate Store'}</h2>
                <p className="text-sm text-gray-600">
                    Are you sure you want to set this store as{' '}
                    <span className="font-medium text-gray-900">{checked ? 'Inactive' : 'Active'}</span>?
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <Button variant={checked ? 'reject' : 'solid'} onClick={handleSubmit}>
                        <span className="flex gap-2  items-center">
                            {spinning && <Spinner size={20} color="ffffff" />} <span>Confirm</span>
                        </span>
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default ActiveStoreModal
