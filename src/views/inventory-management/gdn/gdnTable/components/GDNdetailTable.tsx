/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import PageCommon from '@/common/PageCommon'
import { Input } from '@/components/ui'
import { gdnService } from '@/store/services/gdnService'
import { GdnProducts } from '@/store/types/gdn.types'
import moment from 'moment'
import debounce from 'lodash/debounce'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import NotFoundData from '@/views/pages/NotFound/Notfound'

const GDNdetailTable = () => {
    const { gdn_number } = useParams()
    const [gdnItemsData, setGdnItemsData] = useState<GdnProducts[]>([])
    const [count, setCount] = useState(0)
    const [globalFilter, setGlobalFilter] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const debouncedResults = useMemo(
        () =>
            debounce((value: string) => {
                setGlobalFilter(value)
            }, 500),
        [],
    )

    useEffect(() => {
        return () => {
            debouncedResults.cancel()
        }
    }, [debouncedResults])

    const gdnItems = gdnService.useGdnItemsDetailsQuery({ page, pageSize, gdn_number, sku: globalFilter ?? '' })

    useEffect(() => {
        if (gdnItems.isSuccess) {
            setGdnItemsData(gdnItems?.data?.data?.results)
            setCount(gdnItems?.data?.data?.count)
        }
    }, [gdnItems.isSuccess, gdnItems?.data?.data])

    const columns = [
        {
            header: 'Updated By',
            accessorKey: 'last_updated_by.mobile',
            cell: ({ getValue }: any) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'SKU',
            accessorKey: 'sku',
            cell: ({ getValue }: any) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'quantity sent',
            accessorKey: 'quantity_sent',
            cell: ({ getValue }: any) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'quantity received',
            accessorKey: 'quantity_received',
        },
        {
            header: 'term completion count',
            accessorKey: 'term_completion_count',
            cell: ({ getValue }: any) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'batch number',
            accessorKey: 'batch_number',
            cell: ({ getValue }: any) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'synced to inventory',
            accessorKey: 'synced_to_inventory',
        },
        {
            header: 'create date',
            accessorKey: 'create_date',
            cell: ({ getValue }: any) => {
                return <div>{moment(getValue()).format('YYYY-MM-DD')}</div>
            },
        },
        {
            header: 'update date',
            accessorKey: 'update_date',
            cell: ({ getValue }: any) => {
                return <div>{moment(getValue()).format('YYYY-MM-DD')}</div>
            },
        },
    ].filter((column) => column.header && column.accessorKey)

    return (
        <div>
            {gdnItems.isError ? (
                <>
                    <NotFoundData />
                </>
            ) : (
                <>
                    <div className="mb-8">
                        <Input
                            type="search"
                            placeholder="Search agency by name..."
                            className="max-w-xs"
                            onChange={(e) => debouncedResults(e.target.value)}
                        />
                    </div>
                    <EasyTable overflow mainData={gdnItemsData} columns={columns} page={page} pageSize={pageSize} />
                    <PageCommon pageSize={pageSize} page={page} totalData={count} setPage={setPage} setPageSize={setPageSize} />
                </>
            )}
        </div>
    )
}

export default GDNdetailTable
