import { Card, Spinner } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfigInterface } from './componentsConfigg/commonConfigTypes'
import moment from 'moment'
import { FaEdit } from 'react-icons/fa'
import _ from 'lodash'

const ConfigurationPage = () => {
    const [configurationData, setConfigurationData] = useState<ConfigInterface[]>([])
    const [showSpinner, setShowSpinner] = useState(false)
    const navigate = useNavigate()

    const fetchConfigurationApi = async () => {
        try {
            setShowSpinner(true)
            const response = await axioisInstance.get(`/app/configuration`)
            const apiData = response.data?.data
            setConfigurationData(apiData?.results)
            setShowSpinner(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchConfigurationApi()
    }, [])

    if (showSpinner) {
        return (
            <div className="h-screen flex justify-center items-center">
                {' '}
                <Spinner size={40} />
            </div>
        )
    }

    const renderValue = (value: any) => {
        if (_.isPlainObject(value)) {
            return (
                <div className="flex flex-col h-36 overflow-y-auto bg-gray-100 p-3 rounded-lg shadow-inner scrollbar-hide">
                    {Object.entries(value).map(([key, val]) => (
                        <div key={key} className="text-sm text-gray-700 space-y-1">
                            <strong className="text-gray-500">{key}:</strong>{' '}
                            {_.isPlainObject(val) ? (
                                <span className="text-indigo-600">{JSON.stringify(val)}</span>
                            ) : (
                                <span className="text-indigo-600">{val}</span>
                            )}
                        </div>
                    ))}
                </div>
            )
        }
        return <span className="text-indigo-600">{value}</span>
    }

    const handleEditConfiguration = (id: number) => {
        navigate(`/app/configurations/edit/${id}`)
    }

    return (
        <div className="flex flex-col gap-6 p-8  min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {configurationData.map((item) => (
                    <Card
                        className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col gap-4 h-full"
                        key={item.id}
                    >
                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-bold text-gray-800 flex justify-between">
                                <span className="text-gray-700 flex gap-2">
                                    Id:<span className="text-red-600">{item.id}</span>
                                </span>
                                <span>
                                    <FaEdit onClick={() => handleEditConfiguration(item.id)} className="cursor-pointer text-blue-500" />
                                </span>
                            </div>
                            <div className="text-lg font-medium text-gray-700">
                                Name: <span className="text-green-600">{item?.name}</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-2">{renderValue(item?.value)}</div>
                            <div className="text-sm text-gray-500 mt-2">
                                <span className="font-semibold">Created:</span> {moment(item?.create_date).format('YYYY-MM-DD')}
                            </div>
                            <div className="text-sm text-gray-500">
                                <span className="font-semibold">Updated:</span> {moment(item?.update_date).format('YYYY-MM-DD')}
                            </div>
                            <div className="text-sm text-gray-500">
                                <span className="font-semibold">Is Active:{item?.is_active}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                                <span className="font-semibold">Last Updated By:</span> {item?.last_updated_by}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default ConfigurationPage
