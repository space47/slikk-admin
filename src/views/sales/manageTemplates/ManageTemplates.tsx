/* eslint-disable @typescript-eslint/no-explicit-any */
import EasyTable from '@/common/EasyTable'
import { Button } from '@/components/ui'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import FilterDrawer from './FilterDrawer'
import DeleteTemplateModal from './DeleteTemplateFilter'
import { notification } from 'antd'
import { FaEdit } from 'react-icons/fa'

const ManageTemplates = () => {
    const navigate = useNavigate()

    const [messageTemplateData, setMessageTemplateData] = useState<any>([])
    const [globalFilter, setGlobalFilter] = useState<any>('')
    const [showFilterDrawer, setShowFilterDrawer] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [nameForDelete, setNameForDelete] = useState('')
    const [dropdownStatus, setDropdownStatus] = useState<any>({
        value: [],
        name: [],
    })

    const [deliveryTypes, setDeliveryTypes] = useState<any>({
        value: [],
        label: [],
    })

    const fetchMessageTemplate = async () => {
        const params: Record<string, any> = {}

        if (globalFilter) {
            params.name = globalFilter
        }

        if (deliveryTypes?.value?.length > 0) {
            params.category = deliveryTypes.value.join(',')
        }

        if (dropdownStatus?.value?.length > 0) {
            params.status = dropdownStatus.value.join(',')
        }

        const body = { params }

        try {
            const response = await axios.post(`https://sw507e3znc.execute-api.ap-south-1.amazonaws.com/api/get_message_templates`, body)
            const data = response?.data?.data?.data
            setMessageTemplateData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchMessageTemplate()
    }, [globalFilter, dropdownStatus, deliveryTypes])

    const columns = [
        {
            header: 'Edit',
            accessorKey: 'name',
            cell: ({ getValue }) => {
                return (
                    <div className="flex justify-center items-center" onClick={() => handleEditTemplate(getValue())}>
                        <FaEdit className="text-xl text-blue-600 cursor-pointer" />
                    </div>
                )
            },
        },
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
            header: 'Parameter Format',
            accessorKey: 'parameter_format',
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
            accessorKey: 'name',
            cell: ({ getValue }) => {
                return (
                    <div className={` items-center flex justify-center rounded-2xl `} onClick={() => handleDeleteTemplate(getValue())}>
                        <MdDelete className="text-xl text-red-600 cursor-pointer" />
                    </div>
                )
            },
        },
    ]

    const handleEditTemplate = (name: string) => {
        navigate(`/app/appsCommuncication/templates/${name}`)
    }

    const handleDeleteTemplate = (name: string) => {
        setNameForDelete(name)
        setShowDeleteModal(true)
    }

    const hanldeNewTemplates = () => {
        navigate(`/app/appsCommuncication/templates/addNew`)
    }
    const hanldeTemplateFilter = () => {
        setShowFilterDrawer(true)
    }

    const handleDeliverySelect = (selectedValue: string) => {
        if (deliveryTypes.value.includes(selectedValue)) {
            setDeliveryTypes((prevState: any) => ({
                ...prevState,
                value: prevState.value.filter((item: any) => item !== selectedValue),
            }))
        } else {
            setDeliveryTypes((prevState: any) => ({
                ...prevState,
                value: [...prevState.value, selectedValue],
            }))
        }
    }

    console.log('Message Template', messageTemplateData)

    const handleDropdownSelect = (selectedValue: string) => {
        if (dropdownStatus.value.includes(selectedValue)) {
            setDropdownStatus((prevState: any) => ({
                ...prevState,
                value: prevState.value.filter((item: any) => item !== selectedValue),
            }))
        } else {
            setDropdownStatus((prevState: any) => ({
                ...prevState,
                value: [...prevState.value, selectedValue],
            }))
        }
    }

    const hanldeDelete = async () => {
        const body = {
            params: {
                name: nameForDelete,
            },
        }
        try {
            const response = await axios.post(`https://sw507e3znc.execute-api.ap-south-1.amazonaws.com/api/delete_message_templates`, body)
            notification.success({
                message: 'Successfully Deleted the Template',
            })
            navigate(0)
        } catch (error: any) {
            notification.error({
                message: error?.response?.data?.message || error?.response?.data?.data?.message || 'Failed to Delete Template',
            })
            console.error(error)
        } finally {
            setShowDeleteModal(false)
        }
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
                <div className="flex gap-6 justify-end mb-4">
                    <Button variant="new" onClick={hanldeTemplateFilter}>
                        Filter
                    </Button>
                    <Button variant="new" onClick={hanldeNewTemplates}>
                        Add Templates
                    </Button>
                </div>
            </div>

            <div>
                <EasyTable mainData={messageTemplateData} columns={columns} noPage />
            </div>
            {showFilterDrawer && (
                <FilterDrawer
                    setShowFilter={setShowFilterDrawer}
                    showFilter={showFilterDrawer}
                    deliveryType={deliveryTypes}
                    handleDeliverySelect={handleDeliverySelect}
                    handleDropdownSelect={handleDropdownSelect}
                    dropdownStatus={dropdownStatus}
                />
            )}
            {showDeleteModal && (
                <DeleteTemplateModal dialogIsOpen={showDeleteModal} setIsOpen={setShowDeleteModal} handleDelete={hanldeDelete} />
            )}
        </div>
    )
}

export default ManageTemplates
