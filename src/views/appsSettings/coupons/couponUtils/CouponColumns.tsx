/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui'
import moment from 'moment'
import { useMemo } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface props {
    handleDeleteCoupon: any
}

export const CouponCoulumns = ({ handleDeleteCoupon }: props) => {
    const navigate = useNavigate()
    return useMemo(() => {
        return [
            {
                header: 'Edit',
                accessorKey: 'code',
                cell: ({ getValue }: any) => {
                    return (
                        <Button onClick={() => navigate(`/app/appSettings/coupons/${getValue()}`)} className="bg-none border-none">
                            <FaEdit className="text-xl text-blue-600 items-center flex justify-center" />
                        </Button>
                    )
                },
            },
            {
                header: 'Delete',
                accessorKey: 'code',
                cell: ({ getValue }: any) => {
                    return (
                        <div onClick={() => handleDeleteCoupon(getValue())}>
                            <FaTrash className="text-xl text-red-600 items-center flex justify-center" />
                        </div>
                    )
                },
            },
            { header: 'Code', accessorKey: 'code' },

            {
                header: 'Orders',
                accessorKey: 'orders',
                cell: ({ row }: any) => {
                    const orders = row.original.orders
                    return (
                        <div>
                            {orders?.map((item: any, key: any) => (
                                <div key={key} className="mb-1">
                                    <div className="cursor-pointer hover:text-blue-500" onClick={() => navigate(`/app/orders/${orders}`)}>
                                        {item}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                },
            },
            // Coupon Series fields
            {
                header: 'Min Cart Value',
                accessorKey: 'coupon_series.min_cart_value',
                cell: ({ row }: any) => row.original.coupon_series?.min_cart_value || 'N/A',
            },
            {
                header: 'Max Count Per User',
                accessorKey: 'coupon_series.max_count_per_user',
                cell: ({ row }: any) => row.original.coupon_series?.max_count_per_user || 'N/A',
            },
            {
                header: 'Discount Type',
                accessorKey: 'coupon_series.discount_type',
                cell: ({ row }: any) => row.original.coupon_series?.discount_type || 'N/A',
            },
            {
                header: 'Discount Value',
                accessorKey: 'coupon_series.value',
                cell: ({ row }: any) => row.original.coupon_series?.value || 'N/A',
            },
            {
                header: 'Campaign',
                accessorKey: 'coupon_series.campaign',
                cell: ({ row }: any) => {
                    const campaign = row.original.coupon_series?.id
                    return campaign ? (
                        <div
                            className="cursor-pointer hover:text-blue-500"
                            onClick={() =>
                                navigate(`/app/appSettings/couponsSeries`, {
                                    state: {
                                        campaignId: campaign,
                                    },
                                })
                            }
                        >
                            {row.original.coupon_series?.campaign || campaign}
                        </div>
                    ) : (
                        'N/A'
                    )
                },
            },
            {
                header: 'Max Discount',
                accessorKey: 'coupon_series.maximum_discount',
                cell: ({ row }: any) => row.original.coupon_series?.maximum_discount || 'N/A',
            },
            {
                header: 'Valid From',
                accessorKey: 'coupon_series.valid_from',
                cell: ({ row }: any) => moment(row.original.coupon_series?.valid_from).format('DD-MM-YYYY') || 'N/A',
            },
            {
                header: 'Valid To',
                accessorKey: 'coupon_series.valid_to',
                cell: ({ row }: any) => moment(row.original.coupon_series?.valid_to).format('DD-MM-YYYY') || 'N/A',
            },

            {
                header: 'Coupon Type',
                accessorKey: 'coupon_series.coupon_type',
                cell: ({ row }: any) => row.original.coupon_series?.coupon_type || 'N/A',
            },
            {
                header: 'Applicable Categories',
                accessorKey: 'coupon_series.extra_attributes.applicable_categories',
                cell: ({ row }: any) => row.original.coupon_series?.extra_attributes?.applicable_categories?.join(', ') || 'N/A',
            },
            // Coupon fields
            {
                header: 'Max Count',
                accessorKey: 'max_count',
                cell: ({ row }: any) => row.original?.max_count || 'N/A',
            },
            {
                header: 'Maximum Price',
                accessorKey: 'maximum_price',
                cell: ({ row }: any) => row.original?.maximum_price || 'N/A',
            },
            {
                header: 'Used Count',
                accessorKey: 'coupon_used_count',
                cell: ({ row }: any) => row.original?.coupon_used_count || 'N/A',
            },
            {
                header: 'Created Date',
                accessorKey: 'create_date',
                cell: ({ row }: any) => moment(row.original?.create_date).format('DD-MM-YYYY') || 'N/A',
            },
            // {
            //     header: 'Updated Date',
            //     accessorKey: 'update_date',
            //     cell: ({ row }: any) => moment(row.original?.update_date).format || 'N/A',
            // },
        ]
    }, [])
}
