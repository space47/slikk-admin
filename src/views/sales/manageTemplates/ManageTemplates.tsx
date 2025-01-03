import EasyTable from '@/common/EasyTable'
import { Button } from '@/components/ui'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const ManageTemplates = () => {
    const navigate = useNavigate()

    const [messageTemplateData, setMessageTemplateData] = useState<any>([])
    const [globalFilter, setGlobalFilter] = useState<any>('')

    const fetchMessageTemplate = async () => {
        try {
            const response = await axios.post(`https://sw507e3znc.execute-api.ap-south-1.amazonaws.com/api/get_message_templates`)
            const data = response?.data?.data?.data
            setMessageTemplateData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchMessageTemplate()
    }, [])

    const columns = [
        {
            header: 'Template Name',
            accessorKey: 'name',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'Language',
            accessorKey: 'language',
            cell: ({ getValue, row }) => {
                const bodyText = row?.original?.components?.find((component) => component.type === 'BODY')?.text

                let textShow

                if (getValue() === 'en') {
                    textShow = 'English'
                }
                if (getValue() === 'en_US') {
                    textShow = 'English(US)'
                }

                return (
                    <div className="flex flex-col items-start">
                        <div className="font-bold text-md">{textShow}</div>
                        {bodyText && (
                            <div
                                className="mt-1 p-2  rounded  text-sm line-clamp-3"
                                style={{
                                    maxWidth: '200px',
                                    maxHeight: '100px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'pre-wrap',
                                }}
                                title={bodyText}
                            >
                                {bodyText}
                            </div>
                        )}
                    </div>
                )
            },
        },
        {
            header: 'Category',
            accessorKey: 'category',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'Library Template Name',
            accessorKey: 'library_template_name',
            cell: ({ getValue }) => {
                return <div>{getValue()}</div>
            },
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ getValue }) => {
                const status = getValue()
                const className =
                    status === 'REJECTED' ? 'text-red-700 bg-red-100' : status === 'APPROVED' ? 'text-green-700 bg-green-100' : ''

                return <div className={`p-2  items-center flex justify-center rounded-2xl ${className}`}>{status}</div>
            },
        },
        {
            header: 'Delete',
            accessorKey: '',
            cell: ({ getValue }) => {
                return (
                    <div className={` items-center flex justify-center rounded-2xl `}>
                        <MdDelete className="text-xl text-red-600 cursor-pointer" />
                    </div>
                )
            },
        },
    ]

    const hanldeNewTemplates = () => {
        navigate(`/app/appsCommuncication/templates/addNew`)
    }

    return (
        <div>
            <div className="flex justify-between mt-4">
                <div>
                    <input
                        type="search"
                        placeholder="Search"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="rounded-xl"
                    />
                </div>
                <div className="flex justify-end mb-4">
                    <Button variant="new" onClick={hanldeNewTemplates}>
                        Add Templates
                    </Button>
                </div>
            </div>

            <div>
                <EasyTable mainData={messageTemplateData} columns={columns} noPage />
            </div>
        </div>
    )
}

export default ManageTemplates
