import { Button } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SeoSettings = () => {
    const navigate = useNavigate()
    const [seoData, setSeoData] = useState([])

    const fetchSeoDatas = async () => {
        try {
            const response = await axioisInstance.get(`/seo/links?link_types=popular links`)
            const data = response?.data?.data
            setSeoData(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchSeoDatas()
    }, [])

    return (
        <div>
            <div className="flex justify-end">
                <Button variant="new" onClick={handleAddSeoSettings}>
                    Add SEO settings
                </Button>
            </div>
            SeoSettings
        </div>
    )

    function handleAddSeoSettings() {
        navigate(`/app/appSettings/seoSettings/addNew`)
    }
}

export default SeoSettings
