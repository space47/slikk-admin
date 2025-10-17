/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input, Select } from '@/components/ui'
import Dialog from '@/components/ui/Dialog'
import { Field, FieldProps, Form, Formik } from 'formik'
import { RiderTypeArray } from '../AddRiders/riderUtils'
import FullTimePicker from '@/common/FullTimePicker'
import { GenericCommonTypes } from '@/common/allTypesCommon'
import AddRiderMap from '../AddRiders/AddRiderMap'
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

interface Props {
    dialogIsOpen: boolean
    setIsOpen: (x: boolean) => void
    riderMobileStore: number[]
}

const BulkEditRiderModal = ({ dialogIsOpen, setIsOpen, riderMobileStore }: Props) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [currLat, setCurrLat] = useState<number>(12.920216)
    const [currLong, setCurrLong] = useState<number>(77.649326)
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
                    service_latitude: currLat,
                    service_longitude: currLong,
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

    return (
        <div>
            <Dialog
                isOpen={dialogIsOpen}
                width={1000}
                height={'80vh'}
                onRequestClose={() => setIsOpen(false)}
                onClose={() => setIsOpen(false)}
            >
                <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                    {() => (
                        <Form className="w-full mx-auto mt-2  p-6 bg-white rounded-lg shadow-md ">
                            <FormContainer className="overflow-scroll h-[60vh]">
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
                                    <CommonSelect label="Rider Agency" name="agency" options={RiderAgency} />
                                </div>

                                <div className="border-t border-gray-200 pt-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                name="lat"
                                                type="number"
                                                value={currLat}
                                                placeholder="Enter latitude"
                                                className="w-full"
                                                onChange={(e: GenericCommonTypes['InputEvent']) => setCurrLat(Number(e.target.value))}
                                            />
                                            <Input
                                                name="long"
                                                type="number"
                                                value={currLong}
                                                placeholder="Enter longitude"
                                                className="w-full"
                                                onChange={(e: GenericCommonTypes['InputEvent']) => setCurrLong(Number(e.target.value))}
                                            />
                                        </div>

                                        <div className="h-64 p-5 overflow-y-auto border border-gray-200 rounded-md xl:block hidden">
                                            <AddRiderMap
                                                setMarkLat={setCurrLat ?? 0}
                                                setMarkLong={setCurrLong ?? 0}
                                                markLat={currLat ?? 0}
                                                markLong={currLong ?? 0}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </FormContainer>

                            <div className="flex justify-end pt-4">
                                <Button variant="accept" type="submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    )
}

export default BulkEditRiderModal
