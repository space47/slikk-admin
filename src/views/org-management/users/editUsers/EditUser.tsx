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

type FormModel = {
    first_name: string
    last_name: string
    mobile: string
    email: string
    business_email: string
    permissions: []
}

interface permission {
    id: number
    name: string
}

const BrandUserEdit = () => {
    const [userData, setUserData] = useState<FormModel>()
    const [getPermission, setGetPermission] = useState<permission[]>()
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
    const [addedPermissions, setAddedPermissions] = useState<permission[]>([])

    const { mobile } = useParams()

    const navigate = useNavigate()

    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>(
        (store) => store.company.currCompany,
    )

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`/permissions`) // For left side Card
            const perm = response.data?.permissions
            setGetPermission(perm)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const fetchDataRightPermission = async () => {
        try {
            const response = await axioisInstance.get(
                `company/user/permission/${mobile}`,
            )

            const user = response.data
            const userPermissions = response.data.user_permissions
            setUserData(user)
            setAddedPermissions(userPermissions) // For right side card
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchDataRightPermission()
    }, [])

    console.log('sssd', userData)

    const handlePermissionSelect = (id: number) => {
        setSelectedPermissions((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((permId) => permId !== id)
                : [...prevSelected, id],
        )
    }

    const handleAddPermissions = () => {
        const alreadyAdded = selectedPermissions.filter((permId) =>
            addedPermissions.some((added) => added.id === permId),
        )

        if (alreadyAdded.length > 0) {
            notification.warning({
                message: 'Warning',
                description: 'Permission already added',
            })
        }

        const selected = getPermission?.filter(
            (perm) =>
                selectedPermissions.includes(perm.id) &&
                !addedPermissions.some((added) => added.id === perm.id),
        )

        setAddedPermissions((prevAdded) => [...prevAdded, ...selected])
        setSelectedPermissions([])
    }

    const handleRemovePermissions = (id: number) => {
        setAddedPermissions((prevAdded) =>
            prevAdded.filter((perm) => perm.id !== id),
        )
    }

    const initialValue: FormModel = {
        first_name: '',
        last_name: '',
        mobile: '',
        email: '',
        business_email: '',
        permissions: [],
    }

    const handleSubmit = async (values: FormModel) => {} //................................................................

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm }) => (
                    <Form
                        className="w-full"
                        onKeyDown={(e: any) =>
                            e.key === 'Enter' && e.preventDefault()
                        }
                    >
                        <div className="text-xl mb-10 font-bold">
                            EDIT USER DETAILS
                        </div>
                        <FormContainer>
                            {/* Form Fields */}
                            <FormContainer className="grid grid-cols-2 gap-8">
                                {USER_EDIT_FROM.map((item, key) => (
                                    <FormItem
                                        key={key}
                                        label={item.label}
                                        className={item.className}
                                    >
                                        <Field
                                            type={item.type}
                                            name={item.name}
                                            placeholder={item.placeholder}
                                            component={Input}
                                        />
                                    </FormItem>
                                ))}
                            </FormContainer>

                            <div className="text-xl font-bold">
                                USER PERMISSIONS
                            </div>
                            <br />

                            {/* Permissions Section */}
                            <FormContainer className="">
                                <FormContainer className="flex justify-around">
                                    {/* All Permissions */}
                                    <Card className="overflow-scroll h-[560px] w-[400px] flex flex-col">
                                        <div className="sticky top-0 z-10 bg-white">
                                            <div className="mb-3 bg-white">
                                                <input
                                                    type="text"
                                                    className="border border-gray-200 w-[90%] h-8 items-center p-2 rounded-md active:border-0 hover:border-blue-500 active:border-blue-500"
                                                    placeholder="Search Permissions"
                                                />
                                            </div>
                                            <label
                                                htmlFor="All Permissions"
                                                className="font-bold bg-white"
                                            >
                                                All Permissions
                                            </label>
                                        </div>
                                        <div className="">
                                            {getPermission?.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex flex-col"
                                                >
                                                    <label className="bg-gray-100 px-2 py-2 flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedPermissions.includes(
                                                                item.id,
                                                            )}
                                                            onChange={() =>
                                                                handlePermissionSelect(
                                                                    item.id,
                                                                )
                                                            }
                                                        />
                                                        <span className="ml-2">
                                                            {item.name}
                                                        </span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>

                                    {/* Buttons */}
                                    <div className="flex justify-center items-center flex-col gap-4">
                                        <Button
                                            type="button"
                                            variant="accept"
                                            className="w-32 px-8"
                                            onClick={handleAddPermissions}
                                        >
                                            ADD {'>>'}
                                        </Button>
                                    </div>

                                    {/* Added Permissions */}
                                    <Card className="overflow-scroll h-[560px] w-[400px] flex flex-col">
                                        <div className="sticky top-0 z-10 bg-white">
                                            <div className="mb-3 bg-white">
                                                <input
                                                    type="text"
                                                    className="border border-gray-200 w-[90%] h-8 items-center p-2 rounded-md active:border-0 hover:border-blue-500 active:border-blue-500"
                                                    placeholder="Search Permissions"
                                                />
                                            </div>
                                            <label
                                                htmlFor="Added Permissions"
                                                className="font-bold bg-white"
                                            >
                                                Added Permissions
                                            </label>
                                        </div>
                                        <div className="">
                                            {addedPermissions.map(
                                                (item, key) => (
                                                    <div
                                                        key={key}
                                                        className="flex flex-col"
                                                    >
                                                        <div className="bg-gray-100 px-2 py-2 flex items-center justify-between">
                                                            <span className="text-black">
                                                                {item.name}
                                                            </span>
                                                            <button
                                                                className="text-red-500 ml-2"
                                                                onClick={() =>
                                                                    handleRemovePermissions(
                                                                        item.id,
                                                                    )
                                                                }
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </Card>
                                </FormContainer>
                            </FormContainer>

                            {/* Submit & Reset Buttons */}
                            <FormItem className="mt-10 flex justify-center gap-4">
                                <Button
                                    type="reset"
                                    className="ltr:mr-2 rtl:ml-2"
                                    onClick={() => resetForm()}
                                >
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
        </div>
    )
}

export default BrandUserEdit
