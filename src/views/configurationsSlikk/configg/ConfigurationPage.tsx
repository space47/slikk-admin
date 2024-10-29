import { Button } from '@/components/ui'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ConfigurationPage = () => {
    const navigate = useNavigate()

    const hanldeAddConfig = () => {
        navigate(`/app/configurations/add`)
    }

    return (
        <div className="flex flex-col">
            <Button onClick={hanldeAddConfig}>Add Config</Button>
            ConfigurationPage
        </div>
    )
}

export default ConfigurationPage
