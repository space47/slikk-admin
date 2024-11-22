/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import LoadingSpinner from '@/common/LoadingSpinner'
import { Button, Pagination, Select } from '@/components/ui'
import { Option, pageSizeOptions } from '@/views/org-management/sellers/sellerCommon'
import React, { useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface USERGROUPTABLEPROPS {
    data: any[]
    page: number
    setPage: any
    pageSize: number
    setPageSize: any
    totalData: number
    showTableSpinner: any
}

const UserGroupTable = ({ data, page, setPage, pageSize, setPageSize, totalData, showTableSpinner }: USERGROUPTABLEPROPS) => {
    const navigate = useNavigate()
    const columms = [
        { header: 'Name', accessorKey: 'name' },
        { header: 'Mobile', accessorKey: 'mobile' },
        { header: 'Email', accessorKey: 'email' },
        {
            header: 'Edit',
            accessorKey: '',
            cell: ({ row }: any) => (
                <Button onClick={() => handleActionClick(row.original.mobile)} className="bg-none border-none">
                    <FaEdit className="text-xl text-blue-600" />
                </Button>
            ),
        },
    ]

    const onPaginationChange = (page: number) => {
        setPage(page)
    }

    const onSelectChange = (value = 0) => {
        setPageSize(Number(value))
    }

    const handleActionClick = (mobile: string) => {
        navigate(`/app/users/edit/${mobile}`)
    }

    if (showTableSpinner) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <EasyTable mainData={data} columns={columms} />
            <div className="flex items-center justify-between mt-4">
                <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={onPaginationChange} />
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
        </div>
    )
}

export default UserGroupTable
