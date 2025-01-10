import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import QRCode from 'react-qr-code'

interface props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    value: string | undefined
}

const QRcodeModal = ({ dialogIsOpen, setIsOpen, value }: props) => {
    console.log('URL IS', value)

    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = (e: MouseEvent) => {
        console.log('onDialogOk', e)
        setIsOpen(false)
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <h5 className="mb-4">QR CODE</h5>
                <div className="flex justify-center">
                    <QRCode value={value ?? ''} />
                </div>
                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={onDialogOk}>
                        Okay
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default QRcodeModal
