/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import type { MouseEvent } from 'react'

interface props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    mobile: string
    name: string
    checkOutRider?: boolean
    refetch: any
}

const RiderCheckinModal = ({ dialogIsOpen, setIsOpen, mobile, name, checkOutRider, refetch }: props) => {
    const onDialogClose = (e: MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const onDialogOk = async () => {
        let body
        checkOutRider
            ? (body = {
                  check_in_status: false,
                  force_checkout: true,
                  mobile: mobile,
              })
            : (body = {
                  check_in_status: true,
                  check_proximity: false,
                  mobile: mobile,
              })
        try {
            const response = await axioisInstance.post(`/user/checkin`, body)
            notification.success({
                message: response?.data?.message || checkOutRider ? 'Rider Checked out' : 'Successfully Checked in rider',
            })
            refetch()
        } catch (error) {
            console.error(error)
            notification.error({
                message: 'Failed to update rider status',
            })
        } finally {
            setIsOpen(false)
        }
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <h5 className="mb-4">
                    {checkOutRider ? 'check-out Rider' : 'Checkin Rider '}: <span className="text-blue-600">{name}</span>
                </h5>
                <p className={checkOutRider ? 'text-red-700' : 'text-green-700'}>
                    Are you sure you want to {checkOutRider ? 'check-out Rider' : 'Checkin Rider '}
                </p>
                <div className="text-right mt-6">
                    <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onDialogClose}>
                        Cancel
                    </Button>
                    <Button variant={checkOutRider ? 'reject' : 'accept'} onClick={onDialogOk}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default RiderCheckinModal
