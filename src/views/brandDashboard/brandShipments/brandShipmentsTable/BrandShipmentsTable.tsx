import { Button } from '@/components/ui'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const BrandShipmentsTable = () => {
    const navigate = useNavigate()
    return (
        <div>
            <div onClick={() => navigate(`/app/vendor/shipments/add`)}>
                <Button>Add Brand Shipments</Button>
            </div>
        </div>
    )
}

export default BrandShipmentsTable
