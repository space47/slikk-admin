/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import Modal from 'antd/es/modal/Modal'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import Card from '@/components/ui/Card'
import { Radio } from 'antd'
import { RiderDetailType, setRiderDetails } from '@/store/slices/riderDetails/riderDetails.slice'
import store, { useAppDispatch, useAppSelector } from '@/store'
import { ridersService } from '@/store/services/riderServices'
import { RiMotorbikeFill } from 'react-icons/ri'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { AxiosError } from 'axios'
import { errorMessage, successMessage } from '@/utils/responseMessages'

type ModalProps = {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    selectedInvoices: number[] | string[]
}

const AssignRiderHomeModal = ({ isOpen, selectedInvoices, setIsOpen }: ModalProps) => {
    const dispatch = useAppDispatch()

    const [selectedRiderMobile, setSelectedRiderMobile] = useState<string>('')

    const [globalFilter, setGlobalFilter] = useState<string | undefined>('')
    const [mobileFilter, setMobileFilter] = useState<string | undefined>('')

    // ✅ Track invoice status
    const [invoiceStatus, setInvoiceStatus] = useState<Record<string, 'pending' | 'success' | 'failed'>>({})

    const { riderDetails } = useAppSelector<RiderDetailType>((state) => state.riderDetails)

    const storeCodes = store.getState().storeSelect.store_ids

    const { data: riders, isSuccess } = ridersService.useRiderDetailsQuery(
        {
            page: 1,
            pageSize: 100,
            name: globalFilter,
            mobile: mobileFilter,
            isActive: 'true',
            store_id: storeCodes?.join(','),
        },
        { refetchOnMountOrArgChange: true },
    )

    // ✅ Set rider data
    useEffect(() => {
        if (isSuccess) {
            dispatch(setRiderDetails(riders.data?.results || []))
        }
    }, [riders, isSuccess, dispatch])

    // ✅ Initialize invoice state when modal opens
    useEffect(() => {
        if (isOpen && selectedInvoices?.length) {
            const initialState: Record<string, 'pending'> = {}
            selectedInvoices.forEach((inv) => {
                initialState[String(inv)] = 'pending'
            })
            setInvoiceStatus(initialState)
        }
    }, [isOpen, selectedInvoices])

    const assignTask = async () => {
        const promises = selectedInvoices.map((invoice) => {
            const body = {
                action: 'CREATE_DELIVERY',
                delivery_partner: 'slikk',
                rider_mobile: selectedRiderMobile,
            }

            return axioisInstance
                .patch(`/merchant/order/${invoice}`, body)
                .then((res) => ({
                    status: 'fulfilled',
                    invoice,
                    res,
                }))
                .catch((error: AxiosError) => ({
                    status: 'rejected',
                    invoice,
                    error,
                }))
        })

        const results = await Promise.allSettled(promises)

        const updatedStatus: Record<string, 'success' | 'failed'> = {}

        results.forEach((result) => {
            if (result.status === 'fulfilled') {
                const value = result.value as any

                if (value.status === 'fulfilled') {
                    updatedStatus[String(value.invoice)] = 'success'
                    successMessage(value.res)
                } else {
                    updatedStatus[String(value.invoice)] = 'failed'
                    errorMessage(value.error)
                }
            }
        })

        setInvoiceStatus((prev) => ({ ...prev, ...updatedStatus }))
    }

    const handleRiderSelection = (e: any) => {
        setSelectedRiderMobile(e.target.value)
    }

    const riderDataArray = riderDetails && riderDetails?.filter((item) => item?.profile?.checked_in_status === true)

    return (
        <div>
            <Modal
                title=""
                open={isOpen}
                okText={!selectedRiderMobile ? 'AUTO ASSIGN' : 'ASSIGN RIDER'}
                okButtonProps={{
                    style: {
                        backgroundColor: 'green',
                        borderColor: 'darkgreen',
                    },
                }}
                width={650}
                onOk={assignTask}
                onCancel={() => setIsOpen(false)}
            >
                {storeCodes && storeCodes?.length > 1 ? (
                    <>
                        <div className="flex mt-9 items-center gap-3 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl shadow-sm">
                            <span className="text-xl">⚠️</span>
                            <div className="flex flex-col">
                                <span className="font-semibold">Multiple Stores Selected</span>
                                <span className="text-sm">Please select only one store to assign a rider.</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col h-[60vh]">
                        <div className="text-xl font-bold text-red-700 mb-6 text-center">ASSIGN RIDER</div>

                        {/* ✅ Invoice List */}
                        <div className="mb-4">
                            <div className="font-semibold mb-2">Selected Invoices</div>
                            <div className="flex flex-wrap gap-2">
                                {selectedInvoices.map((inv) => {
                                    const status = invoiceStatus[String(inv)]

                                    return (
                                        <div
                                            key={inv}
                                            className={`px-3 py-1 rounded-lg flex items-center gap-2 text-sm
                                        ${
                                            status === 'success'
                                                ? 'bg-green-200 text-green-800'
                                                : status === 'failed'
                                                  ? 'bg-red-200 text-red-800'
                                                  : 'bg-gray-200'
                                        }
                                    `}
                                        >
                                            <span>{inv}</span>

                                            {status === 'success' && <FaCheckCircle className="text-green-700" />}
                                            {status === 'failed' && <FaTimesCircle className="text-red-700" />}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col gap-1 mb-4">
                            <input
                                type="search"
                                placeholder="Enter Rider name"
                                value={globalFilter}
                                className="rounded-xl p-2 border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                onChange={(e) => setGlobalFilter(e.target.value)}
                            />

                            <input
                                type="search"
                                placeholder="Enter Rider Mobile"
                                value={mobileFilter}
                                className="rounded-xl p-2 border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                onChange={(e) => setMobileFilter(e.target.value)}
                            />
                        </div>

                        {riderDetails && (
                            <div className="flex-1 overflow-scroll">
                                <div className="overflow-y-auto h-[300px] pr-2">
                                    <Radio.Group value={selectedRiderMobile} className="w-full" onChange={handleRiderSelection}>
                                        <div className="space-y-3">
                                            {riderDataArray?.map((item, key) => {
                                                const isFree = item?.rider_status == false

                                                return (
                                                    <Card
                                                        key={key}
                                                        className={`${
                                                            isFree ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'
                                                        } w-full transition cursor-pointer`}
                                                    >
                                                        <div className="flex items-center gap-3 p-3">
                                                            <Radio value={item?.profile?.mobile} />

                                                            <div className="flex items-center gap-3 flex-1">
                                                                <RiMotorbikeFill className="text-2xl text-gray-700" />

                                                                <div className="flex flex-col flex-1">
                                                                    <span className="text-lg font-semibold">
                                                                        {item?.profile?.first_name} {item?.profile?.last_name}
                                                                    </span>

                                                                    <span className="text-sm text-gray-600">{item?.profile?.mobile}</span>

                                                                    <span className="text-sm text-gray-600">
                                                                        {item?.profile?.rider_type}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                )
                                            })}
                                        </div>
                                    </Radio.Group>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default AssignRiderHomeModal
