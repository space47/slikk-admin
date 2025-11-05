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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                {filteredData
                    ?.sort((a: any, b: any) => a?.id - b?.id)
                    ?.map((item) => (
                        <Card
                            key={item.id}
                            className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold text-lg">
                                    <span className="text-gray-600 dark:text-gray-400">ID:</span>
                                    <span className="text-red-600 dark:text-red-400">{item?.id}</span>
                                </div>
                                <a
                                    href={`/app/configurations/edit/${item?.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    <FaEdit className="text-xl" />
                                </a>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-3 flex-grow">
                                <div className="text-gray-700 dark:text-gray-300 text-base">
                                    <span className="font-semibold text-gray-800 dark:text-gray-100">Name:</span>{' '}
                                    <span className="text-green-600 dark:text-green-400 break-words">{item?.name}</span>
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{renderValue(item?.value)}</div>
                            </div>

                            {/* Footer / Meta */}
                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex flex-col gap-1">
                                <div className="flex justify-between">
                                    <span className="font-medium">Created:</span>
                                    <span>{moment(item?.create_date).format('YYYY-MM-DD')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Updated:</span>
                                    <span>{moment(item?.update_date).format('YYYY-MM-DD')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Active:</span>
                                    <span
                                        className={`font-semibold ${
                                            item?.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                                        }`}
                                    >
                                        {item?.is_active ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Updated By:</span>
                                    <span className="truncate max-w-[60%] text-right">{item?.last_updated_by || '-'}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
            </div>
        </div>
    )
}

export default ConfigurationPage
