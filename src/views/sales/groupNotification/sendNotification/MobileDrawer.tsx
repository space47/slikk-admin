import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
import MobilePreview from './mobilePreview/MobilePreview'

interface MobileDrawerProps {
    messagePreview: any
    image: any
    title: any
    dialogIsOpen: any
    setIsOpen: any
}

const MobileDrawer = ({ messagePreview, image, title, dialogIsOpen, setIsOpen }: MobileDrawerProps) => {
    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    return (
        <div className="h-[500px]">
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose} className="h-screen">
                <div className="w-[300px] bg-contain h-[530px] rounded-[24px] shadow-2xl overflow-hidden bg-gray-100 relative sm:inline xl:inline flex justify-center">
                    <img src="/img/logo/mobilePreview.jpeg" alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-10 left-1 right-1">
                        <MobilePreview message={messagePreview} image={image} title={title} />
                    </div>
                </div>
                <div className="mt-10">
                    <Button variant="solid" onClick={() => setIsOpen(false)} className="">
                        Close
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default MobileDrawer
