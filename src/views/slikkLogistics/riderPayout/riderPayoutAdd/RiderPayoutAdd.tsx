/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Tabs } from '@/components/ui'
import { Formik, FormikProps, Form } from 'formik'
import React, { useEffect, useState } from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi'
import RenderPayout from '../components/RenderPayout'
import { notification } from 'antd'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { riderPayoutService } from '@/store/services/riderPayoutService'
import { removeEmptyKeys } from '../utils/riderPayoutCommon'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { CiTextAlignCenter } from 'react-icons/ci'
import { VscJson } from 'react-icons/vsc'
import PayoutJson from '../utils/PayoutJson'
import PayoutFormFields from '../utils/PayoutFormFields'

interface FormValues {
    name: string
    description: string
    commercial_details: {
        payout_model: string
        base_payout: number
        currency: string
        incentives: any
        penalties: any
    }
}

const initialValues: FormValues = {
    name: '',
    description: '',
    commercial_details: {
        payout_model: 'day-wise',
        base_payout: 0,
        currency: 'INR',
        incentives: {
            order_count_incentive: {
                thresholds: [
                    { min_orders: 0, max_orders: 7, incentive_amount: 0, type: 'flat' },
                    { min_orders: 8, max_orders: 9, incentive_amount: 50, type: 'flat' },
                    { min_orders: 10, max_orders: 11, incentive_amount: 75, type: 'flat' },
                    { min_orders: 12, max_orders: 13, incentive_amount: 100, type: 'flat' },
                    { min_orders: 14, max_orders: 15, incentive_amount: 125, type: 'flat' },
                    { min_orders: 16, max_orders: 100, incentive_amount: 150, type: 'flat' },
                ],
            },
            time_incentive: {
                thresholds: [
                    { min_hours: 0, max_hours: 11, incentive_amount: 0, type: 'flat' },
                    { min_hours: 12, max_hours: 15, incentive_amount: 90, type: 'hour-wise' },
                ],
            },
            days_worked_in_month_incentive: {
                thresholds: [
                    { min_days: 0, max_days: 26, incentive_amount: 0, type: 'flat' },
                    { min_days: 27, max_days: 31, incentive_amount: 1000, type: 'day-wise' },
                ],
            },
            on_time_delivery_incentive: {
                thresholds: [{ min_orders: 1, max_orders: 100, incentive_amount: 10, type: 'order-wise' }],
            },
            days_worked_in_week_incentive: {
                minimum_days: 6,
                mandatory_days: [3, 4, 5, 6],
                incentive_amount: 100,
            },
            distance_incentive: {
                thresholds: [{ min_distance: 0, max_distance: 15, incentive_amount: 0, type: 'flat' }],
            },
        },
        penalties: {
            time_penalty: {
                thresholds: [{ min_hours: 0, max_hours: 10, penalty_amount: 90, type: 'hour-wise' }],
            },
            weekend_penalty: {
                thresholds: [{ is_weekend: true, penalty_amount: 150, type: 'daily', penalty_amount_type: 'percentage' }],
            },
            order_rejection_penalty: {
                thresholds: [{ min_rejections: 0, max_rejections: 100, penalty_amount: 25, type: 'order-wise' }],
            },
            late_checkin_penalty: {
                thresholds: [
                    { min_minutes: 0, max_minutes: 15, penalty_amount: 0, type: 'flat' },
                    { min_minutes: 15, max_minutes: 600, penalty_amount: 25, type: 'flat' },
                ],
            },
        },
    },
}

const RiderPayoutAdd = () => {
    const [editableKeys, setEditableKeys] = useState<Record<string, string>>({})
    const [tabValue, setTabValue] = useState('field')
    const [jsonError, setJsonError] = useState('')
    const [createPayout, createResponse] = riderPayoutService.useCreatePayoutMutation()

    useEffect(() => {
        if (createResponse.isSuccess) notification.success({ message: 'Successfully created rider payout' })
        if (createResponse.isError) notification.error({ message: getApiErrorMessage(createResponse.error) })
    }, [createResponse.isSuccess, createResponse.isError, createResponse.error])

    const handleSubmit = async (values: FormValues) => {
        createPayout({
            ...values,
            commercial_details: {
                ...values.commercial_details,
                incentives: removeEmptyKeys(values.commercial_details.incentives),
                penalties: removeEmptyKeys(values.commercial_details.penalties),
            },
        } as any)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-2 flex items-center gap-2">
                        <span className="w-1 h-4 bg-indigo-600 rounded-full" />
                        Configuration
                    </p>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Rider Payout Model</h1>
                </div>

                <Tabs defaultValue="field" className="flex flex-col" value={tabValue} onChange={setTabValue}>
                    <TabList className="flex gap-8 border-b border-gray-200 dark:border-gray-700 mb-6">
                        <TabNav
                            value="field"
                            icon={<CiTextAlignCenter className="text-green-500 text-xl" />}
                            className="px-4 py-2 text-gray-600 hover:text-blue-600 border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-colors duration-200"
                        >
                            <span className="text-xl">Field Data</span>
                        </TabNav>
                        <TabNav
                            value="jsonData"
                            icon={<VscJson className="text-orange-400 text-xl" />}
                            className="px-4 py-2 text-gray-600 hover:text-blue-600 border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-colors duration-200"
                        >
                            <span className="text-xl">JSON Data</span>
                        </TabNav>
                    </TabList>
                </Tabs>

                <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ values, setFieldValue }: FormikProps<FormValues>) =>
                        tabValue === 'field' ? (
                            <Form className="space-y-6">
                                <PayoutFormFields values={values} setFieldValue={setFieldValue} />
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                    <div className="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 border-b border-indigo-100">
                                        <h2 className="text-lg font-semibold text-gray-900">Incentives</h2>
                                    </div>
                                    <div className="p-6">
                                        <RenderPayout
                                            obj={values.commercial_details.incentives}
                                            parentKey="commercial_details.incentives"
                                            setFieldValue={setFieldValue}
                                            editableKeys={editableKeys}
                                            setEditableKeys={setEditableKeys}
                                        />
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                                    <div className="bg-gradient-to-r from-rose-50 to-white px-6 py-4 border-b border-rose-100">
                                        <h2 className="text-lg font-semibold text-gray-900">Penalties</h2>
                                    </div>
                                    <div className="p-6">
                                        <RenderPayout
                                            obj={values.commercial_details.penalties}
                                            parentKey="commercial_details.penalties"
                                            setFieldValue={setFieldValue}
                                            editableKeys={editableKeys}
                                            setEditableKeys={setEditableKeys}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="hidden md:flex items-center gap-2 text-xs text-gray-500">
                                            <HiOutlineInformationCircle className="w-4 h-4" />
                                            All changes are auto-saved in the form
                                        </p>
                                        <div className="flex items-center gap-3 ml-auto">
                                            <Button
                                                variant="blue"
                                                size="sm"
                                                loading={createResponse.isLoading}
                                                disabled={createResponse.isLoading}
                                            >
                                                Save Payout Model
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        ) : (
                            <PayoutJson
                                values={values}
                                setFieldValue={setFieldValue}
                                jsonError={jsonError}
                                setJsonError={setJsonError}
                                isLoading={createResponse.isLoading}
                            />
                        )
                    }
                </Formik>
            </div>
        </div>
    )
}

export default RiderPayoutAdd
