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
    const [storePicker, setStorePicker] = useState('')
    const [mobileNumber, setMobileNumber] = useState('')

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
        if (addedGroups?.map((item) => item.name.includes('picker')).includes(true)) {
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
        console.log('body', bodyData)
        try {
            setShowSpinner(true)
            const response = await axioisInstance.post(`company/users/add`, bodyData)
            console.log('response of add users', response)

            navigate('/app/users')
        } catch (error: any) {
            notification.error({ message: error?.response?.data?.message || 'Failed to add' })
            console.log(error)
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
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm }) => (
                    <Form className="w-full shadow-lg rounded-lg p-3">
                        <div className="text-xl mb-10 font-semibold">ADD USER </div>
                        <FormContainer>
                            <FormContainer className="flex flex-row gap-7 ">
                                {USERDETAILS.map((item, index) => (
                                    <FormItem key={index} label={item.label} className="col-span-1 w-1/2">
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            component={Input}
                                            onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                        />
                                    </FormItem>
                                ))}
                            </FormContainer>
                            {/* Mobile email work email */}

                            <FormContainer className="flex flex-row gap-7 ">
                                {USERCOMMUNICATION.map((item, index) => (
                                    <FormItem key={index} label={item.label} className="col-span-1 w-1/2">
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            component={Input}
                                            onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                        />
                                    </FormItem>
                                ))}
                                <FormItem label="Mobile">
                                    <input
                                        type="text"
                                        name="mobile"
                                        onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                        onChange={(e: any) => setMobileNumber(e.target.value)}
                                    />
                                </FormItem>
                            </FormContainer>
                            {/* ........................................................................................ */}

                            <div className="text-xl font-semibold mt-4">COMPANYS</div>
                            <br />

                            <FormContainer className="mb-7">
                                <FormContainer className="flex justify-between">
                                    {/* All Permissions */}
                                    <Card className="overflow-y-scroll h-[360px] w-[400px] flex flex-col">
                                        <div className="sticky top-0 z-10 bg-white">
                                            <div className="mb-3 bg-white">
                                                <input
                                                    type="text"
                                                    className="border border-gray-200 w-[90%] h-8 items-center p-2 rounded-md active:border-0 hover:border-blue-500 active:border-blue-500"
                                                    placeholder="Search Comapny"
                                                    value={companyInput}
                                                    onChange={handleCompanySearch}
                                                    onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                                />
                                            </div>
                                            <label htmlFor="All Groups" className="font-bold bg-white">
                                                All Companys
                                            </label>
                                        </div>

                                        <div className="">
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCompanyList.length === filteredComapny.length}
                                                    onChange={handleSelectAll}
                                                />{' '}
                                                <span className="font-bold">Select All</span>
                                            </div>

                                            {filteredComapny?.map((item) => (
                                                <div key={item.id} className="flex flex-col">
                                                    <label className="bg-gray-100 px-2 py-2 flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCompanyList.includes(item?.id)}
                                                            onChange={() => handleCompanySelect(item.id)}
                                                        />
                                                        <span className="ml-2">{item.name}</span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>

                                    {/* Buttons */}
                                    <div className="flex justify-center items-center flex-col gap-4">
                                        <Button type="button" variant="accept" className="w-32 px-8" onClick={handleAddCompany}>
                                            ADD {'>>'}
                                        </Button>
                                    </div>

                                    {/* Added Permissions */}
                                    <Card className="overflow-y-scroll h-[360px] w-[400px] flex flex-col">
                                        <div className="sticky top-0 z-10 bg-white">
                                            <label htmlFor="Added Permissions" className="font-bold bg-white">
                                                Added Company
                                            </label>
                                        </div>
                                        <div className="">
                                            {filteredAddCompany?.map((item) => (
                                                <div key={item.id} className="flex flex-col">
                                                    <div className="bg-gray-100 px-2 py-2 flex items-center justify-between">
                                                        <span>{item.name}</span>
                                                        <button className="text-red-500 ml-2" onClick={() => handleRemoveCompany(item.id)}>
                                                            <IoMdCloseCircle className="text-red-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </FormContainer>
                            </FormContainer>

                            {/* .................................................................... */}

                            <div className="text-xl font-semibold mt-4">USER GROUPS</div>
                            <br />
                            {accessDenied?.groups ? (
                                <>
                                    <AccessDenied particularName="User Groups" />
                                </>
                            ) : (
                                <FormContainer className="mb-7">
                                    <FormContainer className="flex justify-between">
                                        {/* All Permissions */}
                                        <Card className="overflow-y-scroll h-[360px] w-[400px] flex flex-col">
                                            <div className="sticky top-0 z-10 bg-white">
                                                <div className="mb-3 bg-white">
                                                    <input
                                                        type="text"
                                                        className="border border-gray-200 w-[90%] h-8 items-center p-2 rounded-md active:border-0 hover:border-blue-500 active:border-blue-500"
                                                        placeholder="Search Groups"
                                                        value={groupInput}
                                                        onChange={handleGroupSearch}
                                                        onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                                    />
                                                </div>
                                                <label htmlFor="All Groups" className="font-bold bg-white">
                                                    User Groups
                                                </label>
                                            </div>
                                            <div className="">
                                                {filteredGroups?.map((item) => (
                                                    <div key={item.id} className="flex flex-col">
                                                        <label className="bg-gray-100 px-2 py-2 flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedGroups.includes(item.id)}
                                                                onChange={() => handleGroupSelect(item.id)}
                                                            />
                                                            <span className="ml-2">{item.name}</span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>

                                        {/* Buttons */}
                                        <div className="flex justify-center items-center flex-col gap-4">
                                            <Button type="button" variant="accept" className="w-32 px-8" onClick={handleAddGroups}>
                                                ADD {'>>'}
                                            </Button>
                                        </div>

                                        {/* Added Permissions */}
                                        <Card className="overflow-y-scroll h-[360px] w-[400px] flex flex-col">
                                            <div className="sticky top-0 z-10 bg-white">
                                                <label htmlFor="Added Permissions" className="font-bold bg-white">
                                                    Added Groups
                                                </label>
                                            </div>
                                            <div className="">
                                                {filteredAddGroup?.map((item) => (
                                                    <div key={item.id} className="flex flex-col">
                                                        <div className="bg-gray-100 px-2 py-2 flex items-center justify-between">
                                                            <span>{item.name}</span>
                                                            <button
                                                                className="text-red-500 ml-2"
                                                                onClick={() => handleRemoveGroups(item.id)}
                                                            >
                                                                <IoMdCloseCircle className="text-red-400" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    </FormContainer>
                                </FormContainer>
                            )}

                            {storeAssign && (
                                <StoreAssignComponent storePicker={storePicker} setStorePicker={setStorePicker} mobile={mobileNumber} />
                            )}

                            {/* ............................................................................................ */}

                            <div className="text-xl font-semibold">USER PERMISSIONS</div>
                            <br />
                            {accessDenied?.permission ? (
                                <>
                                    <AccessDenied particularName="User Permissions" />
                                </>
                            ) : (
                                <div className="">
                                    <div className="flex gap-2 items-center mb-5">
                                        <input
                                            type="checkbox"
                                            checked={selectedPermissions.length === filteredPermission?.length}
                                            onChange={handleSelectAllPermissions}
                                        />{' '}
                                        <span className="font-bold">Select All</span>
                                    </div>
                                    <div className="flex justify-between">
                                        {/* All Permissions */}
                                        <Card className="overflow-y-scroll h-[560px] w-[400px] flex flex-col">
                                            <div className="sticky top-0 z-10 bg-white">
                                                <div className="mb-3 bg-white">
                                                    <input
                                                        type="text"
                                                        className="border border-gray-200 w-[90%] h-8 items-center p-2 rounded-md active:border-0 hover:border-blue-500 active:border-blue-500"
                                                        placeholder="Search Permissions"
                                                        value={searchInput}
                                                        onChange={handleSearch}
                                                        onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
                                                    />
                                                </div>
                                                <label htmlFor="All Permissions" className="font-bold bg-white">
                                                    All Permissions
                                                </label>
                                            </div>
                                            <div className="">
                                                {filteredPermission?.map((item) => (
                                                    <div key={item.id} className="flex flex-col">
                                                        <label className="bg-gray-100 px-2 py-2 flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedPermissions.includes(item.id)}
                                                                onChange={() => handlePermissionSelect(item.id)}
                                                            />
                                                            <span className="ml-2">{item.name}</span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>

                                        {/* Buttons */}
                                        <div className="flex justify-center items-center flex-col gap-4">
                                            <Button type="button" variant="accept" className="w-32 px-8" onClick={handleAddPermissions}>
                                                ADD {'>>'}
                                            </Button>
                                        </div>

                                        {/* Added Permissions */}
                                        <Card className="overflow-y-scroll h-[560px] w-[400px] flex flex-col">
                                            <div className="sticky top-0 z-10 bg-white">
                                                <div className="mb-3 bg-white">
                                                    <input
                                                        type="text"
                                                        value={addInput}
                                                        onChange={handleAddPerm}
                                                        className="border border-gray-200 w-[90%] h-8 items-center p-2 rounded-md active:border-0 hover:border-blue-500 active:border-blue-500"
                                                        placeholder="Search Permissions"
                                                    />
                                                </div>
                                                <label htmlFor="Added Permissions" className="font-bold bg-white">
                                                    Added Permissions
                                                </label>
                                            </div>
                                            <div className="">
                                                {filteredAddPermission.map((item) => (
                                                    <div key={item.id} className="flex flex-col">
                                                        <div className="bg-gray-100 px-2 py-2 flex items-center justify-between">
                                                            <span>{item.name}</span>
                                                            <button
                                                                className="text-red-500 ml-2"
                                                                onClick={() => handleRemovePermissions(item.id)}
                                                            >
                                                                <IoMdCloseCircle className="text-red-400" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            <FormItem className="mt-10 ">
                                <Button type="reset" className="ltr:mr-2 rtl:ml-2" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="new" type="submit">
                                    <span className="flex gap-4 items-center justify-center">
                                        {showSpinner && (
                                            <div className="flex items-center justify-center ">
                                                <Spinner size={20} />
                                            </div>
                                        )}{' '}
                                        Submit
                                    </span>
                                </Button>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
            {/* 
                {
                   storeAssign  && 
                } */}
        </div>
    )
}

export default AddUser
