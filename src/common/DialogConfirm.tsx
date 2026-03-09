/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi'

interface ConfirmationDialogProps extends React.PropsWithChildren {
    IsOpen: boolean
    setIsOpen?: (value: React.SetStateAction<boolean>) => void
    onDialogOk: any
    IsDelete?: boolean
    IsConfirm?: boolean
    headingName?: string
    checkBox?: boolean
    label?: string
    closeDialog?: () => void
    isProceed?: boolean
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
    isProceed,
    children,
}: ConfirmationDialogProps) => {
    const onDialogClose = () => {
        if (checkBox) {
            onDialogOk(false)
        }
        if (setIsOpen) setIsOpen(false)
    }

    return (
        <div className="z-50">
            <Dialog isOpen={IsOpen} onClose={closeDialog ?? onDialogClose} onRequestClose={closeDialog ?? onDialogClose}>
                <div className="flex flex-col gap-6 px-2">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex h-11 w-11 items-center justify-center rounded-full
                            ${IsDelete ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                        `}
                        >
                            {IsDelete ? <FiTrash2 size={22} /> : <FiAlertTriangle size={22} />}
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{headingName}</h3>

                            {IsConfirm && (
                                <p className="mt-1 text-sm text-gray-600">
                                    Are you sure you want to perform this <span className="font-medium">{label || 'action'}</span>?
                                </p>
                            )}

                            {IsDelete && (
                                <p className="mt-1 text-sm text-red-600">
                                    This action cannot be undone. Are you sure you want to delete{' '}
                                    <span className="font-medium">{label || 'this item'}</span>?
                                </p>
                            )}

                            {isProceed && <p className="mt-1 text-sm text-gray-600">{label}</p>}
                        </div>
                    </div>
                    {children && <div className="px-1">{children}</div>}
                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t pt-4">
                        <Button variant="default" onClick={closeDialog ?? onDialogClose}>
                            Cancel
                        </Button>

                        {(IsConfirm || isProceed) && (
                            <Button variant="solid" onClick={onDialogOk}>
                                Confirm
                            </Button>
                        )}

                        {IsDelete && (
                            <Button variant="reject" onClick={onDialogOk}>
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default DialogConfirm
