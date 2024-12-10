import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'

interface BlockUserModal {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    handleDialogOk: any
    name?: any
}

const BlockUserModal = ({ dialogIsOpen, setIsOpen, handleDialogOk, name }: BlockUserModal) => {
    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <div className="flex flex-col gap-4 font-bold">
                    <h3 className="text-red-500">Block User</h3>
                    <div className="">
                        Are you sure you want to Block <span className="text-gray-700 underline">{name}</span>
                    </div>
                </div>
                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="reject" onClick={handleDialogOk}>
                        Block
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default BlockUserModal
