/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { CREATEGROUPARRAY } from './CreateGroupCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import CreateGroupCardVomponent from './CreateGroupCardVomponent'
import { useNavigate } from 'react-router-dom'

const CreateGroups = () => {
    const [storeGroupId, setStoreGroupId] = useState<number>()
    const [getPermission, setGetPermission] = useState<any[]>([])
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
    const [addedPermissions, setAddedPermissions] = useState<{ id: number; name: string }[]>([])
    const [addInput, setAddInput] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const initialValue = {}
    const navigate = useNavigate()

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
        fetchPermissionData()
    }, [])

    const handleSubmit = async (values: any) => {
        const body = {
            name: values?.name,
        }
        try {
            const response = await axioisInstance.post(`/groups`, body)
            const data = response?.data?.data
            setStoreGroupId(data?.id)
            notification?.success({
                message: 'Group has been added',
            })
        } catch (error: any) {
            console.error(error)
            notification?.error({
                message: error?.response?.message || 'Failed to add groups',
            })
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
    }
    const filteredPermission = getPermission?.filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase()))

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

    const handleAddPerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddInput(e.target.value)
    }

    const handleRemovePermissions = (id: number) => {
        setAddedPermissions((prevAdded) => prevAdded.filter((perm) => perm.id !== id))
    }

    const filteredAddPermission = addedPermissions?.filter((item) => item.name.toLowerCase().includes(addInput.toLowerCase()))

    const handleAddPermission = async () => {
        const permissionIds = addedPermissions.map((item) => item.id)
        const body = {
            group_id: storeGroupId,
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
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <FormContainer className="grid grid-cols-2 gap-10">
                                {CREATEGROUPARRAY.map((item, key) => (
                                    <FormItem key={key} label={item.label} className="col-span-1 w-full">
                                        <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                    </FormItem>
                                ))}
                            </FormContainer>

                            <FormContainer className="flex justify-start mt-5">
                                {/* <Button type="reset" className="mr-2 bg-gray-600" onClick={() => resetForm()}>
                                    Reset
                                </Button> */}
                                <Button variant="solid" type="submit" className=" text-white">
                                    Submit
                                </Button>
                            </FormContainer>
                            <br />
                            <br />
                        </FormContainer>
                    </Form>
                )}
            </Formik>

            <div className="flex flex-col gap-10">
                <div className="font-bold text-xl">Add Permissions</div>
                <CreateGroupCardVomponent
                    searchInput={searchInput}
                    handleSearch={handleSearch}
                    filteredPermission={filteredPermission}
                    selectedPermissions={selectedPermissions}
                    handlePermissionSelect={handlePermissionSelect}
                    handleAddPermissions={handleAddPermissions}
                    addInput={addInput}
                    handleAddPerm={handleAddPerm}
                    filteredAddPermission={filteredAddPermission}
                    handleRemovePermissions={handleRemovePermissions}
                />
                <div className="flex justify-start">
                    <Button type="button" variant="new" onClick={handleAddPermission}>
                        {' '}
                        Add Permissions
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CreateGroups
