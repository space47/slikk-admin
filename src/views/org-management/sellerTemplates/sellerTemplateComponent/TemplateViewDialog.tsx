import { Dialog } from '@/components/ui'
import React from 'react'

interface Props {
    htmlBody: string
    isOpen: boolean
    setIsOpen: (x: boolean) => void
}

const TemplateViewDialog: React.FC<Props> = ({ htmlBody, isOpen, setIsOpen }) => {
    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={800} height={'80vh'}>
            <div className="flex flex-col mt-10 h-[70vh]">
                <div className="border rounded-lg p-4 min-h-[300px] bg-gray-50 overflow-scroll ">
                    {htmlBody ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: htmlBody,
                            }}
                        />
                    ) : (
                        <p className="text-gray-400 text-sm">No Html Found</p>
                    )}
                </div>
            </div>
        </Dialog>
    )
}

export default TemplateViewDialog
