import { Button } from '@/components/ui'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ManageTemplates = () => {
    const navigate = useNavigate()

    const hanldeNewTemplates = () => {
        navigate(`/app/appsCommuncication/templates/addNew`)
    }

    return (
        <div>
            <Button variant="new" onClick={hanldeNewTemplates}>
                Add new Templates
            </Button>
        </div>
    )
}

export default ManageTemplates
