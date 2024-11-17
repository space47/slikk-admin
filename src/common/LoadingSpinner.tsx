import { Spinner } from '@/components/ui'
import React from 'react'

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center  h-screen">
            <Spinner size={40} />
        </div>
    )
}

export default LoadingSpinner
