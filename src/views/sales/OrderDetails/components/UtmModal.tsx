import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

import { SalesOrderDetailsResponse } from '../orderList.common'
import { notification } from 'antd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useParams } from 'react-router-dom'

interface UtmModalProps {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
    orderData: SalesOrderDetailsResponse
}

const UtmModal = ({ isOpen, setIsOpen, orderData }: UtmModalProps) => {
    const checkIfTrue = orderData?.utm_params?.ticket === true
    const [check, setCheck] = useState(checkIfTrue)
    const { invoice_id } = useParams()

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const onDialogOk = async () => {
        const body = {
            action: 'UTM_UPDATE',
            data: {
                params: {
                    event_name: 'anuv_jain_concert',
                    ticket: check,
                },
            },
        }
        try {
            const response = await axioisInstance.patch(`/merchant/order/${invoice_id}`, body)
            notification.success({
                message: response?.data?.message || 'Successfully set ticket',
            })
        } catch (error) {
            console.error(error)
            notification.error({
                message: 'Failed to set ticket',
            })
        }

        setIsOpen(false)
    }

    return (
        <Dialog isOpen={isOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
            <h5 className="mb-4 font-bold">TICKET</h5>
            <div className="flex flex-col gap-2">
                <div>
                    <span className="font-bold text-green-600">Event Name </span>: ANUV JAIN CONCERT
                </div>
                <div className="flex gap-2">
                    <span className="font-bold text-green-600">TICKET</span> :
                    <input type="checkbox" checked={check} onChange={(e) => setCheck(e.target.checked)} />
                </div>
            </div>

            <div className="text-right mt-6">
                <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                    Cancel
                </Button>
                <Button variant="solid" onClick={onDialogOk}>
                    Okay
                </Button>
            </div>
        </Dialog>
    )
}

export default UtmModal
