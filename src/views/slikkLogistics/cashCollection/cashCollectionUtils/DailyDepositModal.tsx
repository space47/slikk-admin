/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react'
import { Dialog, Input } from '@/components/ui'
import { Modal, notification } from 'antd'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { CashCollection } from '@/store/types/cashCollection.types'
import { TaskData } from '@/store/types/tasks.type'
import EasyTable from '@/common/EasyTable'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import { GiFullMotorcycleHelmet } from 'react-icons/gi'
import PageCommon from '@/common/PageCommon'
import { useDepositColumns } from './useDepositColumns'

interface DailyDepositModalProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    row?: CashCollection
    from: string
    to: string
    refetch: any
}

const DailyDepositModal: React.FC<DailyDepositModalProps> = ({ row, isOpen, setIsOpen, from, to, refetch }) => {
    const [amount, setAmount] = useState('')
    const [amountModalVisible, setAmountModalVisible] = useState(false)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [taskId, setTaskId] = useState<TaskData | null>()

    const queryParams = useMemo(
        () =>
            `/logistic/slikk/task?p=${page}&page_size=${pageSize}&cash_only=true&runner_mobile=${row?.rider?.user?.mobile}&from=${from}&to=${to}`,
        [row?.rider?.user?.mobile, from, to, page, pageSize],
    )

    const { data: taskData, totalData, refetch: taskRefetch } = useFetchApi<TaskData>({ url: queryParams })

    const handleDepositClick = (row: TaskData) => {
        setTaskId(row)
        setAmountModalVisible(true)
    }

    const handleDailyDeposit = async (isForce = false) => {
        if (!taskId || !amount) return

        const cashAmount =
            taskId?.client_order_details?.cash_to_be_collected && Math.round(taskId?.client_order_details?.cash_to_be_collected)

        if (cashAmount && (parseInt(amount) < cashAmount - 5 || parseInt(amount) > cashAmount + 5)) {
            notification.error({ message: 'Amount is not same as to be collected' })
            return
        }

        const body = { amount: parseInt(amount, 10), force: isForce }
        try {
            const res = await axiosInstance.patch(`/logistic/order/cash/deposit/${taskId?.task_id}`, body)
            successMessage(res)
            refetch()
            taskRefetch()
        } catch (error) {
            if (error instanceof AxiosError) {
                const msg = error.response?.data?.message
                if (msg === 'Cash has already been collected for this order') {
                    Modal.confirm({
                        title: 'Confirm Force Update',
                        content: 'Are you sure you want to force update this record?',
                        okText: 'Yes',
                        cancelText: 'No',
                        onOk: () => {
                            handleDailyDeposit(true)
                        },
                        onCancel: () => setAmountModalVisible(false),
                    })
                } else {
                    errorMessage(error)
                }
            } else {
                console.error(error)
            }
        } finally {
            setAmount('')
            setTaskId(null)
            setAmountModalVisible(false)
        }
    }

    const cashCollectionTable = useMemo(() => {
        return taskData?.filter(
            (item) => Math.round(item.client_order_details?.cash_to_be_collected as number) > 0 && item?.status === 'COMPLETED',
        )
    }, [taskData])

    const columns = useDepositColumns({ handleDepositClick })

    return (
        <Dialog
            isOpen={isOpen}
            width={1200}
            height={'85vh'}
            onClose={() => {
                setIsOpen(false)
                setPage(1)
            }}
        >
            <div>
                <div className="flex gap-4 mb-6">
                    <span className="text-6xl text-blue-500">
                        <GiFullMotorcycleHelmet />
                    </span>
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-2">
                            <span className="text-xl font-semibold text-gray-800">{row?.rider?.user?.name}</span>
                        </div>
                        <div>
                            <a href={`tel:${row?.rider?.user?.mobile}`} className="text-sm text-blue-500 hover:text-blue-700">
                                {row?.rider?.user?.mobile}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[70vh] overflow-y-auto space-y-4 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                        <span className="font-semibold">Expected Cash:</span> ₹{row?.expected_cash_collected ?? 0}
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                        <span className="font-semibold">Collected Cash:</span> ₹{row?.cash_collected ?? 0}
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                        <span className="font-semibold">Deposited Cash:</span> ₹{row?.cash_deposited ?? 0}
                    </p>
                </div>
                <div className="rounded-xl h-[50vh] overflow-scroll border border-gray-200 dark:border-gray-700 shadow-sm">
                    <EasyTable noPage overflow mainData={cashCollectionTable} columns={columns} />
                </div>
                <div className="mb-2">
                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalData} />
                </div>
            </div>

            <Modal
                title="Enter Deposit Amount"
                open={amountModalVisible}
                width={500}
                className="custom-modal"
                okText="Confirm"
                cancelText="Cancel"
                footer={
                    taskId?.client_order_details?.payment_mode?.toLowerCase() === 'qr'
                        ? [
                              <button
                                  key="cancel"
                                  className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold"
                                  onClick={() => setAmountModalVisible(false)}
                              >
                                  Close
                              </button>,
                          ]
                        : undefined
                }
                onOk={() => handleDailyDeposit(false)}
                onCancel={() => setAmountModalVisible(false)}
            >
                <div className="flex flex-col gap-4">
                    {taskId?.client_order_details?.payment_mode?.toLowerCase() === 'qr' ? (
                        <div className="rounded-2xl border border-green-300 bg-green-50 p-4 shadow-sm">
                            <p className="text-lg font-semibold text-green-800 flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                Payment Collected via QR
                            </p>
                            <p className="text-sm text-green-700 mt-1">
                                The cash has already been collected through QR. No manual deposit is required.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <p className="text-base font-medium text-gray-700">Please enter the deposit amount:</p>
                            <Input
                                type="number"
                                value={amount}
                                placeholder="Enter amount"
                                className="h-11 rounded-xl"
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </Modal>
        </Dialog>
    )
}

export default DailyDepositModal
