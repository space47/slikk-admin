import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Modal, notification } from 'antd'
import React from 'react'
import { IoWarningOutline } from 'react-icons/io5'

interface props {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
    bannerId: number
}

const DeleteBannerModal = ({ isOpen, setIsOpen, bannerId }: props) => {
    const deleteBanner = async () => {
        const body = {
            banner_id: bannerId,
        }
        try {
            const response = await axioisInstance.delete(`/banners`, {
                data: body,
            })
            notification.success({
                message: response?.data?.message || 'User has been Successfully deleted',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to delete banner',
            })
        } finally {
            setIsOpen(false)
        }
    }

    return (
        <div>
            <Modal
                title=""
                open={isOpen}
                onOk={deleteBanner}
                onCancel={() => setIsOpen(false)}
                okText="DELETE"
                okButtonProps={{
                    style: { backgroundColor: 'red', borderColor: 'red' },
                }}
            >
                <div className="italic text-lg flex flex-row items-center justify-start gap-5">
                    <IoWarningOutline className="text-red-600 text-4xl" /> ARE YOU SURE YOU WANT TO DELETE THE BANNER Id: {bannerId} !!
                </div>
            </Modal>
        </div>
    )
}

export default DeleteBannerModal
