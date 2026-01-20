/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

import { Field, Form, Formik } from 'formik'

import * as Yup from 'yup'
import type { FieldProps } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import { Card, notification } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { IoMdCloseCircle } from 'react-icons/io'
import { USERCOMMUNICATION, USERDETAILS } from './addUserCommon'
import { Spinner } from '@/components/ui'
import AccessDenied from '@/views/pages/AccessDenied'
import StoreAssignComponent from '../StoreAssignComponent'

interface GROUPS {
    id: number
    name: string
}

type FormModel = {
    first_name: string
    last_name: string
    mobile: string
    email: string
    business_email: string
    permission: permission[]
    groups: GROUPS[]
}

interface permission {
    id: number
    name: string
}

const AddUser = () => {
    const [getPermission, setGetPermission] = useState<permission[]>()
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
    const [getGroups, setGetGroups] = useState<GROUPS[]>([])
    const [selectedGroups, setSelectedGroups] = useState<number[]>([])
    const [selectedCompanyList, setSelectedCompanyList] = useState<number[]>([])
    const [selectedPermissionList, setSelectedPermissionList] = useState<any[]>([])
    const [addedPermissions, setAddedPermissions] = useState<{ id: number; name: string }[]>([])
    const [addedGroups, setAddedGroups] = useState<{ id: number; name: string }[]>([])
    const [addedCompanyList, setAddedCompanyList] = useState<{ id: number; name: string }[]>([])
    const [searchInput, setSearchInput] = useState('')
    const [addInput, setAddInput] = useState('')
    const [groupInput, setGroupInput] = useState('')
    const [addGroupInput, setAddGroupInput] = useState('')
    const [companyInput, setCompanyInput] = useState('')
    const [addcompanyInput, setAddCompanyInput] = useState('')
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const [showSpinner, setShowSpinner] = useState(false)
    const [accessDenied, setAccessDenied] = useState({ groups: false, permission: false, company: false })
    const [storeAssign, setStoreAssign] = useState(false)
    const [storePicker, setStorePicker] = useState<any>()
    const [mobileNumber, setMobileNumber] = useState('')
    const [triggerAfter, setTriggerAfter] = useState(false)

    console.log('trigger after is.....................', triggerAfter)

    const navigate = useNavigate()

    const fetchGroups = async () => {
        try {
            const response = await axioisInstance.get(`/groups`)
            const grp = response.data?.groups
            setGetGroups(grp)
            const group_id = getGroups?.map((item) => item.id)
            console.log('scscscscs', group_id)
        } catch (error: any) {
            if (error.response || error.response.status === 403) {
                setAccessDenied((prev) => ({
                    ...prev,
                    groups: true,
                }))
            }
            console.log(error)
        }
    }

    useEffect(() => {
        fetchGroups()
    }, [])

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`/permissions`)
            const perm = response.data?.permissions
            setGetPermission(perm)
        } catch (error: any) {
            if (error.response || error.response.status === 403) {
                setAccessDenied((prev) => ({
                    ...prev,
                    permission: true,
                }))
            }
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handlePermissionSelect = (id: number) => {
        setSelectedPermissions((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((permId) => permId !== id) : [...prevSelected, id],
        )
    }

    const handleGroupSelect = (id: number) => {
        setSelectedGroups((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((permId) => permId !== id) : [...prevSelected, id],
        )
    }

    const handleCompanySelect = (id: number) => {
        setSelectedCompanyList((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((permId) => permId !== id) : [...prevSelected, id],
        )
    }
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allCompanyIds = filteredComapny.map((item) => item.id)
            setSelectedCompanyList(allCompanyIds)
        } else {
            setSelectedCompanyList([])
        }
    }
    const handleSelectAllPermissions = (e) => {
        if (e.target.checked) {
            const allPermissons = filteredPermission?.map((item) => item.id) || []
            setSelectedPermissions(allPermissons)
        } else {
            setSelectedPermissions([])
        }
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

    const handleAddCompany = () => {
        const alreadyAdded = selectedCompanyList.filter((permId) => addedCompanyList.some((added) => added.id === permId))

        if (alreadyAdded.length > 0) {
            notification.warning({
                message: 'Warning',
                description: 'Company already added',
            })
        }
        const selected = companyList?.filter(
            (perm) => selectedCompanyList.includes(perm?.id) && !addedCompanyList.some((added) => added.id === perm.id),
        )

        setAddedCompanyList((prevAdded) => [...prevAdded, ...selected])
        setSelectedGroups([])
    }

    const handleAddGroups = () => {
        console.log('1st step of groups')
        const alreadyAdded = selectedGroups.filter((permId) => addedGroups.some((added) => added.id === permId))

        if (alreadyAdded.length > 0) {
            notification.warning({
                message: 'Warning',
                description: 'Permission already added',
            })
        }
        const selected = getGroups?.filter((perm) => selectedGroups.includes(perm.id) && !addedGroups.some((added) => added.id === perm.id))

        setAddedGroups((prevAdded) => [...prevAdded, ...selected])
        setSelectedGroups([])
    }

    console.log('Groups data  is', addedGroups?.map((item) => item.name.includes('picker')).includes(true))

    useEffect(() => {
        if (addedGroups?.map((item) => ['picker', 'rider'].includes(item.name))?.includes(true)) {
            setStoreAssign(true)
        } else {
            setStoreAssign(false)
        }
    }, [addedGroups])

    console.log('if store assign', storeAssign)

    const handleRemovePermissions = (id: number) => {
        setAddedPermissions((prevAdded) => prevAdded.filter((perm) => perm.id !== id))
    }

    const handleRemoveGroups = (id: number) => {
        setAddedGroups((prevAdded) => prevAdded.filter((perm) => perm.id !== id))
    }

    const handleRemoveCompany = (id: number) => {
        setAddedCompanyList((prevAdded) => prevAdded.filter((perm) => perm.id !== id))
    }

    const hanldePicker = async (selectedOptions: any[] = []) => {
        const body = {
            mobile: mobileNumber,
            store: storePicker?.join(','),
        }

        try {
            const response = await axioisInstance.post(`/merchant/store/user`, body)
            notification.success({
                message: response?.data?.data?.message || 'Store(s) Assigned Successfully',
            })
            return true
        } catch (error) {
            notification.info({ message: 'NOTE:Store for a particular user has not been assigned' })
            console.error(error)
            return false
        }
    }

    const handleSubmit = async (values: any) => {
        const groupIds = addedGroups.map((item) => item.id)
        const permissionIds = addedPermissions.map((item) => item.id)
        const company_ids = addedCompanyList.map((item) => item.id)
        const bodyData = {
            ...values,
            mobile: mobileNumber,
            company_ids: `${company_ids.join(',')}`,
            group_id: `${groupIds.join(',')}`,
            permission_id: `${permissionIds.join(',')}`,
        }

        try {
            setShowSpinner(true)
            const response = await axioisInstance.post(`company/users/add`, bodyData)
            if (storePicker?.length > 0) {
                notification.info({ message: 'Assigning user to store' })
                const storeAssignmentSuccess = await hanldePicker()
                if (!storeAssignmentSuccess) {
                    notification.warning({ message: 'User created but store assignment failed' })
                }
            }

            notification.success({ message: response?.data?.message || 'User added successfully' })
            setTimeout(() => {
                navigate(-1)
            }, 1000)
        } catch (error: any) {
            notification.error({ message: error?.response?.data?.message || 'User not created' })
        } finally {
            setShowSpinner(false)
        }
    }

    const initialValue: FormModel = {
        first_name: '',
        last_name: '',
        mobile: '',
        email: '',
        business_email: '',
        permission: [],
        groups: [],
    }

    const filteredPermission = getPermission?.filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()))

    const filteredGroups = getGroups?.filter((item) => item.name.toLowerCase().includes(groupInput.toLowerCase()))
    const filteredComapny = companyList?.filter((item) => item?.name?.toLowerCase().includes(companyInput.toLowerCase()))

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
    }

    const handleGroupSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupInput(e.target.value)
    }
    const handleCompanySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompanyInput(e.target.value)
    }

    const filteredAddPermission = addedPermissions?.filter((item) => item.name.toLowerCase().includes(addInput.toLowerCase()))
    const filteredAddGroup = addedGroups?.filter((item) => item.name.toLowerCase().includes(addGroupInput.toLowerCase()))

    const filteredAddCompany = addedCompanyList?.filter((item) => item.name.toLowerCase().includes(addcompanyInput.toLowerCase()))

    const handleAddPerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddInput(e.target.value)
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, touched, errors, resetForm }) => (
                    <Form className="w-full  shadow-xl rounded-xl p-6 transition-all duration-200 hover:shadow-2xl">
                        <div className="text-2xl font-bold text-gray-800 mb-8 pb-2 border-b border-gray-200">ADD USER</div>
                        <FormContainer>
                            <FormContainer className="shadow-xl p-3 border-l-4 border-blue-400 rounded-lg">
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
                                    <FormContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {USERDETAILS.map((item, index) => (
                                            <FormItem key={index} label={item.label} className="col-span-1">
                                                <Field
                                                    type={item.type}
                                                    name={item.name}
                                                    component={Input}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                    onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                                />
                                            </FormItem>
                                        ))}
                                    </FormContainer>
                                    <div className="mb-8">
                                        <FormContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {USERCOMMUNICATION.map((item, index) => (
                                                <FormItem key={index} label={item.label} className="col-span-1">
                                                    <Field
                                                        type={item.type}
                                                        name={item.name}
                                                        component={Input}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                        onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                                    />
                                                </FormItem>
                                            ))}
                                            <FormItem label="Mobile" className="col-span-1">
                                                <input
                                                    type="text"
                                                    name="mobile"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                    onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                                    onChange={(e: any) => setMobileNumber(e.target.value)}
                                                />
                                            </FormItem>
                                            <StoreAssignComponent
                                                isAfter
                                                customClass="mt-0 w-full"
                                                storePicker={storePicker as any}
                                                setStorePicker={setStorePicker as any}
                                                mobile={mobileNumber}
                                                profile={[]}
                                            />
                                        </FormContainer>
                                    </div>
                                </div>
                            </FormContainer>

                            <div className="mb-10 shadow-xl p-3 border-l-4 border-yellow-400 rounded-lg mt-4">
                                <div className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Assign Company</div>

                                <FormContainer className="mb-7">
                                    <FormContainer className="flex flex-col lg:flex-row justify-between gap-6">
                                        {/* All Companies */}
                                        <Card className="h-[360px] w-full lg:w-[400px] flex flex-col border border-gray-200 rounded-xl overflow-y-scroll shadow-sm">
                                            <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200">
                                                <div className="mb-3">
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                        placeholder="Search Company"
                                                        value={companyInput}
                                                        onChange={handleCompanySearch}
                                                        onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                                    />
                                                </div>
                                                <label htmlFor="All Groups" className="font-bold text-gray-700">
                                                    All Companies
                                                </label>
                                            </div>

                                            <div className="p-4 ">
                                                <div className="flex gap-2 items-center mb-3 p-2 bg-gray-50 rounded-lg">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCompanyList.length === filteredComapny.length}
                                                        onChange={handleSelectAll}
                                                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="font-medium text-gray-700">Select All</span>
                                                </div>

                                                <div className="space-y-2">
                                                    {filteredComapny?.map((item) => (
                                                        <div key={item.id} className="flex flex-col">
                                                            <label className="px-3 py-2 flex items-center hover:bg-gray-50 rounded-lg transition-colors">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedCompanyList.includes(item?.id)}
                                                                    onChange={() => handleCompanySelect(item.id)}
                                                                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                                                />
                                                                <span className="ml-3 text-gray-700">{item.name}</span>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Buttons */}
                                        <div className="flex lg:flex-col justify-center items-center gap-4 my-4 lg:my-0">
                                            <Button
                                                type="button"
                                                variant="accept"
                                                className="w-full lg:w-32 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
                                                onClick={handleAddCompany}
                                            >
                                                ADD {'>>'}
                                            </Button>
                                        </div>

                                        {/* Added Companies */}
                                        <Card className="h-[360px] w-full lg:w-[400px] flex flex-col border border-gray-200 rounded-xl overflow-y-scroll shadow-sm">
                                            <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200">
                                                <label htmlFor="Added Permissions" className="font-bold text-gray-700">
                                                    Added Company
                                                </label>
                                            </div>
                                            <div className="p-4 overflow-y-auto space-y-2">
                                                {filteredAddCompany?.map((item) => (
                                                    <div key={item.id} className="flex flex-col">
                                                        <div className="px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                                            <span className="text-gray-700">{item.name}</span>
                                                            <button
                                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                                onClick={() => handleRemoveCompany(item.id)}
                                                            >
                                                                <IoMdCloseCircle className="text-xl" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    </FormContainer>
                                </FormContainer>
                            </div>

                            {/* User Groups Section */}
                            <div className="mb-10 shadow-xl p-3 border-l-4 border-green-400 rounded-lg mt-4">
                                <div className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">USER GROUPS</div>

                                {accessDenied?.groups ? (
                                    <AccessDenied particularName="User Groups" />
                                ) : (
                                    <FormContainer className="mb-7">
                                        <FormContainer className="flex flex-col lg:flex-row justify-between gap-6">
                                            {/* All Groups */}
                                            <Card className="h-[360px] w-full lg:w-[400px] flex flex-col border border-gray-200 rounded-xl overflow-y-scroll shadow-sm">
                                                <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200">
                                                    <div className="mb-3">
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                            placeholder="Search Groups"
                                                            value={groupInput}
                                                            onChange={handleGroupSearch}
                                                            onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                                        />
                                                    </div>
                                                    <label htmlFor="All Groups" className="font-bold text-gray-700">
                                                        User Groups
                                                    </label>
                                                </div>
                                                <div className="p-4 overflow-y-auto space-y-2">
                                                    {filteredGroups?.map((item) => (
                                                        <div key={item.id} className="flex flex-col">
                                                            <label className="px-3 py-2 flex items-center hover:bg-gray-50 rounded-lg transition-colors">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedGroups.includes(item.id)}
                                                                    onChange={() => handleGroupSelect(item.id)}
                                                                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                                                />
                                                                <span className="ml-3 text-gray-700">{item.name}</span>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Card>

                                            {/* Buttons */}
                                            <div className="flex lg:flex-col justify-center items-center gap-4 my-4 lg:my-0">
                                                <Button
                                                    type="button"
                                                    variant="accept"
                                                    className="w-full lg:w-32 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
                                                    onClick={handleAddGroups}
                                                >
                                                    ADD {'>>'}
                                                </Button>
                                            </div>

                                            {/* Added Groups */}
                                            <Card className="h-[360px] w-full lg:w-[400px] flex flex-col border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                                <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200">
                                                    <label htmlFor="Added Permissions" className="font-bold text-gray-700">
                                                        Added Groups
                                                    </label>
                                                </div>
                                                <div className="p-4 overflow-y-auto space-y-2">
                                                    {filteredAddGroup?.map((item) => (
                                                        <div key={item.id} className="flex flex-col">
                                                            <div className="px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                                                <span className="text-gray-700">{item.name}</span>
                                                                <button
                                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                                    onClick={() => handleRemoveGroups(item.id)}
                                                                >
                                                                    <IoMdCloseCircle className="text-xl" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Card>
                                        </FormContainer>
                                    </FormContainer>
                                )}
                            </div>

                            {/* User Permissions Section */}
                            <div className="mb-10 shadow-xl p-3 border-l-4 border-purple-400 rounded-lg mt-4">
                                <div className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                                    USER PERMISSIONS
                                </div>

                                {accessDenied?.permission ? (
                                    <AccessDenied particularName="User Permissions" />
                                ) : (
                                    <div>
                                        <div className="flex gap-2 items-center mb-5 p-2 bg-gray-50 rounded-lg w-fit">
                                            <input
                                                type="checkbox"
                                                checked={selectedPermissions.length === filteredPermission?.length}
                                                onChange={handleSelectAllPermissions}
                                                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <span className="font-medium text-gray-700">Select All</span>
                                        </div>

                                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                                            {/* All Permissions */}
                                            <Card className="h-[360px] w-full lg:w-[400px] flex flex-col border border-gray-200 rounded-xl overflow-y-scroll shadow-sm">
                                                <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200">
                                                    <div className="mb-3">
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                            placeholder="Search Permissions"
                                                            value={searchInput}
                                                            onChange={handleSearch}
                                                            onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                                        />
                                                    </div>
                                                    <label htmlFor="All Permissions" className="font-bold text-gray-700">
                                                        All Permissions
                                                    </label>
                                                </div>
                                                <div className="p-4 overflow-y-auto space-y-2">
                                                    {filteredPermission?.map((item) => (
                                                        <div key={item.id} className="flex flex-col">
                                                            <label className="px-3 py-2 flex items-center hover:bg-gray-50 rounded-lg transition-colors">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedPermissions.includes(item.id)}
                                                                    onChange={() => handlePermissionSelect(item.id)}
                                                                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                                                />
                                                                <span className="ml-3 text-gray-700">{item.name}</span>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Card>

                                            {/* Buttons */}
                                            <div className="flex lg:flex-col justify-center items-center gap-4 my-4 lg:my-0">
                                                <Button
                                                    type="button"
                                                    variant="accept"
                                                    className="w-full lg:w-32 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
                                                    onClick={handleAddPermissions}
                                                >
                                                    ADD {'>>'}
                                                </Button>
                                            </div>

                                            {/* Added Permissions */}
                                            <Card className="h-[360px] w-full lg:w-[400px] flex flex-col border border-gray-200 rounded-xl overflow-y-scroll shadow-sm">
                                                <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200">
                                                    <div className="mb-3">
                                                        <input
                                                            type="text"
                                                            value={addInput}
                                                            onChange={handleAddPerm}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                                            placeholder="Search Permissions"
                                                        />
                                                    </div>
                                                    <label htmlFor="Added Permissions" className="font-bold text-gray-700">
                                                        Added Permissions
                                                    </label>
                                                </div>
                                                <div className="p-4 overflow-y-auto space-y-2">
                                                    {filteredAddPermission.map((item) => (
                                                        <div key={item.id} className="flex flex-col">
                                                            <div className="px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                                                <span className="text-gray-700">{item.name}</span>
                                                                <button
                                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                                    onClick={() => handleRemovePermissions(item.id)}
                                                                >
                                                                    <IoMdCloseCircle className="text-xl" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Form Actions */}
                        </FormContainer>
                        <FormItem className="flex gap-4">
                            <Button
                                variant="new"
                                type="submit"
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
                            >
                                <span className="flex gap-2 items-center justify-center">
                                    {showSpinner && (
                                        <div className="flex items-center justify-center">
                                            <Spinner size={20} />
                                        </div>
                                    )}
                                    Submit
                                </span>
                            </Button>
                        </FormItem>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddUser
