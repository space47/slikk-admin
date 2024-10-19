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
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { USER_EDIT_FROM } from './UserEditForm'
import CardComponent from './cardComponents/CardComponent'
import CardAnother from './cardComponents/CardAnother'
import { Spinner } from '@/components/ui'

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
    // for Groups.............
    const [getGroups, setGetGroups] = useState([])
    const [selectedGroups, setSelectedGroups] = useState<number[]>([])
    const [addedGroups, setAddedGroups] = useState<Groups[]>([])

    // for company
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const [selectedCompany, setSelectedCompany] = useState<number[]>([])
    const [addedCompany, setAddedCompany] = useState<{ id: number; name: string }[]>([])
    const [loadingEdit, setLoadingEdit] = useState(false)

    const { mobile } = useParams()

    const navigate = useNavigate()

    const selectedCurrentCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)

    const fetchUserData = async () => {
        try {
            setLoadingEdit(true)
            const response = await axioisInstance.get(`/company/1/users?mobile=${mobile}`)
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
        } catch (error) {
            console.log(error)
            setLoadingEdit(false)
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`/permissions`) // For left side Card
            const perm = response.data?.permissions
            setGetPermission(perm)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchGroups = async () => {
        try {
            const response = await axioisInstance.get(`/groups`)
            const grp = response.data?.groups
            setGetGroups(grp)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchDataRightPermission = async () => {
        try {
            const response = await axioisInstance.get(`company/user/permission/${mobile}`)

            const user = response.data
            const userPermissions = response.data.user_permissions
            setAddedPermissions(userPermissions) // For right side card
        } catch (error) {
            console.log(error)
        }
    }

    const fetchDataRightGroup = async () => {
        try {
            const response = await axioisInstance.get(`company/user/group/${mobile}`)

            const user = response.data
            const userPermissions = response.data.user_groups
            setAddedGroups(userPermissions) // For right side card
        } catch (error) {
            console.log(error)
        }
    }
    console.log('INI', getGroups)
    console.log('GROUPSDATA', addedGroups)
    console.log('PermSDATA', addedPermissions)

    useEffect(() => {
        fetchData()
        fetchDataRightPermission()
        fetchGroups()
        fetchDataRightGroup()
    }, [])

    console.log('DATAS', addedCompany)

    // permissions.................................................................
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

    //.........................................................................................................................
    // Groups..................................................................

    const handleGroupSelect = (id: number) => {
        setSelectedGroups((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((permId) => permId !== id) : [...prevSelected, id],
        )
    }
    const handleAddGroup = () => {
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

    const handleRemoveGroups = (id: number) => {
        setAddedGroups((prevAdded) => prevAdded.filter((perm) => perm.id !== id))
    }

    // comapny................................................................

    const handleCompanySelect = (id: number) => {
        setSelectedCompany((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((permId) => permId !== id) : [...prevSelected, id],
        )
    }
    const handleAddCompany = () => {
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
        setSelectedCompany([])
    }

    const handleRemoveCompany = (id: number) => {
        setAddedCompany((prevAdded) => prevAdded.filter((perm) => perm.id !== id))
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
    console.log(
        'usermainDtaa',
        getGroups.map((item) => item),
    )
    console.log(
        'dataokok',
        addedGroups.map((item) => item),
    )

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
        console.log('body', bodyData)
        try {
            const response = await axioisInstance.patch(
                `company/user/${mobile}`, //-companyid
                bodyData,
            )
            console.log('response of add users', response)
            navigate('/app/users')
        } catch (error) {
            console.log(error)
        }
    }
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
                        <Form className="w-full" onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}>
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

                                <FormContainer className="">
                                    <CardComponent
                                        label="Company"
                                        selectedValue={selectedCompany}
                                        getValue={companyList}
                                        handleSelect={handleCompanySelect}
                                        addedValue={addedCompany}
                                        handleAdd={handleAddCompany}
                                        handleRemove={handleRemoveCompany}
                                        selectAll
                                        handleSelectAll={handleSelectAll}
                                    />
                                </FormContainer>
                                <br />

                                <FormContainer className="">
                                    <CardComponent
                                        label="Groups"
                                        selectedValue={selectedGroups}
                                        getValue={getGroups}
                                        handleSelect={handleGroupSelect}
                                        addedValue={addedGroups}
                                        handleAdd={handleAddGroup}
                                        handleRemove={handleRemoveGroups}
                                    />
                                </FormContainer>
                                <br />

                                <FormContainer className="">
                                    <CardComponent
                                        label="Permissions"
                                        selectedValue={selectedPermissions}
                                        getValue={getPermission}
                                        handleSelect={handlePermissionSelect}
                                        addedValue={addedPermissions}
                                        handleAdd={handleAddPermissions}
                                        handleRemove={handleRemovePermissions}
                                    />
                                </FormContainer>

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
