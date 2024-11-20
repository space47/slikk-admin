import LoadingSpinner from '@/common/LoadingSpinner'
import { Button } from '@/components/ui'
import { notification } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'

const TaskAndSchedular = () => {
    const [showSpinner, setShowSpinner] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const handleGenerateSiteMap = async () => {
        try {
            setShowSpinner(true)
            const response = await axios.get('https://zgvm8zgvld.execute-api.ap-south-1.amazonaws.com/api/generate-sitemap')

            if (response.status === 200) {
                setMessage('Site map generated successfully!')
                notification.success({
                    message: message || 'Successfully Created sitemap',
                })
            } else {
                setMessage('Failed to generate the site map. Please try again.')
                notification.error({
                    message: message || 'Failed to Created sitemap',
                })
            }
        } catch (error) {
            console.error('Error generating site map:', error)
            setMessage('An error occurred. Please try again.')
        } finally {
            setShowSpinner(false)
        }
    }

    if (showSpinner) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <div className="flex flex-col gap-10 w-1/2 ">
                <span className="font-bold text-2xl">TASK 1: GENERATE SITE MAP</span>
                <div className="w-1/2 flex">
                    <Button variant="new" onClick={handleGenerateSiteMap}>
                        GENERATE
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TaskAndSchedular
