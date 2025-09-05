import { Button, Dialog, Spinner } from '@/components/ui'
import store from '@/store'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import React, { useState } from 'react'

interface props {
    isReAssign: boolean
    setIsReAssign: (x: boolean) => void
}

const OrderReAssignModal = ({ isReAssign, setIsReAssign }: props) => {
    const [loadingAction, setLoadingAction] = useState<'picker' | 'partner' | null>(null)
    const storeCodes = store.getState().storeSelect.store_ids

    const handleReassignPickerOrder = async (text: 'picker' | 'partner') => {
        const body: { action?: string; store_id?: string } = {}

        if (text === 'picker') {
            body.action = 'reassign_picker_orders'
        }
        if (text === 'partner') {
            body.action = 'reassign_delivery_partner'
        }
        if (storeCodes && storeCodes.length > 0) {
            body.store_id = storeCodes.join(',')
        }

        try {
            setLoadingAction(text)
            const res = await axioisInstance.post(`/merchant/orders`, body)
            notification.success({ message: res?.data?.message || 'Reassigned Successfully' })
        } catch (error) {
            console.error(error)
            if (error instanceof AxiosError) {
                notification.error({ message: error?.message || 'Failed to Reassign' })
            }
        } finally {
            setLoadingAction(null)
            setIsReAssign(false)
        }
    }

    return (
        <Dialog isOpen={isReAssign} onClose={() => setIsReAssign(false)}>
            <div className="flex flex-col justify-center mt-10 gap-3">
                <Button variant="new" size="sm" disabled={loadingAction === 'picker'} onClick={() => handleRePassignPickerOrder('picker')}>
                    <span className="flex justify-center items-center gap-2">
                        {loadingAction === 'picker' && <Spinner size={20} />}
                        Reassign Picker Orders
                    </span>
                </Button>
                <Button variant="new" size="sm" disabled={loadingAction === 'partner'} onClick={() => handleReassignPickerOrder('partner')}>
                    <span className="flex justify-center items-center gap-2">
                        {loadingAction === 'partner' && <Spinner size={20} />}
                        Reassign Delivery Partner
                    </span>
                </Button>
            </div>
        </Dialog>
    )
}

export default OrderReAssignModal
