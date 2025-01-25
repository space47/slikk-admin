import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'

interface ConfirmationDialogProps {
    IsOpen: boolean
    setIsOpen: (value: React.SetStateAction<boolean>) => void
    onDialogOk: any
    IsDelete?: boolean
    IsConfirm?: boolean
    headingName?: string
    checkBox?: boolean
}

const DialogConfirm = ({ IsOpen, setIsOpen, onDialogOk, IsDelete, IsConfirm, headingName, checkBox }: ConfirmationDialogProps) => {
    const onDialogClose = () => {
        if (checkBox) {
            onDialogOk(false)
        }
        setIsOpen(false)
    }

    return (
        <div className="z-50">
            <Dialog isOpen={IsOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                {IsConfirm && (
                    <>
                        <div className="flex flex-col gap-4 font-bold">
                            <h3 className="text-blue-500">{headingName}</h3>
                            <div className="">Are you sure you want to perform this action</div>
                        </div>
                    </>
                )}
                {IsDelete && (
                    <>
                        <div className="flex flex-col gap-4 font-bold">
                            <h3>{headingName}</h3>
                            <div className="text-red-700">Are you sure you want to Delete this action</div>
                        </div>
                    </>
                )}
                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                        Cancel
                    </Button>
                    {IsConfirm && (
                        <Button variant="solid" onClick={onDialogOk}>
                            CONFIRM
                        </Button>
                    )}
                    {IsDelete && (
                        <Button variant="reject" onClick={onDialogOk}>
                            DELETE
                        </Button>
                    )}
                </div>
            </Dialog>
        </div>
    )
}

export default DialogConfirm
