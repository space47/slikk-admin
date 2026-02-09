/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Select, Tabs } from '@/components/ui'
import Dialog from '@/components/ui/Dialog'
import { Field, FieldProps, Form, Formik } from 'formik'
import { RiderTypeArray } from '../AddRiders/riderUtils'
import FullTimePicker from '@/common/FullTimePicker'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { companyStore } from '@/store/types/companyStore.types'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { RiderAgency } from '../RiderDetailsCommon'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { errorMessage, successMessage } from '@/utils/responseMessages'

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    riderMobileStore: number[]
}

const BulkEditRiderModal = ({ dialogIsOpen, setIsOpen, riderMobileStore }: Props) => {
    console.log(riderMobileStore)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [activeTab, setActiveTab] = useState('fields')
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    const handleSubmit = async (values: any) => {
        const data = riderMobileStore
            ?.map((item) => {
                const obj = {
                    mobile: item,
                    rider_type: values?.rider_type || '',
                    shift_start_time: values?.shift_start_time || '',
                    shift_end_time: values?.shift_end_time || '',
                    store: values?.store || [],
                    agency: values?.agency || '',
                }
                return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== ''))
            })
            .filter(Boolean)

        const body = {
            riders: data,
        }

        try {
            const res = await axioisInstance.post(`/rider/bulk/update`, body)
            notification.success({ message: res?.data?.data?.message || 'Successfully Updated riders' })
            setIsOpen(false)
            navigate(0)
        } catch (error) {
            if (error instanceof AxiosError) {
                notification.error({ message: error?.response?.data?.message || 'Failed to update riders' })
            }
        }
    }

    const handleLogout = async () => {
        const body = {
            mobile: riderMobileStore?.join(','),
        }
        try {
            const res = await axioisInstance.post(`/admin/token/disable`, body)
            successMessage(res)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
        }
    }

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} width={1000} onRequestClose={() => setIsOpen(false)} onClose={() => setIsOpen(false)}>
                <Tabs defaultValue={'fields'} onChange={(val) => setActiveTab(val)}>
                    <TabList>
                        <TabNav value="fields" className={`text-xl ${activeTab === 'fields' ? ' border-b-2 border-green-500' : ''} `}>
                            Update Rider
                        </TabNav>
                        <TabNav value="logout" className={`text-xl ${activeTab === 'logout' ? ' border-b-2 border-green-500' : ''} `}>
                            Logout Rider
                        </TabNav>
                    </TabList>
                </Tabs>
                {activeTab === 'fields' && (
                    <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                        {() => (
                            <Form className="w-full mx-auto mt-2  p-6 bg-white rounded-lg shadow-md ">
                                <FormContainer>
                                    <div className="grid grid-cols-2 gap-6 overflow-scroll">
                                        <FormItem label="Rider Type" className="col-span-1">
                                            <Field name="rider_type">
                                                {({ form, field }: FieldProps) => {
                                                    const selectedCompany = RiderTypeArray.find((option) => option.label === field?.value)
                                                    return (
                                                        <div className="w-full">
                                                            <Select
                                                                isClearable
                                                                className="w-full"
                                                                options={RiderTypeArray}
                                                                getOptionLabel={(option) => option.label}
                                                                getOptionValue={(option) => option.value}
                                                                value={selectedCompany || null}
                                                                onChange={(newVal) => {
                                                                    form.setFieldValue('rider_type', newVal?.value)
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                }}
                                            </Field>
                                        </FormItem>
                                        <FormItem label="Store">
                                            <Field name={`store`}>
                                                {({ form, field }: FieldProps) => {
                                                    const selectedStores = storeResults.filter((option) =>
                                                        field.value?.some((store: any) => store === option.id),
                                                    )
                                                    return (
                                                        <div className="flex flex-col gap-1 w-full max-w-md">
                                                            <Select
                                                                isMulti
                                                                className="w-full"
                                                                options={storeResults}
                                                                getOptionLabel={(option) => option.code}
                                                                getOptionValue={(option) => option?.id?.toString()}
                                                                value={selectedStores || null}
                                                                onChange={(newVal) => {
                                                                    form.setFieldValue(
                                                                        `store`,
                                                                        newVal?.map((item) => item?.id),
                                                                    )
                                                                }}
                                                            />
                                                        </div>
                                                    )
                                                }}
                                            </Field>
                                        </FormItem>
                                        <FullTimePicker
                                            needClass
                                            customClass="w-full"
                                            label="SHIFT START"
                                            name="shift_start_time"
                                            fieldname="shift_start_time"
                                        />
                                        <FullTimePicker
                                            needClass
                                            customClass="w-full"
                                            label="SHIFT END"
                                            name="shift_end_time"
                                            fieldname="shift_end_time"
                                        />
                                    </div>
                                    <CommonSelect label="Rider Agency" name="agency" options={RiderAgency} />
                                </FormContainer>

                                <div className="flex justify-end pt-4">
                                    <Button variant="accept" type="submit">
                                        Submit
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
                {activeTab === 'logout' && (
                    <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg space-y-4">
                        <h2 className="text-lg font-semibold text-red-700">Logout the Selected Riders</h2>

                        <p className="text-sm text-red-600 text-center max-w-sm">
                            All the Riders selected will be logged out from this device. Are you sure you want to continue.
                        </p>

                        <Button variant="reject" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                )}
            </Dialog>
        </div>
    )
}

export default BulkEditRiderModal
