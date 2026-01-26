/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { FiLock } from 'react-icons/fi'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import PermCardComponent from './componentsManagement/PermCardComponent'
import UserGroupTable from './componentsManagement/UserGroupTable'
import { Button, Spinner } from '@/components/ui'
import AccessDenied from '@/views/pages/AccessDenied'
import { GROUPTYPES, USERGROUPDATA, PERMISSIONGROUPDATA } from './groupCommon'
import { FaLock } from 'react-icons/fa'
import { AxiosError } from 'axios'
import { errorMessage } from '@/utils/responseMessages'

interface SearchState {
    allPermissions: string
    addedPermissions: string
}

interface LoadingState {
    table: boolean
    initial: boolean
    updating: boolean
}

const GetAccessManagement = () => {
    const navigate = useNavigate()
    const [groups, setGroups] = useState<GROUPTYPES[]>([])
    const [userGroupData, setUserGroupData] = useState<USERGROUPDATA[]>([])
    const [permissions, setPermissions] = useState<PERMISSIONGROUPDATA[]>([])
    const [addedPermissions, setAddedPermissions] = useState<PERMISSIONGROUPDATA[]>([])
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])
    const [activeGroupId, setActiveGroupId] = useState<number | null>(null)
    const [search, setSearch] = useState<SearchState>({ allPermissions: '', addedPermissions: '' })
    const [loading, setLoading] = useState<LoadingState>({ table: false, initial: true, updating: false })
    const [accessDenied, setAccessDenied] = useState(false)
    const filteredPermissions = useMemo(() => {
        return permissions.filter((permission) => permission.name.toLowerCase().includes(search.allPermissions.toLowerCase()))
    }, [permissions, search.allPermissions])

    const filteredAddedPermissions = useMemo(() => {
        return addedPermissions.filter((permission) => permission.name.toLowerCase().includes(search.addedPermissions.toLowerCase()))
    }, [addedPermissions, search.addedPermissions])

    const filteredGroups = useMemo(() => {
        return groups.filter((group) => group.id !== 1)
    }, [groups])
    const fetchGroups = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/groups')
            setGroups(response?.data?.groups || [])
        } catch (error: any) {
            if (error?.response?.status === 403) {
                setAccessDenied(true)
            } else {
                if (error instanceof AxiosError) {
                    errorMessage(error)
                }
            }
        }
    }, [])

    const fetchPermissions = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/permissions')
            setPermissions(response?.data?.permissions || [])
        } catch (error: any) {
            if (error?.response?.status === 403) {
                setAccessDenied(true)
            }
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        }
    }, [])

    const fetchGroupDetails = useCallback(async (groupId: number) => {
        if (!groupId) return
        try {
            setLoading((prev) => ({ ...prev, table: true }))
            const response = await axiosInstance.get(`/groups?id=${groupId}`)
            const groupData = response?.data?.group
            setUserGroupData(groupData?.users || [])
            setAddedPermissions(groupData?.permissions || [])
            setSelectedPermissionIds([])
        } catch (error: any) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        } finally {
            setLoading((prev) => ({ ...prev, table: false }))
        }
    }, [])

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading((prev) => ({ ...prev, initial: true }))
            await Promise.allSettled([fetchGroups(), fetchPermissions()])
            setLoading((prev) => ({ ...prev, initial: false }))
        }

        loadInitialData()
    }, [fetchGroups, fetchPermissions])

    useEffect(() => {
        if (activeGroupId) {
            fetchGroupDetails(activeGroupId)
        }
    }, [activeGroupId, fetchGroupDetails])

    const handleGroupSelect = useCallback((groupId: number) => {
        setActiveGroupId(groupId)
        setSelectedPermissionIds([])
        setSearch({ allPermissions: '', addedPermissions: '' })
    }, [])

    const handleSearch = useCallback((section: keyof SearchState, value: string) => {
        setSearch((prev) => ({ ...prev, [section]: value }))
    }, [])

    const handlePermissionSelect = useCallback((permissionId: number) => {
        setSelectedPermissionIds((prev) =>
            prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId],
        )
    }, [])

    const handleSelectAllPermissions = useCallback(() => {
        const allIds = filteredPermissions.map((p) => p.id)
        setSelectedPermissionIds((prev) => (prev.length === allIds.length ? [] : allIds))
    }, [filteredPermissions])

    const handleAddPermissions = useCallback(() => {
        if (selectedPermissionIds.length === 0) {
            notification.info({ message: 'Info', description: 'No permissions selected' })
            return
        }
        const newPermissions = permissions.filter(
            (permission) => selectedPermissionIds.includes(permission.id) && !addedPermissions.some((added) => added.id === permission.id),
        )

        if (newPermissions.length === 0) {
            notification.warning({ message: 'Warning', description: 'All selected permissions are already added' })
            return
        }

        setAddedPermissions((prev) => [...prev, ...newPermissions])
        setSelectedPermissionIds([])
        notification.success({ message: 'Success', description: `Added ${newPermissions.length} permission(s)` })
    }, [selectedPermissionIds, permissions, addedPermissions])

    const handleRemovePermission = useCallback((permissionId: number) => {
        setAddedPermissions((prev) => prev.filter((permission) => permission.id !== permissionId))
    }, [])

    const handleUpdatePermissions = useCallback(async () => {
        if (!activeGroupId) {
            notification.warning({ message: 'Warning', description: 'Please select a group first' })
            return
        }

        setLoading((prev) => ({ ...prev, updating: true }))
        const permissionIds = addedPermissions.map((permission) => permission.id)

        try {
            await axiosInstance.patch('/groups', {
                group_id: activeGroupId,
                permissions: permissionIds,
            })

            notification.success({ message: 'Success', description: 'Permissions updated successfully' })
            await fetchGroupDetails(activeGroupId)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        } finally {
            setLoading((prev) => ({ ...prev, updating: false }))
        }
    }, [activeGroupId, addedPermissions, fetchGroupDetails])

    const handleAddGroup = useCallback(() => {
        navigate('/app/accessManagement/addNew')
    }, [navigate])

    if (accessDenied) {
        return <AccessDenied />
    }

    if (loading.initial) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <Spinner size={48} className="mb-4" />
                    <p className="text-gray-600">Loading access management...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <span>
                        <FaLock className="text-3xl text-orange-600" />
                    </span>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Access Management</h1>
                        <p className="text-gray-600 mt-1">Manage group permissions and user access</p>
                    </div>
                </div>
                <Button variant="solid" onClick={handleAddGroup} className="flex items-center gap-2">
                    <FiLock className="text-lg" />
                    Add New Group
                </Button>
            </div>
            <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a Group</h2>
                <div className="flex flex-wrap gap-3">
                    {filteredGroups.map((group) => (
                        <button
                            key={group.id}
                            onClick={() => handleGroupSelect(group.id)}
                            className={`px-5 py-3 rounded-xl transition-all duration-200 font-medium flex items-center gap-2
                ${
                    activeGroupId === group.id
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg transform scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md border border-gray-200'
                }
              `}
                        >
                            <FiLock />
                            {group.name}
                        </button>
                    ))}
                </div>
            </section>
            {activeGroupId ? (
                <div className="space-y-8">
                    <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Permission Management</h3>
                                <p className="text-gray-600 mt-1">Manage permissions for the selected group</p>
                            </div>
                            {loading.updating && (
                                <div className="flex items-center gap-2 text-blue-600">
                                    <Spinner size={20} />
                                    <span className="text-sm">Updating...</span>
                                </div>
                            )}
                        </div>
                        <PermCardComponent
                            label="PERMISSIONS"
                            selectedValue={selectedPermissionIds}
                            getValue={filteredPermissions}
                            handleSelect={handlePermissionSelect}
                            addedValue={filteredAddedPermissions}
                            handleAdd={handleAddPermissions}
                            handleRemove={handleRemovePermission}
                            searchInput={search.allPermissions}
                            handleSearch={(e) => handleSearch('allPermissions', e.target.value)}
                            addedSearchInput={search.addedPermissions}
                            handleAddedSearch={(e) => handleSearch('addedPermissions', e.target.value)}
                            handleUpdatePermission={handleUpdatePermissions}
                            selectAll={filteredPermissions.length > 0}
                            handleSelectAll={handleSelectAllPermissions}
                            isLoading={loading.updating}
                        />
                    </section>
                    <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Group Users</h3>
                                <p className="text-gray-600 mt-1">Manage users in the selected group</p>
                            </div>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                {userGroupData.length} users
                            </span>
                        </div>

                        {loading.table ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-center">
                                    <Spinner size={40} className="mb-4" />
                                    <p className="text-gray-600">Loading users...</p>
                                </div>
                            </div>
                        ) : (
                            <UserGroupTable data={userGroupData} showTableSpinner={loading.table} />
                        )}
                    </section>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="text-gray-300 mb-6">
                        <FiLock size={80} />
                    </div>
                    <h3 className="text-2xl font-medium text-gray-700 mb-3">No Group Selected</h3>
                    <p className="text-gray-500 max-w-md mb-8">Select a group from above to view and manage its permissions and users</p>
                    <div className="flex items-center gap-2 text-gray-400">
                        <FiLock />
                        <span className="text-sm">Select a group to get started</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GetAccessManagement
