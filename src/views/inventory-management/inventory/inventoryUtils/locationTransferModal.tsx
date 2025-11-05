import { Dialog } from '@/components/ui'
import React from 'react'

interface props {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const LocationTransferModal = ({ isOpen, setIsOpen }: props) => {
    return (
        <div>
            <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} onRequestClose={() => setIsOpen(false)}></Dialog>
        </div>
    )
}

export default LocationTransferModal
