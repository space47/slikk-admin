import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import React from 'react'

interface props {
    cacheKey: string
}

const ClearCache = ({ cacheKey }: props) => {
    const handleClearCache = async () => {
        try {
            const body = {
                key: `${cacheKey}`,
            }
            const response = await axioisInstance.post(`/cache/clear`, body)
            notification.success({
                message: response?.data?.message || 'Cache Cleared Successfully',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to clear Cache ',
            })
        }
    }
    return (
        <div>
            <button className="text-white bg-red-600 hover:bg-red-500 p-2 rounded-lg" onClick={handleClearCache}>
                Clear Cache
            </button>
        </div>
    )
}

export default ClearCache
