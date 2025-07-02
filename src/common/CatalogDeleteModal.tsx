import { Modal } from 'antd'
import React from 'react'
import { IoWarningOutline } from 'react-icons/io5'

interface props {
    deleteModal: boolean
    setDeleteModal: (value: boolean) => void
    deleteFromCatalog: () => Promise<void>
}

const CatalogDeleteModal = ({ deleteModal, setDeleteModal, deleteFromCatalog }: props) => {
    return (
        <div>
            <Modal
                title=""
                open={deleteModal}
                okText="DELETE"
                okButtonProps={{
                    style: { backgroundColor: 'red', borderColor: 'red' },
                }}
                onOk={deleteFromCatalog}
                onCancel={() => setDeleteModal(false)}
            >
                <div className="italic text-lg flex flex-row items-center justify-start gap-5">
                    <IoWarningOutline className="text-red-600 text-4xl" /> ARE YOU SURE YOU WANT TO DELETE !!
                </div>
            </Modal>
        </div>
    )
}

export default CatalogDeleteModal
