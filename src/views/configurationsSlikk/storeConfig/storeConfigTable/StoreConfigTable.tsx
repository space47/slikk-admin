/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Input } from '@/components/ui'
import React, { useEffect, useState } from 'react'
import { ConfigInterface } from '../../configg/componentsConfigg/commonConfigTypes'
import moment from 'moment'
import { FaEdit, FaSearch, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaStore, FaPlus, FaIdCard } from 'react-icons/fa'
import { RiSettings5Fill } from 'react-icons/ri'
import { renderValue } from '../../configg/componentsConfigg/ConfigurationRender'
import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useAppDispatch, useAppSelector } from '@/store'
import { companyStore } from '@/store/types/companyStore.types'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import MetaSection from '../components/MetaSection'
import StoreStatCard from '../components/StoreStatCard'

const StoreConfigValue = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [searchConfig, setSearchConfig] = useState('')
    const [filteredData, setFilteredData] = useState<ConfigInterface[]>([])
    const [configurationData, setConfigurationData] = useState<ConfigInterface[]>([])
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const fetchStoreConfig = async () => {
        try {
            const response = await axioisInstance.get('/store/configuration')
            const data = response.data?.data || []
            setConfigurationData(data)
            setFilteredData(data)
        } catch (error) {
            console.error('Error fetching store configurations:', error)
        }
    }

    useEffect(() => {
        fetchStoreConfig()
    }, [])

    useEffect(() => {
        if (searchConfig.trim()) {
            setFilteredData(
                configurationData.filter(
                    (item) => item.name.toLowerCase().includes(searchConfig.toLowerCase()) || item.id.toString().includes(searchConfig),
                ),
            )
        } else {
            setFilteredData(configurationData)
        }
    }, [searchConfig, configurationData])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <RiSettings5Fill className="text-blue-600" />
                        Store Configurations
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage store-level configuration values</p>
                </div>

                <Button variant="new" size="sm" icon={<FaPlus />} onClick={() => navigate('/app/storeConfigurations/add')}>
                    Add Configuration
                </Button>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6">
                <div className="relative max-w-md">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="search"
                        value={searchConfig}
                        placeholder="Search by config name..."
                        className="pl-11 rounded-xl bg-gray-50 dark:bg-gray-900"
                        onChange={(e) => setSearchConfig(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StoreStatCard label="Total Configs" value={configurationData.length} icon={<FaIdCard />} color="blue" />
                <StoreStatCard
                    label="Active"
                    value={configurationData.filter((x) => x.is_active).length}
                    icon={<FaCheckCircle />}
                    color="green"
                />
                <StoreStatCard
                    label="Inactive"
                    value={configurationData.filter((x) => !x.is_active).length}
                    icon={<FaTimesCircle />}
                    color="red"
                />
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredData.length ? (
                    filteredData
                        .sort((a: any, b: any) => a.id - b.id)
                        .map((item) => (
                            <Card
                                key={item.id}
                                className={`rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all border-l-4 ${
                                    item.is_active ? 'border-l-green-500' : 'border-l-red-500'
                                }`}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                                            {item.id}
                                        </div>
                                        <span
                                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {item.is_active ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                    </div>

                                    <a
                                        href={`/app/storeConfigurations/edit/${item.id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 rounded-lg bg-gray-100 hover:bg-blue-50 text-blue-600"
                                    >
                                        <FaEdit />
                                    </a>
                                </div>

                                {/* Content */}
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-semibold text-gray-800 break-words">{item.name}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <FaStore /> Store
                                        </p>
                                        <p className="text-blue-600 font-medium">{storeResults?.find((x) => x.id === item.store)?.name}</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3 text-sm">{renderValue(item.value)}</div>
                                </div>

                                {/* Footer */}
                                <div className="mt-4 pt-4 border-t text-sm space-y-2 text-gray-600">
                                    <MetaSection
                                        icon={<FaCalendarAlt />}
                                        label="Created"
                                        value={moment(item.create_date).format('MMM D, YYYY')}
                                    />
                                    <MetaSection
                                        icon={<FaCalendarAlt />}
                                        label="Updated"
                                        value={moment(item.update_date).format('MMM D, YYYY')}
                                    />
                                </div>
                            </Card>
                        ))
                ) : (
                    <div className="col-span-full text-center py-16 text-gray-500">No configurations found</div>
                )}
            </div>
        </div>
    )
}

export default StoreConfigValue

MetaSection
