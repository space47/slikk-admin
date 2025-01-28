import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (value: boolean) => void
    idForUpdate: number
    isActive: boolean
}

const ActiveInactiveModal = ({ dialogIsOpen, setIsOpen, idForUpdate, isActive }: Props) => {
    const navigate = useNavigate()
    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = async () => {
        const body = {
            is_active: isActive === true ? false : true,
        }

        try {
            const response = await axioisInstance.patch(`/jobs/${idForUpdate}`, body)
            notification.success({
                message: response?.data?.message || 'Successfully updated',
            })
            navigate(0)
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || 'Failed to update',
            })
            console.error(error)
        }
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <h5 className="mb-4 text-red-500">Make this posting {isActive === true ? 'In-active' : 'Active'}</h5>
                <p className="text-blue-600">
                    Are you sure you want to convert this posting to {isActive === true ? 'In-active' : 'Active'}?
                </p>
                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={onDialogOk}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default ActiveInactiveModal
