/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Pagination, Select } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { pageSizeOptions } from './groupComnmon'
import moment from 'moment'
import EasyTable from '@/common/EasyTable'
import { FaEdit } from 'react-icons/fa'

const GetGroupNotification = () => {
    const [groupData, setGroupData] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState<number>(1)
    const [pageSize, setPageSize] = useState<number | undefined>(10)
    const navigate = useNavigate()

    const fetchGroupNotification = async () => {
        try {
            const response = await axioisInstance.get(`/notification/groups?p=${page}&page_size=${pageSize}`)
            const data = response?.data?.data
            setGroupData(data?.results)
            setTotalCount(data?.count)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchGroupNotification()
    }, [page, pageSize])

    const columns = useMemo(
        () => [
            {
                header: 'Group',
                accessorKey: 'group',
                cell: ({ getValue }: any) => {
                    return getValue().map((item: any, key: any) => (
                        <div key={key} className="">
                            {item.name}
                        </div>
                    ))
                },
            },
            {
                header: 'User',
                accessorKey: 'user',
                cell: ({ getValue }: any) => {
                    return (
                        <div className="flex gap-2 max-w-[200px]  overflow-ellipsis">
                            {getValue().map((item: any, key: any) => (
                                <div key={key} className="flex gap-2">
                                    {item.mobile}
                                </div>
                            ))}
                        </div>
                    )
                },
            },
            {
                header: 'Order',
                accessorKey: 'rules.cart',
                cell: ({ getValue }: any) => {
                    const orders = getValue()

                    return (
                        <div className="flex flex-col gap-2">
                            {orders?.map((item: any, key: any) => {
                                return (
                                    <div key={key} className="flex gap-2">
                                        <div>
                                            <strong>{item.type}:</strong>
                                        </div>
                                        <div>{JSON.stringify(item.value)}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                },
            },
            {
                header: 'Order',
                accessorKey: 'rules.order',
                cell: ({ getValue }: any) => {
                    const orders = getValue()

                    return (
                        <div className="flex flex-col gap-2">
                            {orders?.map((item: any, key: any) => {
                                return (
                                    <div key={key} className="flex gap-2">
                                        <div>
                                            <strong>{item.type}:</strong>
                                        </div>
                                        <div>{JSON.stringify(item.value)}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                },
            },

            {
                header: 'Order Items',
                accessorKey: 'rules.order_item',
                cell: ({ getValue }: any) => {
                    const orders = getValue()

                    return (
                        <div className="flex flex-col gap-2">
                            {orders?.map((item: any, key: any) => {
                                return (
                                    <div key={key} className="flex gap-2">
                                        <div>
                                            <strong>{item.type}:</strong>
                                        </div>
                                        <div>{JSON.stringify(item.value)}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                },
            },

            {
                header: 'Loyalty',
                accessorKey: 'rules.loyalty',
                cell: ({ getValue }: any) => {
                    const orders = getValue()

                    return (
                        <div className="flex flex-col gap-2">
                            {orders?.map((item: any, key: any) => {
                                return (
                                    <div key={key} className="flex gap-2">
                                        <div>
                                            <strong>{item.type}:</strong>
                                        </div>
                                        <div>{JSON.stringify(item.value)}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                },
            },

            {
                header: 'Location',
                accessorKey: 'rules.location',
                cell: ({ getValue }: any) => {
                    const orders = getValue()

                    return (
                        <div className="flex flex-col gap-2">
                            {orders?.map((item: any, key: any) => {
                                return (
                                    <div key={key} className="flex gap-2">
                                        <div>
                                            <strong>{item.type}:</strong>
                                        </div>
                                        <div>{item.value}</div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                },
            },

            {
                header: 'Create Date',
                accessorKey: 'create_date',
                cell: ({ getValue }: any) => <span className="">{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ getValue }: any) => (
                    <button onClick={() => handleEditClick(getValue())}>
                        <FaEdit className="text-blue-500 text-xl" />
                    </button>
                ),
            },
        ],
        [],
    )

    const handleEditClick = async (groupId: number) => {
        navigate(`/app/appsCommuncication/editGroups/${groupId}`)
    }

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const handleAddVariant = () => {
        navigate(`/app/appsCommuncication/addGroups`)
    }
    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-end">
                {' '}
                <Button variant="new" onClick={handleAddVariant}>
                    Add Groups
                </Button>
            </div>
            <EasyTable mainData={groupData} columns={columns} />
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalCount} onChange={onPaginationChange} />
                <div className="w-full sm:w-auto min-w-[130px]">
                    <Select
                        size="sm"
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => setPageSize(option?.value)}
                        className="w-full flex justify-end"
                    />
                </div>
            </div>
        </div>
    )
}

export default GetGroupNotification
