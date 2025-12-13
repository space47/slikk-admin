/* eslint-disable @typescript-eslint/no-explicit-any */

import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'

interface BlockUserModal {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    handleDialogOk: any
    name?: any
    unBlock?: boolean
}

const BlockUserModal = ({ dialogIsOpen, setIsOpen, handleDialogOk, name, unBlock }: BlockUserModal) => {
    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <div className="flex flex-col gap-4 font-bold">
                    <h3 className="text-red-500">{unBlock ? 'Un-Block' : 'Block'} User</h3>
                    <div className="">
                        Are you sure you want to {unBlock ? 'Un-Block' : 'Block'}
                        <span className="text-gray-700 underline">{name}</span>
                    </div>
                </div>
                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="reject" onClick={handleDialogOk}>
                        {unBlock ? 'Un-Block' : 'Block'}
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default BlockUserModal
