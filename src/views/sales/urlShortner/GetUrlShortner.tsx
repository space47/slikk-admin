import { Button } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import React, { useState } from 'react'
import { AiOutlineCopy } from 'react-icons/ai'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

interface URLDATATYPE {
    status: string
    url: string
}

const GetUrlShortner = () => {
    const [urlInput, setUrlInput] = useState('')
    const [urlData, setUrlData] = useState<URLDATATYPE>()
    const [urlShow, setUrlShow] = useState(false)

    const navigate = useNavigate()
    const handleAddUrlShortner = () => {
        navigate(`/app/appsCommuncication/urlShortner/addNew`)
    }

    const handleCopy = (file: any) => {
        navigator.clipboard.writeText(file)
        notification.success({
            message: 'Copied',
        })
    }

    const handleGetUrl = async () => {
        try {
            const response = await axioisInstance.get(`/s/${urlInput}`)
            const data = response.data
            setUrlData(data)
            setUrlShow(true)
        } catch (error) {
            console.log(error)
        }
    }

    const hanldeUrlEdit = () => {}

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg shadow-lg">
            <Button onClick={handleAddUrlShortner} variant="new" className=" text-white font-semibold px-4 py-2 rounded-md  transition">
                Add Url
            </Button>

            <input
                value={urlInput}
                placeholder="Enter URL to get data"
                onChange={(e) => setUrlInput(e.target.value)}
                className="mt-4 p-2 border border-gray-300 rounded-md w-full max-w-md focus:outline-none "
            />

            <Button onClick={handleGetUrl} className="text-white font-semibold px-4 py-2 mt-4 rounded-md transition" variant="accept">
                Get Url
            </Button>

            {urlShow && (
                <div className="mt-6 text-lg font-medium text-gray-700 flex gap-2">
                    <span className="font-bold">{urlInput}:</span> {urlData?.url}
                    <AiOutlineCopy className="text-gray-500 cursor-pointer text-xl" onClick={() => handleCopy(urlData?.url)} />
                    <br />
                    <FaEdit className="text-xl text-blue-600 cursor-pointer" onClick={hanldeUrlEdit} />
                </div>
            )}
        </div>
    )
}

export default GetUrlShortner
