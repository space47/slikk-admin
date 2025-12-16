/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (value: boolean) => void
    idForUpdate: number | string
    isActive: boolean
    url?: string
    label?: string
    refetch?: any
}

const ActiveInactiveModal = ({ dialogIsOpen, setIsOpen, idForUpdate, isActive, url, label, refetch }: Props) => {
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
            const endpoint = url || `/jobs/${idForUpdate}`
            const response = await axioisInstance.patch(endpoint, body)
            notification.success({
                message: response?.data?.message || 'Successfully updated',
            })
            refetch()
            setIsOpen(false)
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: error?.response?.data?.message || 'Failed to update',
                })
            }
            console.error(error)
        }
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <h5 className="mb-4 text-red-500">
                    Make this {label || 'Job'} {isActive === true ? 'In-active' : 'Active'}
                </h5>
                <p className="text-blue-600">
                    Are you sure you want to convert this {label || 'Job'} to {isActive === true ? 'In-active' : 'Active'}?
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
