/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Card, Input, Tooltip } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'

import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import {
    FaCheck,
    FaEnvelope,
    FaPhone,
    FaBirthdayCake,
    FaCalendarPlus,
    FaSignInAlt,
    FaVenusMars,
    FaShoppingBag,
    FaRupeeSign,
    FaBriefcase,
} from 'react-icons/fa'
import { MdCancel, MdPerson, MdEmail, MdNumbers } from 'react-icons/md'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { RiEditFill } from 'react-icons/ri'
import { BiUserCircle } from 'react-icons/bi'

import moment from 'moment'

type InfoCardProps = {
    icon: any
    title: string
    value: string
}

const InfoCard = ({ icon, title, value }: InfoCardProps) => (
    <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mr-4">{icon}</div>
        <div className="flex-1">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</div>
            <div className="text-base font-semibold text-gray-800 dark:text-white">{value}</div>
        </div>
    </div>
)

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
        <Card className="h-full shadow-xl rounded-2xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-all duration-300 hover:shadow-2xl">
            <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <HiOutlineUserGroup className="text-2xl text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Customer Profile</h3>
                </div>

                <div className="flex items-center gap-2">
                    {!isEditing ? (
                        <Tooltip title="Edit Profile">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <RiEditFill className="text-lg" />
                                <span className="font-medium">Edit</span>
                            </button>
                        </Tooltip>
                    ) : (
                        <div className="flex gap-3">
                            <Tooltip title="Cancel">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    <MdCancel className="text-xl" />
                                    <span className="font-medium">Cancel</span>
                                </button>
                            </Tooltip>
                            <Tooltip title="Save Changes">
                                <button
                                    onClick={handleSaveUserProfile}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <FaCheck className="text-lg" />
                                    <span className="font-medium">Save</span>
                                </button>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
                    <div className="relative">
                        <Avatar
                            size={100}
                            shape="circle"
                            src={data?.profile?.image}
                            icon={<BiUserCircle className="text-4xl" />}
                            className="border-4 border-white shadow-lg"
                        />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                            <MdPerson className="text-white text-sm" />
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <Input
                                        name="first_name"
                                        type="text"
                                        className="rounded-xl pl-10 py-3 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        placeholder="Enter First Name"
                                        value={inputValues.first_name}
                                        onChange={handleInputChange}
                                        prefix={<MdPerson className="text-gray-400" />}
                                    />
                                </div>
                                <div className="relative">
                                    <Input
                                        name="last_name"
                                        type="text"
                                        className="rounded-xl pl-10 py-3 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                        placeholder="Enter Last Name"
                                        value={inputValues.last_name}
                                        onChange={handleInputChange}
                                        prefix={<MdPerson className="text-gray-400" />}
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <Input
                                    name="email"
                                    type="email"
                                    className="rounded-xl pl-10 py-3 border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    placeholder="Enter Email"
                                    value={inputValues.email}
                                    onChange={handleInputChange}
                                    prefix={<MdEmail className="text-gray-400" />}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                {data?.profile?.first_name} {data?.profile?.last_name}
                            </h2>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <MdEmail className="text-blue-500" />
                                <span className="font-medium">{data?.profile?.email}</span>
                            </div>
                            <div className="mt-3 inline-block px-4 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300">
                                Customer Since: {moment(data?.profile?.date_joined).format('MMM YYYY')}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                        <InfoCard icon={<FaEnvelope className="text-blue-500" />} title="Email" value={data?.profile?.email} />
                        <InfoCard icon={<FaPhone className="text-green-500" />} title="Phone" value={data?.profile?.mobile} />
                        <InfoCard
                            icon={<FaBirthdayCake className="text-pink-500" />}
                            title="Date of Birth"
                            value={data?.profile?.dob ? moment(data?.profile?.dob).format('DD MMM YYYY') : 'Not Set'}
                        />
                        {data?.profile?.age_range && (
                            <InfoCard
                                icon={<MdNumbers className="text-amber-700-500" />}
                                title="Age Range"
                                value={data?.profile?.age_range}
                            />
                        )}
                    </div>
                    <div className="space-y-4">
                        <InfoCard
                            icon={<FaCalendarPlus className="text-purple-500" />}
                            title="Registered On"
                            value={moment(data?.profile?.date_joined).format('DD MMM YYYY, hh:mm A')}
                        />
                        <InfoCard
                            icon={<FaSignInAlt className="text-orange-500" />}
                            title="Last Login"
                            value={moment(data?.profile?.last_otp_tried_time).format('DD MMM YYYY, hh:mm A')}
                        />
                        <InfoCard
                            icon={<FaVenusMars className="text-teal-500" />}
                            title="Gender"
                            value={data?.profile?.gender || 'Not Specified'}
                        />
                        {data?.profile?.profession && (
                            <InfoCard
                                icon={<FaBriefcase className="text-red-800" />}
                                title="Profession"
                                value={data?.profile?.profession}
                            />
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-100 dark:border-red-800/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-800/30 rounded-xl">
                                <FaShoppingBag className="text-2xl text-red-600 dark:text-red-400" />
                            </div>
                            <span className="text-3xl font-bold text-gray-800 dark:text-white">{data?.orders?.count || 0}</span>
                        </div>
                        <div className="text-center">
                            <span className="inline-block px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-md">
                                Total Orders
                            </span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="p-3 bg-green-100 dark:bg-green-800/30 rounded-xl">
                                <FaRupeeSign className="text-2xl text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-3xl font-bold text-gray-800 dark:text-white">
                                ₹{(data?.orders?.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="text-center">
                            <span className="inline-block px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-semibold shadow-md">
                                Total Spent
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Last Updated: {moment().format('DD MMM YYYY')}
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default CustomerData
