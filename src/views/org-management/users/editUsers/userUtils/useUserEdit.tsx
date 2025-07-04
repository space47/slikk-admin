/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { notification } from 'antd'
import { useAppSelector } from '@/store'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'

// Type definitions
interface Permission {
    id: number
    name: string
}

interface Group {
    id: number
    name: string
}

interface Company {
    id: number
    name: string
}

interface FormModel {
    first_name?: string
    last_name?: string
    mobile?: string
    email?: string
    business_email?: string
    permissions?: Permission[]
    company?: Company[]
}

interface SINGLE_COMPANY_DATA {
    id: number
    name: string
}

interface AccessDeniedState {
    groups: boolean
    permission: boolean
    company: boolean
}

const useUserEdit = () => {
    // State management
    const [userData, setUserData] = useState<FormModel>()
    const [getPermission, setGetPermission] = useState<Permission[]>()
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
    const [addedPermissions, setAddedPermissions] = useState<Permission[]>([])
    const [searchInput, setSearchInput] = useState('')

    const [getGroups, setGetGroups] = useState<Group[]>([])
    const [selectedGroups, setSelectedGroups] = useState<number[]>([])
    const [addedGroups, setAddedGroups] = useState<Group[]>([])
    const [groupSearchInput, setGroupSearchInput] = useState('')

    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const [selectedCompany, setSelectedCompany] = useState<number[]>([])
    const [addedCompany, setAddedCompany] = useState<Company[]>([])
    const [companySearchInput, setCompanySearchInput] = useState('')

    const [loadingEdit, setLoadingEdit] = useState(false)
    const [accessDenied, setAccessDenied] = useState<AccessDeniedState>({
        groups: false,
        permission: false,
        company: false,
    })
    const [storeAssign, setStoreAssign] = useState(false)
    const [storePicker, setStorePicker] = useState<string | number>('')

    const { mobile } = useParams()
    const navigate = useNavigate()
    const currentCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)

    // Helper functions
    const handleSearch = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setter(e.target.value)

    const filterItems = (items: any[], searchTerm: string) =>
        items?.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

    // API calls
    const fetchData = async (url: string, setData: (data: any) => void, accessKey: keyof AccessDeniedState) => {
        try {
            const response = await axioisInstance.get(url)
            setData(response.data?.permissions || response.data?.groups || response.data.data)
        } catch (error: any) {
            if (error.response?.status === 403) {
                setAccessDenied((prev) => ({ ...prev, [accessKey]: true }))
            }
            console.error(error)
        }
    }

    const fetchUserData = async () => {
        try {
            setLoadingEdit(true)
            const response = await axioisInstance.get(`/company/${currentCompany.id}/users?mobile=${mobile}`)
            const usersInfo = response.data.data

            setUserData(usersInfo)
            setAddedCompany(usersInfo?.company?.map((item: Company) => ({ id: item.id, name: item.name })))
            setLoadingEdit(false)
        } catch (error: any) {
            if (error.response?.status === 403) {
                setAccessDenied((prev) => ({ ...prev, company: true }))
            }
            console.error(error)
            setLoadingEdit(false)
        }
    }

    const fetchUserPermissions = async (type: 'permission' | 'group') => {
        try {
            const response = await axioisInstance.get(`company/user/${type}/${mobile}`)
            const data = type === 'permission' ? response.data.user_permissions : response.data.user_groups
            type === 'permission' ? setAddedPermissions(data) : setAddedGroups(data)
        } catch (error: any) {
            if (error.response?.status === 403) {
                setAccessDenied((prev) => ({ ...prev, [type]: true }))
            }
            console.error(error)
        }
    }

    // Initial data loading
    useEffect(() => {
        fetchUserData()
        fetchData('/permissions', setGetPermission, 'permission')
        fetchData('/groups', setGetGroups, 'groups')
        fetchUserPermissions('permission')
        fetchUserPermissions('group')
    }, [currentCompany])

    // Selection handlers
    const handleSelect = (id: number, selectedItems: number[], setSelected: (items: number[]) => void, multiSelect = true) => {
        setSelected(
            selectedItems.includes(id) ? selectedItems.filter((itemId) => itemId !== id) : multiSelect ? [...selectedItems, id] : [id],
        )
    }

    // Add/Remove handlers
    const handleAddItems = async (
        selectedIds: number[],
        addedItems: any[],
        allItems: any[],
        setAdded: (items: any[]) => void,
        endpoint: string,
        successMessage: string,
        errorMessage: string,
        bodyExtra: Record<string, any> = {},
        isGroup = false,
    ) => {
        const alreadyAdded = selectedIds.filter((id) => addedItems.some((item) => item.id === id))

        if (alreadyAdded.length > 0) {
            notification.warning({
                message: 'Warning',
                description: `${isGroup ? 'Group' : 'Item'} already added`,
            })
        }

        const selected = allItems?.filter((item) => selectedIds.includes(item.id) && !addedItems.some((added) => added.id === item.id))

        setAdded([...addedItems, ...selected])

        const body = {
            ...bodyExtra,
            [isGroup ? 'group_id' : 'permission_id']: selectedIds.join(','),
            action: isGroup ? 'add' : 'update_permission',
        }

        try {
            await axioisInstance.patch(endpoint, body)
            notification.success({ message: successMessage })
        } catch (error) {
            notification.error({ message: errorMessage })
            console.error(error)
        }

        isGroup ? setSelectedGroups([]) : setSelectedPermissions([])
    }

    const handleRemoveItem = async (
        id: number,
        addedItems: any[],
        setAdded: (items: any[]) => void,
        endpoint: string,
        successMessage: string,
        errorMessage: string,
        bodyExtra: Record<string, any> = {},
    ) => {
        setAdded(addedItems.filter((item) => item.id !== id))

        const body = {
            ...bodyExtra,
            [endpoint.includes('group') ? 'group_id' : 'company_id']: id,
            action: 'remove',
        }

        try {
            await axioisInstance.patch(endpoint, body)
            notification.success({ message: successMessage })
        } catch (error) {
            notification.error({ message: errorMessage })
            console.error(error)
        }
    }

    // Select all handlers
    const handleSelectAll = (items: any[], setSelected: (ids: number[]) => void, e: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(e.target.checked ? items.map((item) => item.id) : [])
    }

    // Effect for store assignment
    useEffect(() => {
        setStoreAssign(addedGroups?.some((item) => item.name.includes('picker')))
    }, [addedGroups])

    // Form submission
    const handleSubmit = async (values: FormModel) => {
        const groupIds = addedGroups.map((item) => item.id)
        const permissionIds = addedPermissions.map((item) => item.id)
        const companyIds = addedCompany.map((item) => item.id)

        const bodyData = {
            ...values,
            action: 'add',
            company_id: companyIds.join(','),
            group_id: groupIds.join(','),
            permission_id: permissionIds.join(','),
        }

        navigate('/app/users')
        notification.success({
            message: 'User has been successfully updated',
        })
    }

    // Filtered data
    const filteredPermission = filterItems(getPermission, searchInput)
    const filteredGroup = filterItems(getGroups, groupSearchInput)
    const filteredCompany = filterItems(companyList, companySearchInput)

    return {
        // State
        userData,
        getPermission,
        selectedPermissions,
        addedPermissions,
        searchInput,
        getGroups,
        selectedGroups,
        addedGroups,
        groupSearchInput,
        companyList,
        selectedCompany,
        addedCompany,
        companySearchInput,
        loadingEdit,
        accessDenied,
        storeAssign,
        storePicker,
        filteredPermission,
        filteredGroup,
        filteredCompany,

        // Handlers
        handleSearch: {
            permission: handleSearch(setSearchInput),
            group: handleSearch(setGroupSearchInput),
            company: handleSearch(setCompanySearchInput),
        },
        handleSelect: {
            permission: (id: number) => handleSelect(id, selectedPermissions, setSelectedPermissions, true),
            group: (id: number) => handleSelect(id, selectedGroups, setSelectedGroups, false),
            company: (id: number) => handleSelect(id, selectedCompany, setSelectedCompany, false),
        },
        handleAdd: {
            permission: () =>
                handleAddItems(
                    selectedPermissions,
                    addedPermissions,
                    getPermission,
                    setAddedPermissions,
                    `/company/user/permission/${mobile}`,
                    'Permission Added',
                    'Failed to add Permission',
                ),
            group: () =>
                handleAddItems(
                    selectedGroups,
                    addedGroups,
                    getGroups,
                    setAddedGroups,
                    '/merchant/user/groups',
                    'Group Added',
                    'Failed to Add Group',
                    { mobile },
                    true,
                ),
            company: () =>
                handleAddItems(
                    selectedCompany,
                    addedCompany,
                    companyList,
                    setAddedCompany,
                    `/company/user/${mobile}`,
                    'Company Added',
                    'Failed to Add company',
                    {},
                    false,
                ),
        },
        handleRemove: {
            permission: (id: number) =>
                handleRemoveItem(
                    id,
                    addedPermissions,
                    setAddedPermissions,
                    `/company/user/permission/${mobile}`,
                    'Permission Removed',
                    'Failed to remove Permission',
                ),
            group: (id: number) =>
                handleRemoveItem(id, addedGroups, setAddedGroups, '/merchant/user/groups', 'Group Removed', 'Failed to remove Group', {
                    mobile,
                }),
            company: (id: number) =>
                handleRemoveItem(
                    id,
                    addedCompany,
                    setAddedCompany,
                    `/company/user/${mobile}`,
                    'Company Removed',
                    'Failed to remove company',
                ),
        },
        handleSelectAll: {
            permission: (e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll(filteredPermission || [], setSelectedPermissions, e),
            company: (e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll(filteredCompany || [], setSelectedCompany, e),
        },
        handleSubmit,
    }
}

export default useUserEdit
