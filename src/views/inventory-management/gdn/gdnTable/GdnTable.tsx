/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { GDN_TYPES } from '../commonGdn'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { FaEdit, FaTrash } from 'react-icons/fa'
import moment from 'moment'
import { Button, Pagination, Select } from '@/components/ui'
import EasyTable from '@/common/EasyTable'
import { Option } from '../../quality-check/qcCommon'
import { pageSizeOptions } from '../../inward/inwardCommon'
import { useNavigate } from 'react-router-dom'
import AccessDenied from '@/views/pages/AccessDenied'
import { IoWarningOutline } from 'react-icons/io5'
import { Modal, notification } from 'antd'

const GdnTable = () => {
    const [gdnData, setGdnData] = useState<GDN_TYPES[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalPage, setTotalPages] = useState(0)
    const [accessDenied, setAccessDenied] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [storeGdnId, setStoreGdnId] = useState<number>()
    const navigate = useNavigate()
    const fetchGdnData = async () => {
        try {
            const response = await axioisInstance.get(`/goods/dispatch?p=${page}&page_size=${pageSize}`)
            const data = await response?.data?.data
            setGdnData(data?.results)
            setTotalPages(data?.count)
        } catch (error: any) {
            if (error?.response || error?.response?.status === 403) {
                setAccessDenied(true)
            }
            console.error(error)
        }
    }

    useEffect(() => {
        fetchGdnData()
    }, [page, pageSize])

    const columns = [
        {
            header: 'Edit',
            accessorKey: '',
            cell: ({ row }) => (
                <button className="border-none bg-none">
                    <a href={`/app/goods/gdn/${encodeURIComponent(row.original.document_number)}`} target="_blank" rel="noreferrer">
                        {' '}
                        <FaEdit className="text-xl text-blue-500" />
                    </a>
                </button>
            ),
        },
        {
            header: 'Document Number',
            accessorKey: 'document_number',
            cell: ({ row }) => (
                <div className="cursor-pointer bg-gray-200 px-2 py-2 items-center flex justify-center rounded-md text-black font-semibold">
                    <a
                        href={`/app/goods/gdnDetails/${encodeURIComponent(row.original.document_number)}/${row?.original?.company}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {row.original.document_number}
                    </a>
                </div>
            ),
        },
        {
            header: 'GDN Number',
            accessorKey: 'gdn_number',
            cell: (info: any) => info.getValue(),
        },
        {
            header: 'Create Date',
            accessorKey: 'create_date',
            cell: ({ getValue }: any) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
        },
        {
            header: 'Document Date',
            accessorKey: 'document_date',
            cell: ({ getValue }: any) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
        },
        {
            header: 'Updated By',
            accessorKey: 'last_updated_by.name',
            cell: (info: any) => info.getValue(),
        },
        {
            header: 'Received At',
            accessorKey: 'received_address',
            cell: (info: any) => info.getValue(),
        },
        {
            header: 'dispatched_by',
            accessorKey: 'dispatched_by.name',
            cell: (info: any) => info.getValue(),
        },
        {
            header: 'Total QTY',
            accessorKey: 'total_quantity',
            cell: (info: any) => info.getValue(),
        },
        {
            header: 'Total SKU',
            accessorKey: 'total_sku',
            cell: (info: any) => info.getValue(),
        },
        {
            header: 'Updated On',
            accessorKey: 'update_date',
            cell: ({ getValue }: any) => <span>{moment(getValue() as string).format('YYYY-MM-DD')}</span>,
        },
        {
            header: 'Delete',
            accessorKey: 'id',
            cell: ({ row }) => (
                <button onClick={() => handleDeleteClick(row.original.id)} className="border-none bg-none">
                    <FaTrash className="text-xl text-red-500" />
                </button>
            ),
        },
    ]
    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    console.log('Data of gdn', gdnData)
    const hanldeAddGDN = () => {
        navigate(`/app/goods/gdn/addNew`)
    }

    const handleDeleteClick = (id: number) => {
        setShowDeleteModal(true)
        setStoreGdnId(id)
    }

    const deleteGDN = async () => {
        try {
            const response = await axioisInstance.delete(`/goods/dispatch/${storeGdnId}`)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'GDN Successfully deleted',
            })
            navigate(0)
        } catch (error: any) {
            console.log(error)
            notification.error({
                message: error?.response?.data?.message,
                description: 'Unable to delete GDN',
            })
        } finally {
            setShowDeleteModal(false)
        }
    }

    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div>
            <div className="flex justify-end mb-10">
                <Button variant="new" onClick={hanldeAddGDN}>
                    Add GDN
                </Button>
            </div>
            <div>
                <EasyTable mainData={gdnData} columns={columns} page={page} pageSize={pageSize} overflow />
            </div>
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalPage} onChange={() => setPage(page)} />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>
            {showDeleteModal && (
                <Modal
                    title=""
                    open={showDeleteModal}
                    onOk={deleteGDN}
                    onCancel={() => setShowDeleteModal(false)}
                    okText="DELETE"
                    okButtonProps={{
                        style: { backgroundColor: 'red', borderColor: 'red' },
                    }}
                >
                    <div className="italic text-lg flex flex-row items-center justify-start gap-2 mt-7">
                        <IoWarningOutline className="text-red-600 text-4xl" /> ARE YOU WANT TO DELETE THE GDN:{' '}
                        <span className="text-red-500 font-bold">{storeGdnId}</span> !!
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default GdnTable
