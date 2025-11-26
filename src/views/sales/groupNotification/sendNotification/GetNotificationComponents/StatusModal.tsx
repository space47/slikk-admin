import { Dialog } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'

interface Props {
    isOpen: boolean
    onClose: () => void
    name: string
}

interface StatusData {
    id: number
    name: string
    title: string
    message: string
    total_users: number
    success: number
    failure: number
    create_date: string
    update_date: string
    notification: string | null
}

const StatusModal = ({ name, isOpen, onClose }: Props) => {
    const [statusData, setStatusData] = useState<StatusData | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchStatus = async () => {
        setLoading(true)
        try {
            const res = await axioisInstance.get(`/notification/stats?notification_name=${name}`)
            const data = res?.data?.data?.results
            setStatusData(data[0])
        } catch (error) {
            const err = error as AxiosError
            notification.error({
                message: 'Failed to load status',
                description: err.message,
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isOpen) fetchStatus()
    }, [isOpen])

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={600}>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Notification Status</h2>
                {loading ? (
                    <div className="flex justify-center items-center py-10 text-gray-500">
                        <span className="animate-spin h-6 w-6 border-4 border-blue-400 border-t-transparent rounded-full mr-3" />
                        Loading...
                    </div>
                ) : statusData ? (
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-gray-500">Name</p>
                            <p className="text-lg font-semibold text-gray-800">{statusData.name}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-gray-500">Title</p>
                            <p className="text-lg font-semibold text-gray-800">{statusData.title}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-gray-500">Total Users</p>
                            <p className="text-lg font-bold text-indigo-600">{statusData.total_users}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-green-600">Success</p>
                            <p className="text-lg font-bold text-green-700">{statusData.success}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-xl shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-red-600">Failure</p>
                            <p className="text-lg font-bold text-red-700">{statusData.failure}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-gray-500">Created At</p>
                            <p className="text-sm font-medium text-gray-700">{new Date(statusData.create_date).toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-gray-500">Updated At</p>
                            <p className="text-sm font-medium text-gray-700">{new Date(statusData.update_date).toLocaleString()}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-500 text-center py-10">No data available</div>
                )}
            </div>
        </Dialog>
    )
}

export default StatusModal
