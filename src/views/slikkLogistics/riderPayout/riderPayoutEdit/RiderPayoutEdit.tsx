/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Tabs } from '@/components/ui'
import { Formik, FormikProps, Form } from 'formik'
import React, { useEffect, useState } from 'react'
import RenderPayout from '../components/RenderPayout'
import { useParams } from 'react-router-dom'
import { RiderPayout } from '@/store/types/riderPayout.types'
import { riderPayoutService } from '@/store/services/riderPayoutService'
import { notification } from 'antd'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import { removeEmptyKeys } from '../utils/riderPayoutCommon'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { CiTextAlignCenter } from 'react-icons/ci'
import { VscJson } from 'react-icons/vsc'
import PayoutFormFields from '../utils/PayoutFormFields'
import PayoutJson from '../utils/PayoutJson'

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

const RiderPayoutEdit = () => {
    const { id } = useParams()
    const [payoutData, setPayoutData] = useState<RiderPayout | null>(null)
    const [editableKeys, setEditableKeys] = useState<Record<string, string>>({})
    const [tabValue, setTabValue] = useState('field')
    const [jsonError, setJsonError] = useState('')

    const payoutCall = riderPayoutService.useSinglePayoutListQuery({ id }, { skip: !id })
    const payoutModelCall = riderPayoutService.useGetPayoutModelDataQuery({})

    const [createPayout, createResponse] = riderPayoutService.useCreatePayoutMutation()

    const incentiveOptions = payoutModelCall?.data?.config?.value?.incentives || {}
    const penaltyOptions = payoutModelCall?.data?.config?.value?.penalties || {}

    useEffect(() => {
        if (payoutCall.isSuccess) {
            setPayoutData(payoutCall.data.data.results[0])
        }
    }, [payoutCall.isSuccess, payoutCall.data?.data])

    const convertApiToFormValues = (data: RiderPayout | null): FormValues => {
        if (!data) {
            return {
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
        }

        return {
            name: data.name || '',
            description: data.description || '',
            commercial_details: {
                payout_model: data.commercial_details?.payout_model || 'day-wise',
                base_payout: data.commercial_details?.base_payout || 0,
                currency: data.commercial_details?.currency || 'INR',
                incentives: data.commercial_details?.incentives || {},
                penalties: data.commercial_details?.penalties || {},
            },
        }
    }

    const initialValues = convertApiToFormValues(payoutData)

    useEffect(() => {
        if (payoutData?.commercial_details) {
            setEditableKeys({
                ...payoutData.commercial_details.incentives,
                ...payoutData.commercial_details.penalties,
            })
        }
    }, [payoutData])

    useEffect(() => {
        if (createResponse.isSuccess) {
            notification.success({ message: 'Successfully updated rider payout' })
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
                {payoutCall?.isLoading || payoutCall?.isFetching ? (
                    <p>Loading Model Data</p>
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
                                    className={isActive ? 'bg-green-500 text-white' : ''}
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
        const cleanedValues = {
            ...values,
            commercial_details: {
                ...values.commercial_details,
                incentives: removeEmptyKeys(values.commercial_details.incentives),
                penalties: removeEmptyKeys(values.commercial_details.penalties),
            },
        }

        createPayout(cleanedValues as any)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-2 flex items-center gap-2">
                        <span className="w-1 h-4 bg-indigo-600 rounded-full" />
                        Configuration
                    </p>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Rider Payout Model</h1>
                </div>

                <Tabs value={tabValue} onChange={setTabValue}>
                    <TabList className="flex gap-8 border-b mb-6">
                        <TabNav value="field" icon={<CiTextAlignCenter />}>
                            Field Data
                        </TabNav>
                        <TabNav value="jsonData" icon={<VscJson />}>
                            JSON Data
                        </TabNav>
                    </TabList>
                </Tabs>

                <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ values, setFieldValue }: FormikProps<FormValues>) =>
                        tabValue === 'field' ? (
                            <Form className="space-y-6">
                                <PayoutFormFields values={values} setFieldValue={setFieldValue} />
                                <div className="bg-white rounded-xl border p-6">
                                    <h2 className="text-lg font-semibold mb-4">Incentives</h2>
                                    {renderToggleButtons('incentives', incentiveOptions, values, setFieldValue)}
                                    <RenderPayout
                                        obj={values.commercial_details.incentives}
                                        parentKey="commercial_details.incentives"
                                        setFieldValue={setFieldValue}
                                        editableKeys={editableKeys}
                                        setEditableKeys={setEditableKeys}
                                    />
                                </div>

                                <div className="bg-white rounded-xl border p-6">
                                    <h2 className="text-lg font-semibold mb-4">Penalties</h2>
                                    {renderToggleButtons('penalties', penaltyOptions, values, setFieldValue)}

                                    <RenderPayout
                                        obj={values.commercial_details.penalties}
                                        parentKey="commercial_details.penalties"
                                        setFieldValue={setFieldValue}
                                        editableKeys={editableKeys}
                                        setEditableKeys={setEditableKeys}
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button loading={createResponse.isLoading}>Save Changes</Button>
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

export default RiderPayoutEdit
