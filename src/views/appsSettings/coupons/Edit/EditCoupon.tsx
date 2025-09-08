/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import CouponForm from '../CouponForm'
import { FormItem } from '@/components/ui'
import { MdDelete } from 'react-icons/md'
import Papa from 'papaparse'

const ACTION_ARRAY = [
    { name: 'Add', value: 'add' },
    { name: 'Remove', value: 'remove' },
    { name: 'Replace', value: 'replace' },
]

const AddCoupons = () => {
    const navigate = useNavigate()
    const [couponsEdit, setCouponsEdit] = useState<any>()
    const [csvFile, setCSVFile] = useState<any>()
    const [mobileNumbers, setMobileNumbers] = useState<string[]>([])
    const { coupon_code } = useParams()

    useEffect(() => {
        const fetchCouponsCode = async () => {
            try {
                const response = await axioisInstance.get(`merchant/coupon?coupon_code=${coupon_code}`)
                const data = response?.data?.data
                setCouponsEdit(data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchCouponsCode()
    }, [coupon_code])

    const initialValue: any = {
        code: couponsEdit?.code || '',
        user: couponsEdit?.user?.map((item: any) => item.mobile) || [],
    }

    const handleCSVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null
        if (file) {
            setCSVFile(file)
            parseCSV(file)
        }
    }

    const parseCSV = (file: File) => {
        Papa.parse(file, {
            complete: (result) => {
                const extractedMobileNumbers = result.data.map((row: any) => row.mobile).filter(Boolean)
                setMobileNumbers(extractedMobileNumbers)
            },
            header: true,
            skipEmptyLines: true,
        })
    }

    const handleSubmit = async (values: any) => {
        try {
            const formData = new FormData()
            const userArray = Array.isArray(values.user) ? values.user : values.user.split(',').map((mobile: string) => mobile.trim())
            formData.append('code', initialValue?.code)
            formData.append('user_add_action', values?.user_add_action)
            if (values.user) {
                formData.append('users', values.user)
            } else if (csvFile) {
                formData.append('users', Array.isArray(mobileNumbers) ? mobileNumbers.join(',') : '')
            } else if (userArray.length > 0) {
                formData.append('users', userArray)
            }

            const response = await axioisInstance.patch('/merchant/coupon', formData)
            notification.success({
                message: 'Success',
                description: response?.data?.message || response?.data?.data?.message || 'Coupon Updated successfully',
            })
            navigate(-1)
        } catch (error: any) {
            console.error('Error during submission:', error)

            notification.error({
                message: error?.response?.data?.data?.message || 'Failure',

                description: 'Failed to Update Coupon',
            })
        }
    }

    return (
        <div>
            <h3 className="mb-5 from-neutral-900">COUPON EDIT</h3>
            <FormItem label="" className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        accept=".csv"
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={handleCSVFileChange}
                    />
                    <MdDelete
                        className="text-xl text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => {
                            setMobileNumbers([])
                            setCSVFile('')
                            notification.info({
                                message: 'CSV file cleared',
                            })
                        }}
                    />
                </div>
            </FormItem>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, setFieldValue, resetForm }) => (
                    <CouponForm values={values} setFieldValue={setFieldValue} resetForm={resetForm} ACTIONARRAY={ACTION_ARRAY} />
                )}
            </Formik>
        </div>
    )
}

export default AddCoupons
