/* eslint-disable @typescript-eslint/no-explicit-any */
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
                className="w-full   xl:w-1/4 mx-auto p-4 sm:p-6 md:p-8 "
                isOpen={showCancelModal}
                onClose={handleCloseModal}
            >
                <div className="flex flex-col gap-6">
                    <div className="text-xl font-bold">Are you sure You want to Cancel the Return Order</div>
                    <div>
                        <div className="flex justify-end mt-6 gap-3">
                            <button
                                className="bg-green-600 text-white hover:bg-green-500 transition-colors duration-300 px-4 py-2 rounded-lg"
                                onClick={handleCloseModal}
                            >
                                Reject
                            </button>
                            <button
                                className="bg-red-600 text-white hover:bg-red-500 transition-colors duration-300 px-4 py-2 rounded-lg"
                                onClick={handleCancelReturn}
                            >
                                Convert
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default ReturnCancelOrder
