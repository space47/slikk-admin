/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import LoadingSpinner from '@/common/LoadingSpinner'
import { Button } from '@/components/ui'
import React, { useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

interface USERGROUPTABLEPROPS {
    data: any[]
    showTableSpinner: any
}

const UserGroupTable = ({ data, showTableSpinner }: USERGROUPTABLEPROPS) => {
    const [localFilter, setLocalFilter] = useState('')

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

    const handleActionClick = (mobile: string) => {
        navigate(`/app/users/edit/${mobile}`)
    }

    if (showTableSpinner) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <div className="relative mb-3">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <div className="xl:w-1/2">
                    <input
                        type="search"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Search Users Here....."
                        value={localFilter}
                        onChange={(e) => setLocalFilter(e.target.value)}
                    />
                </div>
            </div>
            <EasyTable filterValue={localFilter} mainData={data} columns={columms} />
            {/* <div className="flex items-center justify-between mt-4">
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
            </div> */}
        </div>
    )
}

export default UserGroupTable
