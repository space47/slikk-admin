import { Dialog } from '@/components/ui'
import React from 'react'

interface ReturnCancelProps {
    showCancelModal: any
    handleCloseModal: any
    handleCancelReturn: any
}

const ReturnCancelOrder = ({ showCancelModal, handleCancelReturn, handleCloseModal }: ReturnCancelProps) => {
    return (
        <div>
            <Dialog
                width="100%"
                className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 mx-auto p-4 sm:p-6 md:p-8  "
                isOpen={showCancelModal}
                onClose={handleCloseModal}
            >
                <div>Are you sure You want to Cancel the Return Order</div>
                <div>
                    <div className="flex justify-end mt-6 gap-3">
                        <button
                            onClick={handleCloseModal}
                            className="bg-green-600 text-white hover:bg-green-500 transition-colors duration-300 px-4 py-2 rounded-lg"
                        >
                            Reject
                        </button>
                        <button
                            onClick={handleCancelReturn}
                            className="bg-red-600 text-white hover:bg-red-500 transition-colors duration-300 px-4 py-2 rounded-lg"
                        >
                            Convert
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default ReturnCancelOrder
