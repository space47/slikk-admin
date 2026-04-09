/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Tabs } from '@/components/ui'
import { Formik, FormikProps, Form } from 'formik'
import React, { useEffect, useState } from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi'
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
    const [createPayout, createResponse] = riderPayoutService.useCreatePayoutMutation()

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

    const cleanEmptyValues = (obj: any): any => {
        if (!obj) return obj
        if (Array.isArray(obj)) {
            return obj
                .map((item) => cleanEmptyValues(item))
                .filter(
                    (item) =>
                        item !== undefined && item !== null && item !== '' && !(typeof item === 'object' && Object.keys(item).length === 0),
                )
        }
        if (typeof obj === 'object') {
            const cleaned: any = {}
            for (const [key, value] of Object.entries(obj)) {
                if (key && key.trim() !== '' && value !== undefined && value !== null && value !== '') {
                    const cleanedValue = cleanEmptyValues(value)
                    if (
                        cleanedValue !== undefined &&
                        cleanedValue !== null &&
                        (typeof cleanedValue !== 'object' || Object.keys(cleanedValue).length > 0)
                    ) {
                        cleaned[key] = cleanedValue
                    }
                }
            }
            return cleaned
        }
        return obj
    }

    console.log(cleanEmptyValues)

    const extractEditableKeys = (obj: any, prefix = ''): Record<string, string> => {
        const keys: Record<string, string> = {}

        if (!obj || typeof obj !== 'object') return keys

        Object.keys(obj).forEach((key) => {
            const fullPath = prefix ? `${prefix}.${key}` : key
            keys[key] = key

            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                Object.assign(keys, extractEditableKeys(obj[key], fullPath))
            }
        })

        return keys
    }

    const initialValues = convertApiToFormValues(payoutData)

    useEffect(() => {
        if (payoutData?.commercial_details) {
            const incentivesKeys = extractEditableKeys(payoutData.commercial_details.incentives || {})
            const penaltiesKeys = extractEditableKeys(payoutData.commercial_details.penalties || {})
            setEditableKeys({ ...incentivesKeys, ...penaltiesKeys })
        }
    }, [payoutData])

    useEffect(() => {
        if (createResponse.isSuccess) {
            notification.success({ message: 'successfully created rider payout' })
        }
        if (createResponse.isError) {
            const errorMessage = getApiErrorMessage(createResponse.error)
            notification.error({ message: errorMessage })
        }
    }, [createResponse.isSuccess, createResponse.isError, createResponse.error])

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

export default RiderPayoutEdit
