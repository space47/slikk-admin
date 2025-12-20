/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Input } from '@/components/ui'
import React, { useEffect, useState } from 'react'
import { ConfigInterface } from './componentsConfigg/commonConfigTypes'
import moment from 'moment'
import {
    FaEdit,
    FaSearch,
    FaCheckCircle,
    FaTimesCircle,
    FaCalendarAlt,
    FaUserEdit,
    FaIdCard,
    FaSortAmountDown,
    FaPlus,
} from 'react-icons/fa'
import { RiSettings5Fill } from 'react-icons/ri'
import AccessDenied from '@/views/pages/AccessDenied'
import LoadingSpinner from '@/common/LoadingSpinner'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { renderValue } from './componentsConfigg/ConfigurationRender'
import { useNavigate } from 'react-router-dom'

const ConfigurationPage = () => {
    const navigate = useNavigate()
    const [searchConfig, setSearchConfig] = useState('')
    const [filteredData, setFilteredData] = useState<ConfigInterface[]>([])
    const [sortBy, setSortBy] = useState<'id' | 'name' | 'date'>('id')

    const {
        data: configurationData,
        loading: showSpinner,
        responseStatus,
    } = useFetchApi<ConfigInterface>({
        url: '/app/configuration?p=1&page_size=100',
        initialData: [],
    })

    useEffect(() => {
        let data = [...configurationData]
        if (searchConfig.trim() !== '') {
            data = data.filter(
                (item) => item.name.toLowerCase().includes(searchConfig.toLowerCase()) || item.id.toString().includes(searchConfig),
            )
        }
        data.sort((a: any, b: any) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'date':
                    return new Date(b.update_date).getTime() - new Date(a.update_date).getTime()
                case 'id':
                default:
                    return a.id - b.id
            }
        })

        setFilteredData(data)
    }, [searchConfig, configurationData, sortBy])

    if (showSpinner) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        )
    }

    if (responseStatus === '403') {
        return <AccessDenied />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                            <RiSettings5Fill className="text-blue-600 dark:text-blue-400" />
                            Configuration Manager
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">Manage and monitor configurations</p>
                    </div>

                    <Button variant="new" size="sm" icon={<FaPlus />} onClick={() => navigate(`/app/configurations/add`)}>
                        Add New
                    </Button>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                type="search"
                                value={searchConfig}
                                placeholder="Search configurations by name or ID..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                onChange={(e) => setSearchConfig(e.target.value)}
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-lg px-4 border border-gray-200 dark:border-gray-700">
                            <FaSortAmountDown className="text-gray-500" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-300 py-2"
                            >
                                <option value="id">Sort by ID</option>
                                <option value="name">Sort by Name</option>
                                <option value="date">Sort by Date</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Configs</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{configurationData.length}</p>
                            </div>
                            <FaIdCard className="text-3xl text-blue-500 dark:text-blue-400 opacity-80" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {configurationData.filter((item) => item.is_active).length}
                                </p>
                            </div>
                            <FaCheckCircle className="text-3xl text-green-500 dark:text-green-400 opacity-80" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Inactive</p>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                    {configurationData.filter((item) => !item.is_active).length}
                                </p>
                            </div>
                            <FaTimesCircle className="text-3xl text-red-500 dark:text-red-400 opacity-80" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Configuration Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                        <Card
                            key={item.id}
                            className={`group bg-white dark:bg-gray-800 rounded-2xl border shadow-lg hover:shadow-2xl transition-all duration-300 p-5 flex flex-col justify-between transform hover:-translate-y-1 ${
                                item.is_active ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'
                            }`}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                                        <span className="text-white font-bold">{item.id}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    item.is_active
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                                }`}
                                            >
                                                {item.is_active ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href={`/app/configurations/edit/${item.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                                    title="Edit Configuration"
                                >
                                    <FaEdit />
                                </a>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-4 flex-grow mb-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                                        <RiSettings5Fill className="text-gray-400" />
                                        Configuration Name
                                    </h3>
                                    <p className="text-lg font-semibold text-gray-800 dark:text-white break-words">{item.name}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Value</h3>
                                    <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                                        {renderValue(item.value)}
                                    </div>
                                </div>
                            </div>

                            {/* Footer / Meta */}
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <FaCalendarAlt />
                                        <span>Created</span>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                        {moment(item.create_date).format('MMM D, YYYY')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <FaCalendarAlt />
                                        <span>Updated</span>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                        {moment(item.update_date).format('MMM D, YYYY')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <FaUserEdit />
                                        <span>Updated By</span>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[120px]">
                                        {item.last_updated_by || 'System'}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                        <RiSettings5Fill className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No configurations found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                            {searchConfig ? 'Try adjusting your search terms' : 'No configurations available'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ConfigurationPage
