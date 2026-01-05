/* eslint-disable @typescript-eslint/no-explicit-any */
import { gdnService } from '@/store/services/gdnService'
import { Modal, notification } from 'antd'
import React, { useEffect } from 'react'
import { IoWarningOutline } from 'react-icons/io5'

interface props {
    showDeleteModal: boolean
    setShowDeleteModal: (x: boolean) => void
    storeGdnId: number | undefined
    refetch: any
}

const GdnDeleteModal = ({ setShowDeleteModal, showDeleteModal, storeGdnId, refetch }: props) => {
    const [deleteGdn, deleteResponse] = gdnService.useDeleteGdnMutation()

    useEffect(() => {
        if (deleteResponse.isSuccess) {
            notification.success({
                message: 'Success',
                description: deleteResponse?.data?.message || 'GDN Successfully deleted',
            })
            setShowDeleteModal(false)
            refetch()
        }
        if (deleteResponse.isError) {
            notification.error({
                message: (deleteResponse.error as any).data?.message,
                description: 'Unable to delete GDN',
            })
        }
    }, [deleteResponse.isSuccess, deleteResponse.isError])

    const deleteGDN = async () => {
        deleteGdn({ id: storeGdnId as number })
    }
    return (
        <div>
            <Modal
                title=""
                open={showDeleteModal}
                okText="DELETE"
                okButtonProps={{
                    style: { backgroundColor: 'red', borderColor: 'red' },
                }}
                onCancel={() => setShowDeleteModal(false)}
                onOk={deleteGDN}
            >
                <div className="italic text-lg flex flex-row items-center justify-start gap-2 mt-7">
                    <IoWarningOutline className="text-red-600 text-4xl" /> ARE YOU WANT TO DELETE THE GDN:{' '}
                    <span className="text-red-500 font-bold">{storeGdnId}</span> !!
                </div>
            </Modal>
        </div>
    )
}

export default GdnDeleteModal
