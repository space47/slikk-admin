import type { MouseEvent } from 'react'
import { Dialog } from '@/components/ui'

interface PreviousConfigProps {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    handlePreviousConfigClick: (index: number) => void
}

const PreviousConfiguration = ({ isOpen, setIsOpen, handlePreviousConfigClick }: PreviousConfigProps) => {
    const onDialogClose = (e: MouseEvent) => {
        console.log('onDrawerClose', e)
        setIsOpen(false)
    }

    return (
        <div>
            <Dialog isOpen={isOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <div className="flex flex-col gap-4 mb-6 max-w-sm mx-auto">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Select a Configuration</h2>
                    {[...Array(10).keys()].map((num) => (
                        <button
                            key={num}
                            onClick={() => handlePreviousConfigClick(num)}
                            className="px-5 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-medium rounded-lg shadow hover:from-gray-300 hover:to-gray-400 hover:text-white active:bg-gray-500 transition-transform transform hover:scale-105 active:scale-95"
                        >
                            Configuration {num + 1}
                        </button>
                    ))}
                </div>
            </Dialog>
        </div>
    )
}

export default PreviousConfiguration
