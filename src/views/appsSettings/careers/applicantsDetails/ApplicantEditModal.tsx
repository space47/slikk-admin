import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'

interface props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    currentStatus: string
    currentId: number | undefined
}

const ApplicantEditModal = ({ dialogIsOpen, setIsOpen, currentStatus, currentId }: props) => {
    const onDialogClose = () => {
        setIsOpen(false)
    }

    const onDialogOk = async () => {
        const body = {
            status: currentStatus,
        }
        try {
            const response = await axioisInstance.patch(`/job/applications/${currentId}`, body)
            notification.success({
                message: response.data.message || 'Successfully changed the status',
            })
        } catch (error: any) {
            console.log(error)
            notification.error({
                message: error?.response.data.message || 'Dailed to change the status',
            })
        } finally {
            setIsOpen(false)
        }
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose} className="">
                <h5 className="mb-4 text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Change Applicant Status
                </h5>
                <p className="text-gray-700 text-sm">
                    Are you sure you want to change the status of the applicant to{' '}
                    <span className="font-semibold text-purple-600">{currentStatus}</span>?
                </p>
                <div className="flex justify-end mt-6 space-x-2">
                    <Button
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                        variant="plain"
                        onClick={onDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                        variant="solid"
                        onClick={onDialogOk}
                    >
                        Okay
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default ApplicantEditModal
