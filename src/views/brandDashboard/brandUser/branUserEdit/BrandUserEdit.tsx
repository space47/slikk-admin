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

// const validationSchema = Yup.object().shape({
//     document_number: Yup.string().required('Document Number is required'),
//     document_date: Yup.date().required('Document Date is required').nullable(),
//     origin_address: Yup.string()
//         .required('Supplier Address is required')
//         .transform((value) => value.trim()),
//     received_address: Yup.string()
//         .required('Receiver Address is required')
//         .transform((value) => value.trim()),
//     received_by: Yup.string()
//         .required('Received By is required')
//         .matches(/^[6-9]\d{9}$/, 'Mobile Number is not valid'),
//     total_sku: Yup.number()
//         .required('Total SKUs is required')
//         .integer('Must be an integer'),
//     total_quantity: Yup.number()
//         .required('Total Quantity is required')
//         .integer('Must be an integer'),
//     singleCheckbox: Yup.boolean(),
//     // images: Yup.string().nullable(),
//     // document: Yup.string().nullable(),
// })

const BrandUserEdit = () => {
    const [getPermission, setGetPermission] = useState<permission[]>()
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
    const [addedPermissions, setAddedPermissions] = useState([])

    const [initialValue, setInitialValue] = useState<FormModel>({
        first_name: '',
        last_name: '',
        mobile: '',
        email: '',
        business_email: '',
        permissions: [],
    })

    const { mob } = useParams()
    console.log('object', mob)
    const navigate = useNavigate()

    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>(
        (store) => store.company.currCompany,
    )

    const handlePermissionSelect = (id: number) => {
        setSelectedPermissions((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((permId) => permId !== id)
                : [...prevSelected, id],
        )
    }

    const handleAddPermissions = () => {
        const alreadyAdded = selectedPermissions.filter((permId) =>
            addedPermissions.some((added) => added === permId),
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
                !addedPermissions.some((added) => added === perm.id),
        )

        // setAddedPermissions((prevAdded) => [...prevAdded, ...selected])
        setSelectedPermissions([])
    }

    const handleRemovePermissions = (id: number) => {
        setAddedPermissions((prevAdded) =>
            prevAdded.filter((perm) => perm !== id),
        )
    }

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`/permissions`)
            const perm = response.data?.permissions
            setGetPermission(perm)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const fetchUser = async () => {
        try {
            const response = await axioisInstance.get(
                `company/${selectedCompany.id}/users?mobile=9818454888`,
            )

            const userData = response.data.data
            const userPermissions = response.data.data.permissions

            setInitialValue({
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                mobile: userData.mobile || '',
                email: userData.email || '',
                business_email: userData.business_email || '',
                permissions:
                    userData.permissions.map((p: permission) => p.id) || [],
            })

            console.log('sssssssss', userPermissions)

            setAddedPermissions(userPermissions)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const handleSubmit = async (values: FormModel) => {} //................................................................

    console.log('iiiiiiiiiiiiiiiiiiiiiiii', initialValue)

    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValue}
                // validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, touched, errors, resetForm }) => (
                    <Form className="w-2/3">
                        <div className="text-xl mb-10">User details</div>
                        <FormContainer>
                            {/* Form Fields */}
                            <FormContainer className="flex flex-row gap-7 ">
                                <FormItem
                                    asterisk
                                    label="First Name"
                                    invalid={
                                        errors.first_name && touched.first_name
                                    }
                                    errorMessage={errors.first_name}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="first_name"
                                        component={Input}
                                        onKeyDown={(e: any) =>
                                            e.key === 'Enter' &&
                                            e.preventDefault()
                                        }
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Last Name"
                                    invalid={
                                        errors.last_name && touched.last_name
                                    }
                                    errorMessage={errors.last_name}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="last_name"
                                        component={Input}
                                        onKeyDown={(e: any) =>
                                            e.key === 'Enter' &&
                                            e.preventDefault()
                                        }
                                    />
                                </FormItem>
                            </FormContainer>

                            {/* Mobile, Email, Business Email */}
                            <FormContainer className="flex flex-row gap-7 ">
                                <FormItem
                                    asterisk
                                    label="Mobile"
                                    invalid={errors.mobile && touched.mobile}
                                    errorMessage={errors.mobile}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="mobile"
                                        component={Input}
                                        onKeyDown={(e: any) =>
                                            e.key === 'Enter' &&
                                            e.preventDefault()
                                        }
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Email"
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="email"
                                        component={Input}
                                        onKeyDown={(e: any) =>
                                            e.key === 'Enter' &&
                                            e.preventDefault()
                                        }
                                    />
                                </FormItem>
                                <FormItem
                                    asterisk
                                    label="Work Email"
                                    invalid={
                                        errors.business_email &&
                                        touched.business_email
                                    }
                                    errorMessage={errors.business_email}
                                    className="col-span-1 w-1/2"
                                >
                                    <Field
                                        type="text"
                                        name="business_email"
                                        component={Input}
                                        onKeyDown={(e: any) =>
                                            e.key === 'Enter' &&
                                            e.preventDefault()
                                        }
                                    />
                                </FormItem>
                            </FormContainer>

                            <div className="text-xl">User Permission</div>
                            <br />

                            {/* Permissions Section */}
                            <FormContainer className="">
                                <FormContainer className="flex justify-between">
                                    {/* All Permissions */}
                                    <Card className="overflow-scroll h-[460px] w-[400px] flex flex-col">
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
                                    <Card className="overflow-scroll h-[460px] w-[400px] flex flex-col">
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
                                                                {item}
                                                            </span>
                                                            <button
                                                                className="text-red-500 ml-2"
                                                                onClick={() =>
                                                                    handleRemovePermissions(
                                                                        item,
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
                            <FormItem className="mt-10">
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
