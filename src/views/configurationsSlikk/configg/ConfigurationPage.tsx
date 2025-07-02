/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Input } from '@/components/ui'
import React, { useEffect, useState } from 'react'
import { ConfigInterface } from './componentsConfigg/commonConfigTypes'
import moment from 'moment'
import { FaEdit } from 'react-icons/fa'
import AccessDenied from '@/views/pages/AccessDenied'
import LoadingSpinner from '@/common/LoadingSpinner'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { renderValue } from './componentsConfigg/ConfigurationRender'

const ConfigurationPage = () => {
    const [searchConfig, setSearchConfig] = useState('')
    const [filteredData, setFilteredData] = useState<ConfigInterface[]>([])

    const {
        data: configurationData,
        loading: showSpinner,
        responseStatus,
    } = useFetchApi<ConfigInterface>({
        url: '/app/configuration?p=1&page_size=100',
        initialData: [],
    })

    useEffect(() => {
        if (searchConfig.trim() !== '') {
            const filteredData = configurationData.filter((item) => item.name.toLowerCase().includes(searchConfig.toLowerCase()))
            setFilteredData(filteredData)
        } else if (!searchConfig.trim()) {
            setFilteredData(configurationData)
        }
    }, [searchConfig, configurationData])

    if (showSpinner) {
        return <LoadingSpinner />
    }
    if (responseStatus === '403') {
        return <AccessDenied />
    }

    return (
        <div className="flex flex-col gap-6 p-8  min-h-screen">
            <div className="flex mb-4">
                <Input
                    type="search"
                    value={searchConfig}
                    placeholder="Search Configuration by Name"
                    className="w-1/2 max-w-md mb-6 rounded-xl"
                    onChange={(e) => setSearchConfig(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredData
                    ?.sort(function (a: any, b: any) {
                        return a?.id - b?.id
                    })
                    ?.map((item) => (
                        <Card
                            key={item.id}
                            className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col gap-4 h-full"
                        >
                            <div className="flex flex-col gap-2">
                                <div className="text-xl font-bold text-gray-800 flex justify-between">
                                    <span className="text-gray-700 flex gap-2">
                                        Id:<span className="text-red-600">{item?.id}</span>
                                    </span>
                                    <a href={`/app/configurations/edit/${item?.id}`} target="_blank" rel="noreferrer">
                                        <FaEdit className="cursor-pointer text-blue-500" />
                                    </a>
                                </div>
                                <div className="text-lg font-medium text-gray-700">
                                    Name: <span className="text-green-600 break-words">{item?.name}</span>
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
