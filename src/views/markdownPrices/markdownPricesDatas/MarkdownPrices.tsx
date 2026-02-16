/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import { markdownPriceTypes } from '../markdownCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { FaEdit } from 'react-icons/fa'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import PageCommon from '@/common/PageCommon'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import DialogConfirm from '@/common/DialogConfirm'
import { notification } from 'antd'
import { RxUpdate } from 'react-icons/rx'

const MarkdownPrices = () => {
    const [markdownPricesData, setMarkdownPricesData] = useState<markdownPriceTypes>([])
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number>(10)
    const [globalFilter, setGlobalFilter] = useState<string | null>('')
    const [totalPages, setTotalPages] = useState<number>(0)
    const [showSync, setShowSync] = useState(false)
    const navigate = useNavigate()

    const fetchMarkdownPrices = async () => {
        try {
            let searchFilter = ''
            if (globalFilter) {
                searchFilter = `&name=${globalFilter}`
            }

            const response = await axioisInstance.get(`/product/offer/pricing?p=${page}&ps=${pageSize}${searchFilter}`)
            const data = response?.data?.data
            setMarkdownPricesData(data?.results)
            setTotalPages(data?.count)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchMarkdownPrices()
    }, [page, pageSize, globalFilter])

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
        notification.info({
            message: 'SYNC IN PROCESS',
        })
        const body = {
            task_name: 'update_product_pricing_data',
        }
        setShowSync(false)
        try {
            const response = await axioisInstance.post(`/backend/task/process`, body)
            notification.success({
                message: response?.data?.message || 'SYNCED',
            })
        } catch (error: any) {
            console.error(error)
            notification.error({
                message: error.response?.data?.message || 'FAILED TO SYNC',
            })
        }
    }

    return (
        <div>
            <div className="flex flex-col gap-4">
                <div className="flex xl:justify-between xl:flex-row md:flex-row md:justify-between flex-col gap-2">
                    <div className="xl:order-none order-2 ">
                        <input
                            type="search"
                            placeholder="Enter offer codes"
                            className="w-full border border-gray-300 rounded p-2"
                            value={globalFilter as string}
                            onChange={(e) => setGlobalFilter(e.target?.value)}
                        />
                    </div>
                    <div>
                        <div className="flex gap-2 ">
                            <button
                                className=" px-4 py-2  xl:flex-row flex flex-row items-center gap-2  hover:bg-green-600 rounded-lg text-white bg-green-500"
                                onClick={() => setShowSync(true)}
                            >
                                <span className="font-bold">Sync</span> <RxUpdate className="text-xl" />
                            </button>
                            <div>
                                <Button onClick={hanldeAddMarkdownPrices} variant="new">
                                    Add New
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <EasyTable overflow mainData={markdownPricesData} columns={columns} page={page} pageSize={pageSize} />
                {!globalFilter && (
                    <PageCommon page={page} setPage={setPage} pageSize={pageSize} totalData={totalPages} setPageSize={setPageSize} />
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
        </div>
    )
}

export default MarkdownPrices
