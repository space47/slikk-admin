/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from 'react'
import { markdownPriceTypes } from '../markdownCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { FaEdit, FaPlus } from 'react-icons/fa'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import PageCommon from '@/common/PageCommon'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import DialogConfirm from '@/common/DialogConfirm'
import { notification, Spin } from 'antd'
import { RxUpdate } from 'react-icons/rx'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { AxiosError } from 'axios'
import { errorMessage } from '@/utils/responseMessages'

const MarkdownPrices = () => {
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [globalFilter, setGlobalFilter] = useState<string | null>('')
    const [showSync, setShowSync] = useState(false)
    const navigate = useNavigate()

    const query = useMemo(() => {
        const searchFilter = globalFilter ? `&name=${globalFilter}` : ''
        return `/product/offer/pricing?p=${page}&ps=${pageSize}${searchFilter}`
    }, [page, pageSize, globalFilter])

    const { data: markdownPricesData, totalData, loading } = useFetchApi<markdownPriceTypes>({ url: query, initialData: [] })

    const columns = useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: 'name',
                cell: ({ row }: any) => {
                    return (
                        <div onClick={() => handleEditMarkdownPrice(row.original.id)}>
                            <FaEdit className="text-2xl cursor-pointer text-blue-500" />
                        </div>
                    )
                },
            },
            { header: 'Name', accessorKey: 'name' },
            { header: 'product filter', accessorKey: 'product_filter' },
            {
                header: 'Start Date',
                accessorKey: 'start_date',
                cell: ({ row }) => {
                    return <div>{moment(row.original.start_date).format('YYYY-MM-DD HH:mm:ss')}</div>
                },
            },
            {
                header: 'End Date',
                accessorKey: 'end_date',
                cell: ({ row }) => {
                    return <div>{moment(row.original.end_date).format('YYYY-MM-DD HH:mm:ss')}</div>
                },
            },
            {
                header: 'Discount Type',
                accessorKey: 'discount_type',
            },
            {
                header: 'Offer Value',
                accessorKey: 'offer_value',
            },
            {
                header: 'price type',
                accessorKey: 'apply_on',
            },
            {
                header: 'status',
                accessorKey: 'status',
            },
            {
                header: 'products count',
                accessorKey: 'products_count',
                cell: ({ row }: any) => {
                    const specificPrice = row?.original?.product_specific_price
                    const count = Number(row.original.products_count) + specificPrice?.length || 0

                    return <div>{count}</div>
                },
            },

            {
                header: 'Created Date',
                accessorKey: 'create_date',
                cell: ({ row }: any) => moment(row.original.create_date).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
                header: 'Updated Date',
                accessorKey: 'update_date',
                cell: ({ row }: any) => moment(row.original.update_date).format('YYYY-MM-DD HH:mm:ss'),
            },
        ],
        [],
    )

    const handleEditMarkdownPrice = (name: string) => {
        navigate(`/app/markdownPrices/edit/${name}`)
    }

    const hanldeAddMarkdownPrices = () => {
        navigate(`/app/markdownPrices/addNew`)
    }

    const handleFacebookSync = async () => {
        notification.info({ message: 'SYNC IN PROCESS' })
        const body = { task_name: 'update_product_pricing_data' }
        setShowSync(false)
        try {
            const response = await axioisInstance.post(`/backend/task/process`, body)
            notification.success({ message: response?.data?.message || 'SYNCED' })
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        }
    }

    return (
        <Spin spinning={loading}>
            <div className="flex flex-col gap-4">
                <div className="flex xl:justify-between xl:flex-row md:flex-row md:justify-between flex-col gap-2">
                    <div className="xl:order-none order-2 ">
                        <input
                            type="search"
                            placeholder="Search by Name"
                            className="w-full border border-gray-300 rounded p-2"
                            value={globalFilter as string}
                            onChange={(e) => setGlobalFilter(e.target?.value)}
                        />
                    </div>
                    <div>
                        <div className="flex gap-2 ">
                            <Button variant="accept" size="sm" icon={<RxUpdate />} onClick={() => setShowSync(true)}>
                                <span className="font-bold">Sync</span>
                            </Button>

                            <Button variant="new" size="sm" icon={<FaPlus />} onClick={hanldeAddMarkdownPrices}>
                                Add New
                            </Button>
                        </div>
                    </div>
                </div>
                <EasyTable overflow mainData={markdownPricesData} columns={columns} page={page} pageSize={pageSize} />
                {!globalFilter && (
                    <PageCommon page={page} setPage={setPage} pageSize={pageSize} totalData={totalData} setPageSize={setPageSize} />
                )}
            </div>
            {showSync && (
                <DialogConfirm
                    IsOpen={showSync}
                    setIsOpen={setShowSync}
                    onDialogOk={handleFacebookSync}
                    IsConfirm
                    headingName="Update Pricing"
                />
            )}
        </Spin>
    )
}

export default MarkdownPrices
