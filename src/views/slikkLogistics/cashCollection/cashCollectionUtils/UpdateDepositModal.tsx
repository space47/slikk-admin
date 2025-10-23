/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Button, Dialog, Input } from '@/components/ui'
import { notification } from 'antd'
import { cashCollectionService } from '@/store/services/cashCollectionService'
import { CashCollection } from '@/store/types/cashCollection.types'

interface Props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    row?: CashCollection
    from: string
    refetch: any
}

const UpdateDepositModal = ({ row, isOpen, setIsOpen, from, refetch }: Props) => {
    const [amount, setAmount] = useState('')
    const [updateDeposit, updateResponse] = cashCollectionService.useUpdateCashCollectionMutation()

    useEffect(() => {
        if (updateResponse?.isSuccess) {
            notification.success({
                message: updateResponse?.data?.message || 'Successfully updated deposit record',
            })
            setIsOpen(false)
            refetch()
        } else if (updateResponse?.isError) {
            notification.error({
                message: (updateResponse?.error as any)?.data?.message || 'Failed to update deposit record',
            })
        }
    }, [updateResponse?.isSuccess, updateResponse?.isError])

    const handleSubmit = async () => {
        if (!amount) {
            notification.warning({ message: 'Please enter an amount before confirming' })
            return
        }

        await updateDeposit({
            amount: parseInt(amount),
            collection_date: from,
            mobile: row?.rider?.user?.mobile as string,
        })
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className="p-6 flex flex-col gap-5 w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Confirm Deposit Completion</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Are you sure you want to complete the deposit for{' '}
                    <span className="font-medium text-gray-900 dark:text-gray-200">{row?.rider?.user?.name}</span> (
                    <span className="text-blue-600 dark:text-blue-400">{row?.rider?.user?.mobile}</span>) on{' '}
                    <span className="font-medium text-gray-900 dark:text-gray-200">{from}</span>?
                </p>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Deposit Amount
                    </label>
                    <Input
                        id="amount"
                        value={amount}
                        type="number"
                        placeholder="Enter amount"
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="reject" onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-600 dark:text-gray-300">
                        Cancel
                    </Button>
                    <Button variant="blue" onClick={handleSubmit} loading={updateResponse?.isLoading} className="px-4 py-2">
                        Confirm
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default UpdateDepositModal
