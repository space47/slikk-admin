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
import GdnDeleteModal from './components/GdnDeleteModal'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA, USER_PROFILE_DATA } from '@/store/types/company.types'

const GdnTable = () => {
    const [gdnData, setGdnData] = useState<GDN_TYPES[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalPage, setTotalPages] = useState(0)
    const [accessDenied, setAccessDenied] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [storeGdnId, setStoreGdnId] = useState<number>()
    const navigate = useNavigate()
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const [companyCode, setCompanyCode] = useState<any>()
    const [storeCode, setStoreCode] = useState<any[]>([])

    const fetchGdnData = async () => {
        try {
            let code = ''
            let store = ''
            if (companyCode) code = `&company_code=${encodeURIComponent(companyCode)}`
            if (storeCode && storeCode.length > 0) store = `&store_id=${encodeURIComponent(storeCode?.join(','))}`
            const response = await axioisInstance.get(`/goods/dispatch?p=${page}&page_size=${pageSize}${code}${store}`)
            const data = await response?.data?.data
            setGdnData(data?.results)
            setTotalPages(data?.count)
        } catch (error: any) {
            if (error?.response && error?.response?.status === 403) {
                setAccessDenied(true)
            }
            console.error(error)
        }
    }

    useEffect(() => {
        fetchGdnData()
    }, [page, pageSize, storeCode, companyCode])

    const columns = [
        {
            header: 'Edit',
            accessorKey: '',
            cell: ({ row }: any) => (
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
            cell: ({ row }: any) => (
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
            cell: ({ row }: any) => (
                <button className="border-none bg-none" onClick={() => handleDeleteClick(row.original.id)}>
                    <FaTrash className="text-xl text-red-500" />
                </button>
            ),
        },
    ]
    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const hanldeAddGDN = () => {
        navigate(`/app/goods/gdn/addNew`)
    }

    const handleDeleteClick = (id: number) => {
        setShowDeleteModal(true)
        setStoreGdnId(id)
    }

    if (accessDenied) {
        return <AccessDenied />
    }

    return (
        <div className="p-2 shadow-xl rounded-xl ">
            <div className="flex justify-between items-center mb-5">
                <div className="flex gap-2">
                    <div className="flex flex-col xl:w-[300px] md:w-[200px] w-full">
                        <label className="font-semibold text-gray-700 mb-1">Select Company</label>
                        <Select
                            isClearable
                            className="react-select-container "
                            classNamePrefix="react-select"
                            options={companyList}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id?.toString()}
                            onChange={(newVal) => setCompanyCode(newVal?.code)}
                        />
                    </div>
                    <div className="flex flex-col xl:w-[300px] md:w-[200px] w-full">
                        <label className="font-semibold text-gray-700 mb-1">Select Store</label>
                        <Select
                            isClearable
                            isMulti
                            options={storeList}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id?.toString()}
                            onChange={(selectedOptions) => {
                                setStoreCode(selectedOptions?.map((opt) => opt.id) || [])
                            }}
                        />
                    </div>
                </div>
                <div className="">
                    <Button variant="new" onClick={hanldeAddGDN}>
                        Add GDN
                    </Button>
                </div>
            </div>
            <div>
                <EasyTable overflow mainData={gdnData} columns={columns} page={page} pageSize={pageSize} />
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
                <GdnDeleteModal setShowDeleteModal={setShowDeleteModal} showDeleteModal={showDeleteModal} storeGdnId={storeGdnId} />
            )}
        </div>
    )
}

export default GdnTable
