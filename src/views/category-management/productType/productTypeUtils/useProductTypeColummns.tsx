/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import React, { useMemo } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'

interface props {
    handleDeleteClick: (id: any) => void
}

export const useProductTypeColummns = ({ handleDeleteClick }: props) => {
    return useMemo(
        () => [
            {
                header: 'Edit',
                accessor: 'id',
                format: (value: any) => (
                    <button className="border-none bg-none">
                        <a href={`/app/category/productType/${value}`}>
                            {' '}
                            <FaEdit className="text-xl text-blue-600" />
                        </a>
                    </button>
                ),
            },
            { header: 'Name', accessor: 'name' },
            {
                header: 'Create Date',
                accessor: 'create_date',
                format: (value: moment.MomentInput) => moment(value).format('YYYY-MM-DD'),
            },
            {
                header: 'Image',
                accessor: 'image',
                format: (value: string | undefined) => <img src={value} alt="product" width="50" />,
            },

            { header: 'Quick Filter Tags', accessor: 'quick_filter_tags' },
            { header: 'Position', accessor: 'position' },
            { header: 'Gender', accessor: 'gender' },
            {
                header: 'Active',
                accessor: 'is_active',
                format: (value: any) => (value ? 'Yes' : 'No'),
            },
            {
                header: 'Update Date',
                accessor: 'update_date',
                format: (value: moment.MomentInput) => moment(value).format('YYYY-MM-DD'),
            },
            {
                header: 'Try and Buy',
                accessor: 'is_try_and_buy',
                format: (value: any) => (value ? 'Yes' : 'No'),
            },
            { header: 'Last Updated By', accessor: 'last_updated_by' },

            {
                header: 'Delete',
                accessor: 'id',
                format: (value: any) => (
                    <button onClick={() => handleDeleteClick(value)} className="border-none bg-none">
                        <FaTrash className="text-xl text-red-600" />
                    </button>
                ),
            },
        ],
        [],
    )
}
