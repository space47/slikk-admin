import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'

interface props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    handleDelete: any
}

const DeleteTemplateModal = ({ dialogIsOpen, setIsOpen, handleDelete }: props) => {
    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <h5 className="mb-4 text-red-600 font-bold">Delete Message Template</h5>
                <div className="font-bold">Are You Sure You Want to Delete This Template</div>
                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="reject" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default DeleteTemplateModal
