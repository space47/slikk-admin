/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Card, Input, Tooltip } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { FaCheck, FaEdit } from 'react-icons/fa'
import { MdCancel } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

type CustomerInfoFieldProps = {
    title?: string
    value?: string
}

const CustomerInfoField = ({ title, value }: CustomerInfoFieldProps) => {
    return (
        <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
            <p className="text-gray-800 dark:text-gray-200 font-semibold break-words">{value}</p>
        </div>
    )
}

interface CustomerProps {
    data: any
}

const CustomerData = ({ data }: CustomerProps) => {
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [inputValues, setInputValues] = useState({ first_name: '', last_name: '', email: '' })

    useEffect(() => {
        setInputValues({
            first_name: data?.profile?.first_name,
            last_name: data?.profile?.last_name,
            email: data?.profile?.email,
        })
    }, [data])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setInputValues((prev) => ({ ...prev, [name]: value }))
    }

    const handleSaveUserProfile = async () => {
        const fields = {
            first_name: inputValues.first_name || '',
            last_name: inputValues.last_name || '',
            email: inputValues.email || '',
        }
        const body = Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== ''))
        try {
            const response = await axioisInstance.patch(`/dashboard/user/profile/${data?.profile?.mobile}`, body)
            notification.success({ message: response?.data?.message || 'Successfully Updated' })
            navigate(0)
        } catch (error) {
            console.error(error)
            if (error instanceof AxiosError) {
                notification.error({ message: error?.message || 'Failed to Update' })
            }
        } finally {
            setIsEditing(false)
        }
    }

    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto">
            <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-end">
                    {!isEditing && <FaEdit className="cursor-pointer text-xl text-blue-600" onClick={() => setIsEditing(true)} />}
                    {isEditing && (
                        <div className="flex gap-3">
                            <span>
                                <Tooltip title="Cancel Editing">
                                    <MdCancel className="cursor-pointer text-2xl text-red-500" onClick={() => setIsEditing(false)} />
                                </Tooltip>
                            </span>
                            <span>
                                <Tooltip title="Save Changes">
                                    <FaCheck className="cursor-pointer text-2xl text-green-500" onClick={handleSaveUserProfile} />
                                </Tooltip>
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-8">
                    {/* Profile Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4">
                        <Avatar size={90} shape="circle" src={data?.profile?.image} />
                        {isEditing ? (
                            <div className="flex flex-col gap-2 mt-5">
                                <Input
                                    name="first_name"
                                    type="text"
                                    className="rounded-xl"
                                    placeholder="Enter First Name"
                                    value={inputValues.first_name}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    name="last_name"
                                    type="text"
                                    className="rounded-xl"
                                    placeholder="Enter Last Name"
                                    value={inputValues.last_name}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    name="email"
                                    type="text"
                                    className="rounded-xl"
                                    placeholder="Enter Email"
                                    value={inputValues.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        ) : (
                            <>
                                <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    {data?.profile?.first_name} {data?.profile?.last_name}
                                </h4>
                            </>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
                        <div className="flex flex-col gap-4">
                            {!isEditing && <CustomerInfoField title="Email" value={data?.profile?.email} />}
                            <CustomerInfoField title="Phone" value={data?.profile?.mobile} />
                            <CustomerInfoField
                                title="Date of Birth"
                                value={data?.profile?.dob ? moment(data?.profile?.dob).format('YYYY-MM-DD') : 'N/A'}
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <CustomerInfoField
                                title="Registered On"
                                value={moment(data?.profile?.date_joined).format('YYYY-MM-DD HH:mm:ss a')}
                            />
                            <CustomerInfoField
                                title="Last Login"
                                value={moment(data?.profile?.last_otp_tried_time).format('YYYY-MM-DD HH:mm:ss a')}
                            />
                            <CustomerInfoField title="Gender" value={data?.profile?.gender || 'N/A'} />
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className=" flex flex-col bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4  items-center justify-between shadow-sm hover:shadow-md transition">
                            <span className="text-xl font-semibold text-gray-800 dark:text-white">{data?.orders?.count}</span>
                            <span className="text-sm font-medium px-3 py-1 bg-red-600 text-white rounded-full flex justify-center items-center">
                                Order Count
                            </span>
                        </div>
                        <div className="flex-col bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition">
                            <span className="text-xl font-semibold text-gray-800 dark:text-white">
                                ₹{data?.orders?.total_amount.toFixed(2)}
                            </span>
                            <span className="text-sm font-medium px-3 py-1 bg-green-500 text-white rounded-full">Total Amount</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default CustomerData
