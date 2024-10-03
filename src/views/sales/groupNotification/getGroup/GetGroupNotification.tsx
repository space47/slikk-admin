import { Button } from '@/components/ui'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const GetGroupNotification = () => {
    const navigate = useNavigate()
    const handleAddVariant = () => {
        navigate(`/app/appsCommuncication/addGroups`)
    }
    return (
        <div>
            <Button variant="new" onClick={handleAddVariant}>
                Add Groups
            </Button>
            GetGroupNotification
        </div>
    )
}

export default GetGroupNotification
