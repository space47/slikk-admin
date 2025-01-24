import EasyTable from '@/common/EasyTable'
import PageCommon from '@/common/PageCommon'
import { Button } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OfferTypes } from '../offerEngineCommon'
import AccessDenied from '@/views/pages/AccessDenied'
import moment from 'moment'
import { FaEdit } from 'react-icons/fa'

const OfferEngineTable = () => {
    const [offerEngineData, setOfferEngineData] = useState<OfferTypes[]>([])
    const [accessDenied, setAccessDenied] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [totalPages, setTotalPages] = useState<number>(0)
    const [globalFilter, setGlobalFilter] = useState<string>('')
    const navigate = useNavigate()

    const fetchOfferEngineData = async () => {
        try {
            let searchFilter = ''
            if (globalFilter) {
                searchFilter = `?code=${globalFilter}`
            }

            const response = await axioisInstance.get(`/offers${searchFilter}`)
            const data = response?.data?.data
            if (globalFilter) {
                setOfferEngineData([data])
            } else {
                setOfferEngineData(data?.results)
                setTotalPages(data?.count)
            }
        } catch (error: any) {
            if (error?.response && error?.response?.status === 403) {
                setAccessDenied(true)
            }
            console.error(error)
        }
    }

    useEffect(() => {
        fetchOfferEngineData()
    }, [])

    const columns = useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: 'code',
                cell: ({ row }: any) => {
                    return (
                        <div onClick={() => handleEditOffers(row.original.code)}>
                            <FaEdit className="text-2xl cursor-pointer text-blue-500" />
                        </div>
                    )
                },
            },
            { header: 'Code', accessorKey: 'code' },
            { header: 'Name', accessorKey: 'name' },
            {
                header: 'Description',
                accessorKey: 'description',
            },
            {
                header: 'Store',
                accessorKey: 'store',
            },
            {
                header: 'Upto Off (%)',
                accessorKey: 'upto_off',
            },
            {
                header: 'Days',
                accessorKey: 'days',
                cell: ({ row }: any) => {
                    const dayMapping = {
                        1: 'Monday',
                        2: 'Tuesday',
                        3: 'Wednesday',
                        4: 'Thursday',
                        5: 'Friday',
                        6: 'Saturday',
                        7: 'Sunday',
                    }
                    return row.original.days
                        .split(',')
                        .map((day: string) => dayMapping[day])
                        .join(', ')
                },
            },
            {
                header: 'Slab',
                accessorKey: 'slab',
            },
            {
                header: 'Apply Offer Type',
                accessorKey: 'apply_offer_type',
            },
            {
                header: 'Apply Price Type',
                accessorKey: 'apply_price_type',
            },
            {
                header: 'Offer Type',
                accessorKey: 'offer_type',
            },
            {
                header: 'Offer Value',
                accessorKey: 'offer_value',
            },
            // {
            //     header: 'Quantity X',
            //     accessorKey: 'quantity_x',
            // },
            // {
            //     header: 'Offer Item Type X',
            //     accessorKey: 'offer_item_type_x',
            // },
            // {
            //     header: 'Offer Type Y',
            //     accessorKey: 'offer_type_y',
            // },
            // {
            //     header: 'Offer Value Y',
            //     accessorKey: 'offer_value_y',
            // },
            // {
            //     header: 'Quantity Y',
            //     accessorKey: 'quantity_y',
            // },
            {
                header: 'Min Quantity',
                accessorKey: 'min_quantity',
            },
            {
                header: 'Min Amount',
                accessorKey: 'min_amount',
            },
            // {
            //     header: 'Start Date',
            //     accessorKey: 'start_date',
            //     cell: ({ row }: any) => moment(row.original.start_date).format('YYYY-MM-DD HH:mm:ss'),
            // },
            // {
            //     header: 'End Date',
            //     accessorKey: 'end_date',
            //     cell: ({ row }: any) => moment(row.original.end_date).format('YYYY-MM-DD HH:mm:ss'),
            // },
            // {
            //     header: 'Created Date',
            //     accessorKey: 'create_date',
            //     cell: ({ row }: any) => moment(row.original.create_date).format('YYYY-MM-DD HH:mm:ss'),
            // },
            // {
            //     header: 'Updated Date',
            //     accessorKey: 'update_date',
            //     cell: ({ row }: any) => moment(row.original.update_date).format('YYYY-MM-DD HH:mm:ss'),
            // },
            // {
            //     header: 'Last Updated By',
            //     accessorKey: 'last_updated_by',
            // },
        ],
        [],
    )

    const handleEditOffers = (code: string) => {
        navigate(`/app/offerAndPromotions/edit/${code}`)
    }

    const hanldeAddOffers = () => {
        navigate(`/app/offerAndPromotions/addNew`)
    }
    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between">
                <div>
                    <input
                        type="search"
                        placeholder="Enter offer codes"
                        className="w-full border border-gray-300 rounded p-2"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target?.value)}
                    />
                </div>

                <div>
                    <Button onClick={hanldeAddOffers} variant="new">
                        Add Offers
                    </Button>
                </div>
            </div>
            <EasyTable overflow mainData={offerEngineData} columns={columns} page={page} pageSize={pageSize} />
            {!globalFilter && (
                <PageCommon page={page} setPage={setPage} pageSize={pageSize} totalData={totalPages} setPageSize={setPageSize} />
            )}
        </div>
    )
}

export default OfferEngineTable
