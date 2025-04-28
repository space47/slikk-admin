/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, Form, Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import { Card, notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { USER_EDIT_FROM } from './UserEditForm'
import CardComponent from './cardComponents/CardComponent'
import { Spinner } from '@/components/ui'
import AccessDenied from '@/views/pages/AccessDenied'
import StoreAssignComponent from '../StoreAssignComponent'

type FormModel = {
    first_name: string
    last_name: string
    mobile: string
    email: string
    business_email: string
    permissions: []
    company: []
}

interface permission {
    id: number
    name: string
}

interface Groups {
    id: number
    name: string
}

const BrandUserEdit = () => {
    const [userData, setUserData] = useState<FormModel>()
    const [getPermission, setGetPermission] = useState<permission[]>()
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
    const [addedPermissions, setAddedPermissions] = useState<permission[]>([])
    const [searchInput, setSearchInput] = useState('')
    // for Groups.............
    const [getGroups, setGetGroups] = useState<any[]>([])
    const [selectedGroups, setSelectedGroups] = useState<number[]>([])
    const [addedGroups, setAddedGroups] = useState<Groups[]>([])
    const [groupSearchInput, setGroupSearchInput] = useState('')
    // for company
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const [selectedCompany, setSelectedCompany] = useState<number[]>([])
    const [addedCompany, setAddedCompany] = useState<{ id: number; name: string }[]>([])
    const [companySearchInput, setCompanySearchInput] = useState('')
    const [loadingEdit, setLoadingEdit] = useState(false)
    const [accessDenied, setAccessDenied] = useState({
        groups: false,
        permission: false,
        company: false,
    })
    const [storeAssign, setStoreAssign] = useState(false)
    const [storePicker, setStorePicker] = useState<string | number | undefined>('')
    const { mobile } = useParams()

    const navigate = useNavigate()

    const currentCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)

    // For Search Input.....
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
    }
    const handleGroupSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupSearchInput(e.target.value)
    }
    const handleCompanySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCompanySearchInput(e.target.value)
    }

    //Filtered Search INputs
    const filteredPermission = getPermission?.filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()))
    const filteredGroup = getGroups?.filter((item) => item?.name.toLowerCase().includes(groupSearchInput.toLowerCase()))
    const filteredCompany = companyList?.filter((item) => item.name.toLowerCase().includes(companySearchInput.toLowerCase()))

    // Get API CAlls to get Initial value
    const fetchUserData = async () => {
        try {
            setLoadingEdit(true)
            const response = await axioisInstance.get(`/company/${currentCompany.id}/users?mobile=${mobile}`)
            const usersInfo = response.data.data

            setUserData(usersInfo)
            // Map through the user's companies to get their name and id
            setAddedCompany(
                usersInfo?.company?.map((item) => ({
                    id: item.id,
                    name: item.name,
                })),
            )
            setLoadingEdit(false)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied((prev) => ({
                    ...prev,
                    company: true,
                }))
            }
            console.log(error)
            setLoadingEdit(false)
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [currentCompany])

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`/permissions`) // For left side Card
            const perm = response.data?.permissions
            setGetPermission(perm)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied((prev) => ({
                    ...prev,
                    permission: true,
                }))
            }
            console.log(error)
        }
    }

    const fetchGroups = async () => {
        try {
            const response = await axioisInstance.get(`/groups`)
            const grp = response.data?.groups
            setGetGroups(grp)
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied((prev) => ({
                    ...prev,
                    groups: true,
                }))
            }
            console.log(error)
        }
    }

    const fetchDataRightPermission = async () => {
        try {
            const response = await axioisInstance.get(`company/user/permission/${mobile}`)

            const user = response.data
            const userPermissions = response.data.user_permissions
            setAddedPermissions(userPermissions) // For right side card
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied((prev) => ({
                    ...prev,
                    permission: true,
                }))
            }
            console.log(error)
        }
    }

    const fetchDataRightGroup = async () => {
        try {
            const response = await axioisInstance.get(`company/user/group/${mobile}`)

            const user = response.data
            const userPermissions = response.data.user_groups
            setAddedGroups(userPermissions) // For right side card
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                setAccessDenied((prev) => ({
                    ...prev,
                    groups: true,
                }))
            }
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
        fetchDataRightPermission()
        fetchGroups()
        fetchDataRightGroup()
    }, [])

    // permissions.................................................................
    const handlePermissionSelect = (id: number) => {
        setSelectedPermissions((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((permId) => permId !== id) : [...prevSelected, id],
        )
    }
    const handleAddPermissions = async () => {
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

        console.log('Permission Data', selected)

        setAddedPermissions((prevAdded) => [...prevAdded, ...selected])
        setSelectedPermissions([])
    }

    const handlePermissionEdit = async () => {
        const body = {
            action: 'update_permission',
            permission_id: addedPermissions.map((item) => item.id).join(','),
        }

        try {
            const response = await axioisInstance.patch(`/company/user/permission/${mobile}`, body)
            notification.success({
                message: 'Permission Added',
            })
        } catch (error) {
            notification.error({
                message: 'Failed to add Permission',
            })
            console.log(error)
        }
    }

    const handleRemovePermissions = (id: number) => {
        setAddedPermissions((prevAdded) => prevAdded.filter((perm) => perm.id !== id))
    }
    // Groups..................................................................
    // Id store karne ke liye maine iha changes kia...........
    const handleGroupSelect = (id: number) => {
        setSelectedGroups((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((permId) => permId !== id) : [id]))
    }

    console.log('GroupSelect Id', selectedGroups)
    const handleAddGroup = async () => {
        const alreadyAdded = selectedGroups.filter((permId) => addedGroups.some((added) => added.id === permId))

        if (alreadyAdded.length > 0) {
            notification.warning({
                message: 'Warning',
                description: 'Permission already added',
            })
        }

        const selected = getGroups?.filter((perm) => selectedGroups.includes(perm.id) && !addedGroups.some((added) => added.id === perm.id))

        setAddedGroups((prevAdded) => [...prevAdded, ...selected])

        const body = {
            mobile: mobile,
            group_id: selectedGroups.join(','),
            action: 'add',
        }
        try {
            const response = await axioisInstance.patch(`/merchant/user/groups`, body)
            notification.success({
                message: 'Group Added',
            })
        } catch (error) {
            notification.error({
                message: 'Failed to Add Group',
            })
            console.log(error)
        }
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

    const handleRemoveGroups = async (id: number) => {
        setAddedGroups((prevAdded) => prevAdded.filter((perm) => perm.id !== id))

        const body = {
            mobile: mobile,
            group_id: id,
            action: 'remove',
        }
        try {
            const response = await axioisInstance.patch(`/merchant/user/groups`, body)
            notification.success({
                message: 'Group Removed',
            })
        } catch (error) {
            notification.error({
                message: 'Failed to remove Group',
            })
            console.log(error)
        }
    }

    // comapny................................................................
    // Id store karne ke liye maine iha changes kia...........
    const handleCompanySelect = (id: number) => {
        setSelectedCompany((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((permId) => permId !== id) : [id]))
    }
    const handleAddCompany = async () => {
        const alreadyAdded = selectedCompany.filter((permId) => addedCompany.some((added) => added.id === permId))

        if (alreadyAdded.length > 0) {
            notification.warning({
                message: 'Warning',
                description: 'Company already added',
            })
        }

        const selected = companyList?.filter(
            (perm) => selectedCompany.includes(perm.id) && !addedCompany.some((added) => added.id === perm.id),
        )

        setAddedCompany((prevAdded) => [...prevAdded, ...selected])

        const body = {
            company_id: selectedCompany.join(','),
            action: 'add',
        }
        try {
            const response = await axioisInstance.patch(`/company/user/${mobile}`, body)
            notification.success({
                message: 'Company Added',
            })
        } catch (error) {
            notification.error({
                message: 'Failed to Add company',
            })
            console.log(error)
        }

        setSelectedCompany([])
    }

    const handleRemoveCompany = async (id: number) => {
        setAddedCompany((prevAdded) => prevAdded.filter((perm) => perm.id !== id))

        const body = {
            company_id: id,
            action: 'remove',
        }
        try {
            const response = await axioisInstance.patch(`/company/user/${mobile}`, body)
            notification.success({
                message: 'Company Removed',
            })
        } catch (error) {
            notification.error({
                message: 'Failed to remove company',
            })
            console.log(error)
        }
    }

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allCompanyIds = companyList.map((item) => item.id)
            setSelectedCompany(allCompanyIds)
        } else {
            setSelectedCompany([])
        }
    }

    const initialValue: FormModel = {
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
        mobile: userData?.mobile || '',
        email: userData?.email || '',
        business_email: userData?.business_email || '',
        permissions: [],
        company: [],
    }

    const handleSubmit = async (values: any) => {
        const groupIds = addedGroups.map((item) => item.id)
        const permissionIds = addedPermissions.map((item) => item.id)
        const company_ids = addedCompany ? addedCompany.map((item) => item.id) : []
        const bodyData = {
            ...values,
            action: 'add',
            company_id: `${company_ids.join(',')}`,
            group_id: `${groupIds.join(',')}`,
            permission_id: `${permissionIds.join(',')}`,
        }
        navigate(`/app/users`)
        notification.success({
            message: 'User has been successfully updated',
        })
    }

    const handleSelectAllCompany = (e) => {
        if (e.target.checked) {
            const allCompany = filteredCompany?.map((item) => item.id) || []
            setSelectedCompany(allCompany)
        } else {
            setSelectedCompany([])
        }
    }
    const handleSelectAllPermission = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allPermissons = filteredPermission?.map((item) => item.id) || []
            setSelectedPermissions(allPermissons)
        } else {
            setSelectedPermissions([])
        }
    }

    // if (accessDenied) {
    //     return <AccessDenied />
    // }

    return (
        <div>
            {loadingEdit ? (
                <>
                    <Spinner size={40} className="items-center flex justify-center h-screen" />
                </>
            ) : (
                <Formik
                    enableReinitialize
                    initialValues={initialValue}
                    // validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, touched, errors, resetForm }) => (
                        <Form className="w-full shadow-lg rounded-lg p-3" onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}>
                            <div className="text-xl mb-10 font-bold">EDIT USER DETAILS</div>
                            <FormContainer>
                                {/* Form Fields */}
                                <FormContainer className="grid grid-cols-2 gap-8">
                                    {USER_EDIT_FROM.map((item, key) => (
                                        <FormItem key={key} label={item.label} className={item.className}>
                                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                        </FormItem>
                                    ))}
                                </FormContainer>

                                <div className="text-xl font-bold">USER PERMISSIONS</div>
                                <br />

                                {accessDenied?.company ? (
                                    <>
                                        <AccessDenied particularName="Comapany Details" />
                                    </>
                                ) : (
                                    <FormContainer className="">
                                        <CardComponent
                                            isSelectAll
                                            label="Company"
                                            selectedValue={selectedCompany}
                                            getValue={filteredCompany}
                                            handleSelect={handleCompanySelect}
                                            addedValue={addedCompany}
                                            handleAdd={handleAddCompany}
                                            handleRemove={handleRemoveCompany}
                                            handleSelectAll={handleSelectAll}
                                            searchInput={companySearchInput}
                                            handleSearch={handleCompanySearch}
                                            handleSelectAllData={handleSelectAllCompany}
                                        />
                                    </FormContainer>
                                )}
                                <br />

                                {accessDenied?.groups ? (
                                    <>
                                        <AccessDenied particularName="User Groups" />
                                    </>
                                ) : (
                                    <FormContainer className="">
                                        <CardComponent
                                            label="Groups"
                                            selectedValue={selectedGroups}
                                            getValue={filteredGroup}
                                            handleSelect={handleGroupSelect}
                                            addedValue={addedGroups}
                                            handleAdd={handleAddGroup}
                                            handleRemove={handleRemoveGroups}
                                            searchInput={groupSearchInput}
                                            handleSearch={handleGroupSearch}
                                        />
                                    </FormContainer>
                                )}

                                {storeAssign && (
                                    <StoreAssignComponent storePicker={storePicker} setStorePicker={setStorePicker} mobile={mobile} />
                                )}
                                <br />

                                {accessDenied?.permission ? (
                                    <>
                                        <AccessDenied particularName="User Permissions" />
                                    </>
                                ) : (
                                    <FormContainer className="">
                                        <CardComponent
                                            isSelectAll
                                            forPermission
                                            label="Permissions"
                                            selectedValue={selectedPermissions}
                                            getValue={filteredPermission}
                                            handleSelect={handlePermissionSelect}
                                            addedValue={addedPermissions}
                                            handleAdd={handleAddPermissions}
                                            handleRemove={handleRemovePermissions}
                                            searchInput={searchInput}
                                            handleSearch={handleSearch}
                                            handlePermissionEdit={handlePermissionEdit}
                                            handleSelectAllData={handleSelectAllPermission}
                                        />
                                    </FormContainer>
                                )}

                                {/* Submit & Reset Buttons */}
                                <FormItem className="mt-10 flex justify-center gap-4">
                                    <Button type="reset" className="ltr:mr-2 rtl:ml-2" onClick={() => resetForm()}>
                                        Reset
                                    </Button>
                                    <Button variant="new" type="submit">
                                        Submit
                                    </Button>
                                </FormItem>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    )
}

export default BrandUserEdit
