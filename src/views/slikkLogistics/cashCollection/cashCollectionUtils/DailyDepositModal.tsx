/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react'
import { Button, Dialog, Input, Upload } from '@/components/ui'
import { Modal, notification } from 'antd'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { CashCollection } from '@/store/types/cashCollection.types'
import { TaskData } from '@/store/types/tasks.type'
import EasyTable from '@/common/EasyTable'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import { GiFullMotorcycleHelmet } from 'react-icons/gi'
import PageCommon from '@/common/PageCommon'
import { useDepositColumns } from './useDepositColumns'
import { beforeUpload } from '@/common/beforeUpload'
import { handleimage } from '@/common/handleImage'
import { filterEmptyValues } from '@/utils/apiBodyUtility'
import CommonCamera from '@/common/CommonCamera'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { FaCamera, FaCheck, FaCheckCircle, FaMoneyBillWave, FaPhoneAlt, FaRupeeSign, FaTimes } from 'react-icons/fa'

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
    const [uploadFile, setUploadFile] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [taskId, setTaskId] = useState<TaskData | null>()
    const [isCamera, setIsCamera] = useState(false)
    const [file, setFile] = useState<string | null>()

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

        const imageUrl = uploadFile?.length ? await handleimage('product', uploadFile) : file || ''

        const body = { amount: parseInt(amount, 10), force: isForce, deposit_image: imageUrl || '' }
        const filteredBody = filterEmptyValues(body)

        try {
            const res = await axioisInstance.patch(`/logistic/order/cash/deposit/${taskId?.task_id}`, filteredBody)
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

    const handleUpload = async (fileType: string, files: File) => {
        const formData = new FormData()
        if (files) {
            formData.append('file', files)
        }

        formData.append('file_type', fileType)
        formData.append('compression_service', 'slikk')

        try {
            const response = await axioisInstance.post('fileupload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            console.log(response)
            const newData = response.data.url
            successMessage(response)
            console.log('file returned is', newData)
            setFile(newData)
            return newData
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    const cashCollectionTable = useMemo(() => {
        return taskData?.filter((item) => item?.status === 'COMPLETED')
    }, [taskData])

    const columns = useDepositColumns({ handleDepositClick })

    return (
        <Dialog
            isOpen={isOpen}
            className="overflow-scroll"
            width={1200}
            onClose={() => {
                setIsOpen(false)
                setPage(1)
            }}
        >
            <div className="flex flex-col h-full">
                <div className="px-4 pt-6 pb-4 md:px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <div className="flex items-start gap-4">
                        <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-900/30">
                            <span className="text-4xl text-blue-500">
                                <GiFullMotorcycleHelmet />
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 truncate">
                                        {row?.rider?.user?.name}
                                    </h2>
                                    <div className="mt-1">
                                        <a
                                            href={`tel:${row?.rider?.user?.mobile}`}
                                            className="inline-flex items-center gap-2 text-sm sm:text-base text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                        >
                                            <FaPhoneAlt className="w-3.5 h-3.5" />
                                            {row?.rider?.user?.mobile}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex flex-col p-4 md:p-6">
                    <div className="grid grid-cols-3 shadow-lg sm:grid-cols-3 gap-4  dark:bg-gray-800 p-4 rounded-lg ">
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

                    <EasyTable noPage overflow mainData={cashCollectionTable} columns={columns} />

                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={totalData} />
                </div>
            </div>

            <Modal
                title={null}
                open={amountModalVisible}
                width={700}
                className="custom-modal"
                footer={null}
                onCancel={() => setAmountModalVisible(false)}
            >
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                            <FaMoneyBillWave className="text-2xl text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Enter Deposit Amount</h2>
                    </div>
                    {taskId?.client_order_details?.payment_mode?.toLowerCase() === 'qr' && (
                        <div className="rounded-xl border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 p-4 flex items-start gap-3">
                            <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl mt-0.5" />
                            <div>
                                <p className="font-semibold text-green-700 dark:text-green-300">Payment Mode is QR</p>
                                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                    Ensure proper documentation for QR payments
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 rounded-xl">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-full text-center">
                                <FaCamera className="text-3xl text-gray-400 dark:text-gray-500 mb-2 mx-auto" />
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Upload Supporting Image or File</p>
                            </div>
                            {isCamera && (
                                <div className="w-full">
                                    <CommonCamera
                                        onCapture={(file) => {
                                            setIsCamera(false)
                                            handleUpload('product', file)
                                        }}
                                        onClose={() => setIsCamera(false)}
                                    />
                                </div>
                            )}
                            <div className="w-full max-w-md flex justify-center items-center">
                                <Upload
                                    uploadLimit={1}
                                    beforeUpload={beforeUpload}
                                    fileList={uploadFile}
                                    onChange={(file) => setUploadFile(file)}
                                    onFileRemove={() => setUploadFile([])}
                                />
                            </div>
                            <Button
                                size="sm"
                                variant={isCamera ? 'reject' : 'blue'}
                                className="rounded-lg w-full sm:w-auto"
                                onClick={() => setIsCamera((prev) => !prev)}
                                icon={isCamera ? <FaTimes /> : <FaCamera />}
                            >
                                {isCamera ? 'Close Camera' : 'Open Camera'}
                            </Button>
                            {file && (
                                <div className="mt-4 flex flex-col items-center gap-3 w-full">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Captured Image Preview:</p>
                                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                                        <img src={file} alt="Captured" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => setFile(null)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <FaTimes className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
                            <span>Deposit Amount</span>
                            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                Expected: ₹{taskId?.client_order_details?.cash_to_be_collected ?? 0}
                            </span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaRupeeSign className="text-gray-400" />
                            </div>
                            <Input
                                type="number"
                                value={amount}
                                placeholder="Enter deposit amount"
                                className="pl-10 h-12 rounded-xl border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50"
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button variant="reject" className="flex-1" onClick={() => setAmountModalVisible(false)}>
                            Cancel
                        </Button>
                        <Button variant="blue" className="flex-1" onClick={() => handleDailyDeposit(false)} icon={<FaCheck />}>
                            Confirm Deposit
                        </Button>
                    </div>
                </div>
            </Modal>
        </Dialog>
    )
}

export default DailyDepositModal
