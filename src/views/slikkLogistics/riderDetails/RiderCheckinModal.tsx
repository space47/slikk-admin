import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    mobile: string
    name: string
}

const RiderCheckinModal = ({ dialogIsOpen, setIsOpen, mobile, name }: props) => {
    const navigate = useNavigate()
    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = async () => {
        const body = {
            check_in_status: true,
            check_proximity: false,
            mobile: mobile,
        }
        try {
            const response = await axioisInstance.post(`/user/checkin`, body)
            notification.success({
                message: response?.data?.message || 'Successfully Checked in rider',
            })
        } catch (error) {
            console.error(error)
            notification.error({
                message: 'Failed to checkin rider',
            })
        } finally {
            setIsOpen(false)
            navigate(0)
        }
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <h5 className="mb-4">
                    Checkin Rider : <span className="text-blue-600">{name}</span>
                </h5>
                <p className="text-green-700">Are you sure you want to check in this rider</p>
                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={onDialogOk}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default RiderCheckinModal
