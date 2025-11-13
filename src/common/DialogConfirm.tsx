/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

interface ConfirmationDialogProps {
    IsOpen: boolean
    setIsOpen?: (value: React.SetStateAction<boolean>) => void
    onDialogOk: any
    IsDelete?: boolean
    IsConfirm?: boolean
    headingName?: string
    checkBox?: boolean
    label?: string
    closeDialog?: () => void
}

const DialogConfirm = ({
    IsOpen,
    setIsOpen,
    onDialogOk,
    IsDelete,
    IsConfirm,
    headingName,
    checkBox,
    closeDialog,
    label,
}: ConfirmationDialogProps) => {
    const onDialogClose = () => {
        if (checkBox) {
            onDialogOk(false)
        }
        if (setIsOpen) setIsOpen(false)
    }

    return (
        <div className="z-50">
            <Dialog
                isOpen={IsOpen}
                onClose={closeDialog ? closeDialog : onDialogClose}
                onRequestClose={closeDialog ? closeDialog : onDialogClose}
            >
                {IsConfirm && (
                    <>
                        <div className="flex flex-col gap-4 font-bold">
                            <h3 className="text-blue-500">{headingName}</h3>
                            <div className="">Are you sure you want to perform this {label || 'action'}</div>
                        </div>
                    </>
                )}
                {IsDelete && (
                    <>
                        <div className="flex flex-col gap-4 font-bold">
                            <h3>{headingName}</h3>
                            <div className="text-red-700">Are you sure you want to Delete this {label || 'action'}</div>
                        </div>
                    </>
                )}
                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={closeDialog ? closeDialog : onDialogClose}>
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
