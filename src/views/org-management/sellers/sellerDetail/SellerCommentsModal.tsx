import { textParser } from '@/common/textParser'
import SimpleTextEditor from '@/components/shared/SimpleTextEditor'
import { Button, Dialog } from '@/components/ui'
import { notification } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'

interface props {
    isOpen: boolean
    setIsOPen: (x: boolean) => void
    dataForComment: { name: string; label: string }
    setCommentsStructure: React.Dispatch<React.SetStateAction<Record<string, string>>>
    commentsStructure: Record<string, string>
}

const SellerCommentsModal = ({ isOpen, setIsOPen, dataForComment, setCommentsStructure, commentsStructure }: props) => {
    const [commentValue, setCommentValue] = useState('')

    const handleSaveComment = useCallback(() => {
        const message = textParser(commentValue)
        setCommentsStructure((prev) => ({ ...prev, [dataForComment?.name]: message }))
        setIsOPen(false)
        notification.info({ message: 'Comment Set' })
    }, [commentValue, dataForComment, setCommentsStructure, setIsOPen])

    useEffect(() => {
        if (isOpen) {
            setCommentValue(commentsStructure[dataForComment?.name] || '')
        }
    }, [isOpen, dataForComment, commentsStructure])

    return (
        <div>
            <Dialog isOpen={isOpen} width={800} onClose={() => setIsOPen(false)}>
                <div className="p-6 space-y-5">
                    <h5 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Add Comment for <span className="text-blue-600">{dataForComment?.label}</span>
                    </h5>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                        <SimpleTextEditor value={commentValue} onChange={(val) => setCommentValue(val)} />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <Button
                            variant="default"
                            size="sm"
                            className="px-4 py-1.5 text-gray-700 border-gray-300 hover:bg-gray-100"
                            onClick={() => setIsOPen(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="blue" size="sm" className="px-4 py-1.5" onClick={handleSaveComment}>
                            Save Comment
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default SellerCommentsModal
