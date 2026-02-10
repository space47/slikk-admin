/* eslint-disable @typescript-eslint/no-explicit-any */
import { commonDownload } from '@/common/commonDownload'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BsBoxArrowInUpRight } from 'react-icons/bs'
import { Order } from '@/store/types/newOrderTypes'
import { errorMessage, successMessage } from '@/utils/responseMessages'

interface Props {
    data?: Order
    setShowCancelExchangeModal: React.Dispatch<React.SetStateAction<boolean>>
    setIsMarketing: React.Dispatch<React.SetStateAction<boolean>>
    refetch: any
}

export const useOrderDetailFunctions = ({ data, setShowCancelExchangeModal, setIsMarketing, refetch }: Props) => {
    const navigate = useNavigate()
    const { invoice_id } = useParams()

    const handlemarkAsPaid = async () => {
        try {
            const response = await axioisInstance.post(`/user/order/${invoice_id}/payment/status`)
            notification.success({ message: response.data.message || 'Successfully markded as Paid' })
            navigate(0)
        } catch (error) {
            console.log(error)
        }
    }

    const handlePODAction = async () => {
        try {
            const body = { action: 'MARK_POD_COMPLETE' }
            const response = await axioisInstance.patch(`/merchant/order/${invoice_id}`, body)
            notification.success({ message: response.data.message || 'POD COMPLETED SUCCESSFULLY' })
            navigate(0)
        } catch (error) {
            console.log(error)
        }
    }

    const handleReverseTNB = async () => {
        try {
            const body = { order_id: invoice_id, reason: 'Product not as expected' }
            const response = await axioisInstance.post(`/merchant/tnb/reverse`, body)
            successMessage(response)
            refetch()
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }

    const handleDownload = async () => {
        try {
            const response = await axioisInstance.get(`/user/order/invoice/${invoice_id}`)
            commonDownload(response, `invoice-${invoice_id}.pdf`)
        } catch (error) {
            console.log(error)
        }
    }

    const handleConvert = async () => {
        const body = { action: 'EXCHANGE_TO_RETURN' }
        try {
            const response = await axioisInstance.patch(`/merchant/order/${invoice_id}`, body)
            notification.success({ message: response?.data?.message || 'Successfully converted' })
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || error?.message || 'Failed to convert' })
            }
        } finally {
            setShowCancelExchangeModal(false)
        }
    }
    const handleMarketingOrder = async () => {
        const body = { action: 'MARK_INTERNAL_ORDER', is_internal_order: !data?.is_internal_order }
        try {
            const response = await axioisInstance.patch(`/merchant/order/${invoice_id}`, body)
            notification.success({ message: response?.data?.message || 'Marketing order status updated' })
            navigate(0)
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({
                    message: error?.response?.data?.message || error?.message || 'Failed to update marketing order status',
                })
            }
        } finally {
            setIsMarketing(false)
        }
    }

    const OrderList = ({
        title,
        items,
        itemKey = 'id',
        itemDisplayKey = 'id',
        baseUrl = '/app',
        className = '',
        badgeVariant = 'gray',
        hrefBuilder,
    }: {
        title: string
        items: any[]
        itemKey?: string
        itemDisplayKey?: string
        baseUrl?: string
        className?: string
        badgeVariant?: 'gray' | 'blue' | 'red' | 'green'
        hrefBuilder?: (item: any) => string
    }) => {
        if (!items || items.length === 0) return null

        const badgeVariants = {
            gray: 'bg-gray-100 text-gray-600',
            blue: 'bg-blue-100 text-blue-600',
            red: 'bg-red-100 text-red-600',
            green: 'bg-green-100 text-green-600',
        }

        const getHref = (item: any) => {
            if (hrefBuilder) return hrefBuilder(item)
            return `${baseUrl}/${item[itemKey]}`
        }

        const getDisplayText = (item: any) => {
            return `#${item[itemDisplayKey]}`
        }

        return (
            <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
                <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                    <span className={`${badgeVariants[badgeVariant]} text-sm px-2 py-1 rounded-full`}>{items.length}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {items.map((item, index) => (
                        <a
                            key={item[itemKey] || index}
                            href={getHref(item)}
                            className="inline-flex gap-2 items-center px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors duration-200"
                        >
                            {getDisplayText(item)} <BsBoxArrowInUpRight className="text-xl" />
                        </a>
                    ))}
                </div>
            </div>
        )
    }

    const OrderLink = ({
        label,
        value,
        href,
        className = '',
        variant = 'default',
    }: {
        label: string
        value: string | number
        href: string
        className?: string
        variant?: 'default' | 'minimal' | 'card'
    }) => {
        if (!value) return null

        const baseClasses = {
            default: 'bg-gray-50 rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors duration-200 border border-gray-200',
            minimal: 'bg-transparent px-3 py-2 hover:bg-gray-50 transition-colors duration-200',
            card: 'bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200',
        }

        return (
            <div className={`${baseClasses[variant]} ${className}`}>
                <a href={href} className={`flex items-center justify-between group ${variant === 'card' ? '' : 'gap-3'}`}>
                    <div className="flex items-center gap-3">
                        <span className={`font-medium ${variant === 'card' ? 'text-gray-700' : 'text-gray-600'}`}>{label}:</span>
                        <span
                            className={`font-semibold ${
                                variant === 'card' ? 'text-blue-700 text-lg' : 'text-blue-600'
                            } group-hover:text-blue-800 transition-colors duration-200`}
                        >
                            #{value}
                        </span>
                    </div>
                    <svg
                        className={`text-blue-400 group-hover:text-blue-600 transition-colors duration-200 ${
                            variant === 'card' ? 'w-5 h-5' : 'w-4 h-4'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                    </svg>
                </a>
            </div>
        )
    }

    return {
        handlemarkAsPaid,
        handlePODAction,
        handleDownload,
        handleConvert,
        handleMarketingOrder,
        OrderList,
        OrderLink,
        handleReverseTNB,
    }
}
