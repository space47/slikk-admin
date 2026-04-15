/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Tabs } from '@/components/ui'
import { Formik, FormikProps, Form } from 'formik'
import React, { useEffect, useState } from 'react'
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
        incentives: {},
        penalties: {},
    },
}

const RiderPayoutAdd = () => {
    const [editableKeys, setEditableKeys] = useState<Record<string, string>>({})
    const [tabValue, setTabValue] = useState('field')
    const [jsonError, setJsonError] = useState('')
    const [createPayout, createResponse] = riderPayoutService.useCreatePayoutMutation()
    const payoutModelCall = riderPayoutService.useGetPayoutModelDataQuery({})

    const incentiveOptions = payoutModelCall?.data?.config?.value?.incentives || {}
    const penaltyOptions = payoutModelCall?.data?.config?.value?.penalties || {}

    useEffect(() => {
        if (createResponse.isSuccess) {
            notification.success({ message: 'Successfully created rider payout' })
        }
        if (createResponse.isError) {
            notification.error({ message: getApiErrorMessage(createResponse.error) })
        }
    }, [createResponse.isSuccess, createResponse.isError, createResponse.error])

    const handleToggle = (type: 'incentives' | 'penalties', key: string, values: FormValues, setFieldValue: any, defaultData: any) => {
        const path = `commercial_details.${type}`
        const exists = values.commercial_details[type]?.[key]

        if (exists) {
            const updated = { ...values.commercial_details[type] }
            delete updated[key]
            setFieldValue(path, updated)
        } else {
            setFieldValue(`${path}.${key}`, defaultData)
        }
    }

    const formatLabel = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

    const renderToggleButtons = (
        type: 'incentives' | 'penalties',
        options: Record<string, any>,
        values: FormValues,
        setFieldValue: any,
    ) => {
        return (
            <div className="flex flex-wrap gap-2 mb-4">
                {payoutModelCall?.isLoading ? (
                    <p>Loading Model Data .....</p>
                ) : (
                    <>
                        {Object.keys(options).map((key) => {
                            const isActive = !!values.commercial_details[type]?.[key]

                            return (
                                <Button
                                    key={key}
                                    type="button"
                                    size="sm"
                                    variant={isActive ? 'solid' : 'default'}
                                    className={`capitalize ${isActive ? 'bg-green-500 text-white' : ''}`}
                                    onClick={() => handleToggle(type, key, values, setFieldValue, options[key])}
                                >
                                    {isActive ? `Remove ${formatLabel(key)}` : `Add ${formatLabel(key)}`}
                                </Button>
                            )
                        })}
                    </>
                )}
            </div>
        )
    }

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
                        <TabNav value="field" icon={<CiTextAlignCenter className="text-green-500 text-xl" />}>
                            <span className="text-xl">Field Data</span>
                        </TabNav>
                        <TabNav value="jsonData" icon={<VscJson className="text-orange-400 text-xl" />}>
                            <span className="text-xl">JSON Data</span>
                        </TabNav>
                    </TabList>
                </Tabs>

                <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ values, setFieldValue }: FormikProps<FormValues>) =>
                        tabValue === 'field' ? (
                            <Form className="space-y-6">
                                <PayoutFormFields values={values} setFieldValue={setFieldValue} />
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-indigo-50 to-white px-6 py-4 border-b border-indigo-100">
                                        <h2 className="text-lg font-semibold text-gray-900">Incentives</h2>
                                    </div>
                                    <div className="p-6">
                                        {renderToggleButtons('incentives', incentiveOptions, values, setFieldValue)}

                                        <RenderPayout
                                            obj={values.commercial_details.incentives}
                                            parentKey="commercial_details.incentives"
                                            setFieldValue={setFieldValue}
                                            editableKeys={editableKeys}
                                            setEditableKeys={setEditableKeys}
                                        />
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-rose-50 to-white px-6 py-4 border-b border-rose-100">
                                        <h2 className="text-lg font-semibold text-gray-900">Penalties</h2>
                                    </div>
                                    <div className="p-6">
                                        {renderToggleButtons('penalties', penaltyOptions, values, setFieldValue)}

                                        <RenderPayout
                                            obj={values.commercial_details.penalties}
                                            parentKey="commercial_details.penalties"
                                            setFieldValue={setFieldValue}
                                            editableKeys={editableKeys}
                                            setEditableKeys={setEditableKeys}
                                        />
                                    </div>
                                </div>
                                <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4">
                                    <div className="flex justify-end">
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
