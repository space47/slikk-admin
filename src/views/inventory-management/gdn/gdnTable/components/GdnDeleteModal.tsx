/* eslint-disable @typescript-eslint/no-explicit-any */
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Modal, notification } from 'antd'
import React from 'react'
import { IoWarningOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

interface props {
    showDeleteModal: boolean
    setShowDeleteModal: (x: boolean) => void
    storeGdnId: number | undefined
}

const GdnDeleteModal = ({ setShowDeleteModal, showDeleteModal, storeGdnId }: props) => {
    const navigate = useNavigate()

    const deleteGDN = async () => {
        try {
            const response = await axioisInstance.delete(`/goods/dispatch/${storeGdnId}`)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'GDN Successfully deleted',
            })
            navigate(0)
        } catch (error: any) {
            console.log(error)
            notification.error({
                message: error?.response?.data?.message,
                description: 'Unable to delete GDN',
            })
        } finally {
            setShowDeleteModal(false)
        }
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
