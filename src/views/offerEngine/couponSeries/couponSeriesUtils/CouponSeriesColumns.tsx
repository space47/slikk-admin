/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import { useMemo } from 'react'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export const CouponSeriesCoulumns = () => {
    const navigate = useNavigate()
    return useMemo(() => {
        return [
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }: any) => {
                    return (
                        <div className="flex items-center justify-center">
                            <button
                                className="bg-none border-none "
                                onClick={() => navigate(`/app/appSettings/couponsSeries/${row?.original?.id}`)}
                            >
                                <FaEdit className="text-xl text-blue-600 cursor-pointer" />
                            </button>
                        </div>
                    )
                },
            },
            {
                header: 'Campaign',
                accessorKey: 'campaign',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.campaign}</div>
                },
            },
            {
                header: 'Coupon Type',
                accessorKey: 'coupon_type',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.coupon_type}</div>
                },
            },
            {
                header: 'description',
                accessorKey: 'description',
                cell: ({ row }: any) => {
                    return <div className="flex-wrap w-[100px] ">{row?.original?.description}</div>
                },
            },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.image ? <img src={row?.original?.image} alt="image" width="50" /> : ''}</div>
                },
            },
            {
                header: 'Categories',
                accessorKey: 'extra_attributes.applicable_categories',
                cell: ({ row }: any) => {
                    const categories: string[] = row?.original?.extra_attributes?.applicable_categories
                    return (
                        <div className="flex gap-2 w-[50px] flex-wrap">
                            {categories?.map((item, key) => {
                                return (
                                    <div key={key} className="flex gap-2">
                                        {item}
                                    </div>
                                )
                            })}
                        </div>
                    )
                },
            },
            {
                header: 'maximum_discount',
                accessorKey: 'maximum_discount',
                cell: ({ row }: any) => {
                    return <div>{row?.original?.maximum_discount}</div>
                },
            },
            {
                header: 'valid From',
                accessorKey: 'valid_from',
                cell: ({ row }: any) => {
                    return <div>{moment(row?.original?.valid_from).format('DD-MM-YYYY HH:mm:ss')}</div>
                },
            },
            {
                header: 'valid To',
                accessorKey: 'valid_to',
                cell: ({ row }: any) => {
                    return <div>{moment(row?.original?.valid_to).format('DD-MM-YYYY HH:mm:ss')}</div>
                },
            },
        ]
    }, [])
}
