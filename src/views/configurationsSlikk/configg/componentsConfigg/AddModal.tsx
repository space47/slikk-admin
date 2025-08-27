import React from 'react'
import { FieldType } from './commonConfigTypes'
import { Modal } from 'antd'

const AddFieldModal = ({
    isOpen,
    onClose,
    onSelectType,
    isObjectType = false,
}: {
    isOpen: boolean
    onClose: () => void
    onSelectType: (type: FieldType) => void
    isObjectType?: boolean
}) => (
    <Modal title="Select Field Type" open={isOpen} footer={null} onCancel={onClose}>
        <div className="flex flex-col gap-2">
            {(['string', 'array', 'object'] as FieldType[]).map((type) => (
                <button
                    key={type}
                    className="p-2 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg"
                    onClick={() => onSelectType(type)}
                >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
            ))}
        </div>
    </Modal>
)

export default AddFieldModal
