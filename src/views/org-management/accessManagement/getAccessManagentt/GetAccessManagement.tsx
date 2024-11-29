import React, { useEffect, useState } from 'react'
import { GROUPTYPES, USERGROUPDATA, PERMISSIONGROUPDATA } from './groupCommon' // Assuming GROUPTYPES is defined
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import PermCardComponent from './componentsManagement/PermCardComponent'
import { notification } from 'antd'
import UserGroupTable from './componentsManagement/UserGroupTable'
import { Button, Spinner } from '@/components/ui'
import { useNavigate } from 'react-router-dom'

const GetAccessManagement = () => {
    const [getGroups, setGetGroups] = useState<GROUPTYPES[]>([])
    const [userGroupData, setUserGroupData] = useState<USERGROUPDATA[]>([])
    const [getPermission, setGetPermission] = useState<PERMISSIONGROUPDATA[]>([])
    const [searchInput, setSearchInput] = useState('')
    const [addedPermissions, setAddedPermissions] = useState<PERMISSIONGROUPDATA[]>([])
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
    const [activeGroup, setActiveGroup] = useState<number | null>(null)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [showTableSpinner, setShowTableSpinner] = useState(false)
    const navigate = useNavigate()

    const fetchGroupsData = async () => {
        try {
            const response = await axioisInstance.get(`/groups`)
            const data = response?.data?.groups
            setGetGroups(data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchPermissionData = async () => {
        try {
            const response = await axioisInstance.get(`/permissions`)
            const perm = response.data?.permissions
            setGetPermission(perm)
        } catch (error: any) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchGroupsData()
        fetchPermissionData()
    }, [])

    const fetchForPermAndUser = async () => {
        try {
            setShowTableSpinner(true)
            const response = await axioisInstance.get(`/groups?id=${activeGroup}&p=${page}&page_size=${pageSize}`)
            const data = response?.data?.group
            setUserGroupData(data?.users)
            setAddedPermissions(data?.permissions)
        } catch (error) {
            console.error(error)
        } finally {
            setShowTableSpinner(false)
        }
    }

    useEffect(() => {
        if (activeGroup) {
            fetchForPermAndUser()
        }
    }, [activeGroup])

    const handleClick = (id: number) => {
        setActiveGroup(id)
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
    }

    const handlePermissionSelect = (id: number) => {
        setSelectedPermissions((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((permId) => permId !== id) : [...prevSelected, id],
        )
    }
    const handleAddPermissions = () => {
        const alreadyAdded = selectedPermissions.filter((permId) => addedPermissions.some((added) => added.id === permId))
        if (alreadyAdded.length > 0) {
            notification.warning({
                message: 'Warning',
                description: 'Permission already added',
            })
        }
        const selected = getPermission?.filter(
            (perm) => selectedPermissions.includes(perm.id) && !addedPermissions.some((added) => added.id === perm.id),
        )
        setAddedPermissions((prevAdded) => [...prevAdded, ...selected])
        setSelectedPermissions([])
    }
    const handleRemovePermissions = (id: number) => {
        setAddedPermissions((prevAdded) => prevAdded.filter((perm) => perm.id !== id))
    }
    const filteredPermission = getPermission?.filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()))

    const handleAddGroup = () => {
        navigate(`/app/accessManagement/addNew`)
    }
    const handleUpdatePermission = async () => {
        const permissionIds = addedPermissions.map((item) => item.id)
        const body = {
            group_id: activeGroup,
            permissions: permissionIds,
        }
        try {
            const response = await axioisInstance.patch(`/groups`, body)
            notification.success({
                message: response?.data?.message || 'SUCCESSFULLY ADDED PERMISSION',
            })
            navigate(0)
        } catch (error: any) {
            console.error(error)
            notification.error({
                message: 'Failed to add permission',
            })
        }
    }
    return (
        <div className="p-6">
            <div className="flex justify-end">
                <Button variant="new" onClick={handleAddGroup}>
                    Add Groups
                </Button>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Group Names</h2>
            <div className="flex gap-2 flex-wrap mb-5">
                {getGroups
                    .filter((group) => group.id !== 1)
                    .map((group) => (
                        <div
                            key={group.id}
                            className={`cursor-pointer px-4 py-2 rounded-md shadow-md transition font-bold
              ${activeGroup === group.id ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
            `}
                            onClick={() => handleClick(group.id)}
                        >
                            {group.name.toUpperCase()}
                        </div>
                    ))}
            </div>

            {activeGroup ? (
                <>
                    {showTableSpinner ? (
                        <div className="flex justify-center items-center h-screen">
                            <Spinner size={40} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-10">
                            <div>
                                <h3>Permissions:</h3>
                                <PermCardComponent
                                    label="PERMISSIONS"
                                    selectedValue={selectedPermissions}
                                    getValue={filteredPermission}
                                    handleSelect={handlePermissionSelect}
                                    addedValue={addedPermissions}
                                    handleAdd={handleAddPermissions}
                                    handleRemove={handleRemovePermissions}
                                    searchInput={searchInput}
                                    handleSearch={handleSearch}
                                    handleUpdatePermission={handleUpdatePermission}
                                />
                            </div>

                            <div>
                                <h3>User Table</h3>
                                <UserGroupTable
                                    data={userGroupData}
                                    page={page}
                                    pageSize={pageSize}
                                    setPage={setPage}
                                    setPageSize={setPageSize}
                                    totalData={userGroupData?.length}
                                    showTableSpinner={showTableSpinner}
                                />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="flex justify-center items-center h-auto xl:mt-20">
                        <h3>Select Groups To Display Data </h3>
                    </div>
                </>
            )}
        </div>
    )
}

export default GetAccessManagement
