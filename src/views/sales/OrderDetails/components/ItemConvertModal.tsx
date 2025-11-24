import { Dialog } from '@/components/ui'
import React from 'react'

interface Props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    handleConvert: () => Promise<void>
}

const ItemConvertModal = ({ handleConvert, isOpen, setIsOpen }: Props) => {
    return (
        <Dialog
            width="100%"
            className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 mx-auto p-4 sm:p-6 md:p-8  "
            isOpen={isOpen}
            onClose={() => setIsOpen(true)}
        >
            <div>Are you sure You want to Exchange the Order</div>
            <div>
                <div className="flex justify-end mt-6 gap-3">
                    <button
                        className="bg-green-600 text-white hover:bg-green-500 transition-colors duration-300 px-4 py-2 rounded-lg"
                        onClick={() => setIsOpen(false)}
                    >
                        Reject
                    </button>
                    <button
                        className="bg-red-600 text-white hover:bg-red-500 transition-colors duration-300 px-4 py-2 rounded-lg"
                        onClick={handleConvert}
                    >
                        Convert
                    </button>
                </div>
            </div>
        </Dialog>
    )
}

export default ItemConvertModal
