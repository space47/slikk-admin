/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, Dropdown, FormContainer, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useEffect, useState, useMemo } from 'react'
import { RiderFieldArray, RiderTypeArray, SearchRider } from './riderUtils'
import AddRiderMap from './AddRiderMap'
import { notification } from 'antd'
import FullTimePicker from '@/common/FullTimePicker'
import { ridersService } from '@/store/services/riderServices'
import { RiderAddTypes } from '@/store/types/riderAddTypes'
import { useAppDispatch, useAppSelector } from '@/store'
import { RiderDetailType, setRiderProfile } from '@/store/slices/riderDetails/riderDetails.slice'
import { HiSearch } from 'react-icons/hi'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { DeliveryType, RIDER_TYPES, RiderAgency } from '../RiderDetailsCommon'
import AddBulk from '../RiderComponents/AddBulk'
import StoreSelectForm from '@/common/StoreSelectForm'
import { riderZoneService } from '@/store/services/riderZoneService'
import CommonAccordion from '@/common/CommonAccordion'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { deliveryAgency } from '@/store/services/deliveryAgencyService'
import FormButton from '@/components/ui/Button/FormButton'
import RiderKyc from './RiderKyc'
import { handleimage } from '@/common/handleImage'

const AddRider = () => {
    const dispatch = useAppDispatch()
    const [selectedRider, setSelectedRider] = useState<string | number>()
    const [ridersAdd, riderAddResponse] = ridersService.useAddRidersMutation()
    const [editRiders, riderEditResponse] = ridersService.useEditRidersMutation()
    const [riderAgencyArray, setRiderAgencyArray] = useState<DeliveryType[]>([])
    const { riderProfile } = useAppSelector<RiderDetailType>((state) => state.riderDetails)
    const [isAddRider, setIsAddRider] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [searchZone, setSearchZone] = useState('')
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(SearchRider[0])
    const [isBulkAdd, setIsBulkAdd] = useState(false)
    const [activeTab, setActiveTab] = useState<'edit' | 'add' | 'bulk-add'>('edit')
    const [queryParams, setQueryParams] = useState({ page: 1, pageSize: 10, name: '' })

    const riderAgencyCall = deliveryAgency.useGetDeliveryAgencyQuery({ view_type: 'minimal' })

    useEffect(() => {
        if (riderAgencyCall.isSuccess) {
            setRiderAgencyArray(
                (riderAgencyCall.data as any)?.data?.map((item: any) => ({
                    label: item || 'Slikk',
                    value: item || 'slikk',
                })),
            )
        }
        if (riderAgencyCall.isError) {
            setRiderAgencyArray(RiderAgency)
        }
    }, [riderAgencyCall.isSuccess, riderAgencyCall.isError])

    const {
        data: riders,
        isSuccess,
        refetch,
    } = ridersService.useRiderProfileQuery(
        {
            page: 1,
            pageSize: 100,
            mobile: currentSelectedPage?.value === 'mobile' ? selectedRider?.toString() : '',
            name: currentSelectedPage?.value === 'name' ? selectedRider?.toString() : '',
        },
        { refetchOnMountOrArgChange: true },
    )
    const { data } = riderZoneService.useLiveZonesQuery(queryParams, { refetchOnMountOrArgChange: true })

    useEffect(() => {
        if (isSuccess) {
            dispatch(setRiderProfile(riders?.data || []))
        }
    }, [riders, isSuccess, dispatch, selectedRider])

    const formattedData = useMemo(
        () =>
            data?.results.map((item) => {
                return { label: item?.name, value: item?.id }
            }),
        [data],
    )

    const handleSearch = (inputValue: string) => {
        setSearchZone(inputValue)
        setQueryParams((prev) => ({ ...prev, name: inputValue }))
    }

    const initialValue = useMemo(() => {
        if (selectedRider && !isAddRider && riderProfile && riderProfile.length > 0) {
            const user = riderProfile[0]?.user || {}
            return {
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                mobile: user.mobile ? user.mobile.toString() : '',
                shift_start_time: riderProfile[0]?.shift_start_time || '',
                shift_end_time: riderProfile[0]?.shift_end_time || '',
                rider_type: riderProfile[0]?.rider_type || '',
                is_active: riderProfile[0]?.is_active || false,
                lat: riderProfile[0]?.service_latitude,
                long: riderProfile[0]?.service_longitude,
                agency: riderProfile[0]?.agency?.toLowerCase(),
                rider_delivery_type: riderProfile[0]?.rider_delivery_type,
                store: riderProfile[0]?.store?.map((item: any) => item?.id)?.join(','),
                rider_zone: riderProfile[0]?.zone,
                delivery_type: riderProfile[0]?.delivery_type,
                aadharImage: riderProfile[0]?.kyc_data?.aadhar,
                panImage: riderProfile[0]?.kyc_data?.pan,
                dlImage: riderProfile[0]?.kyc_data?.driving_license,
                bank_details: riderProfile[0]?.bank_details,
                pan_number: riderProfile[0]?.pan_number,
                aadhar_number: riderProfile[0]?.aadhar_number,
                driving_license_number: riderProfile[0]?.driving_license_number,
            }
        }
        return {
            first_name: '',
            last_name: '',
            mobile: '',
            shift_start_time: '',
            shift_end_time: '',
            rider_type: '',
            is_active: false,
            lat: 12.920216,
            long: 77.649326,
        }
    }, [selectedRider, isAddRider, riderProfile])

    useEffect(() => {
        if (riderAddResponse?.isSuccess) {
            notification.success({ message: riderAddResponse?.data?.success || 'Successfully Added Rider' })
            refetch()
        }
        if (riderEditResponse?.isSuccess) {
            notification.success({ message: riderEditResponse?.data?.success || 'Successfully Updated Rider' })
            refetch()
        }
        if (riderEditResponse?.isError) {
            notification.error({ message: (riderEditResponse?.error as any)?.data?.message })
        }
        if (riderAddResponse?.isError) {
            notification.error({ message: (riderAddResponse?.error as any)?.data?.message })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [riderAddResponse.isSuccess, riderEditResponse.isSuccess, riderAddResponse.isError, riderEditResponse.isError])

    const uploadIfNew = async (file: any, initialFile: any) => {
        if (file === initialFile) {
            return initialFile
        }
        if (!file) {
            return null
        }
        if (file) {
            return await handleimage('rider_kyc', file)
        }

        return file
    }

    const handleSubmit = async (values: RiderAddTypes) => {
        console.log('store', values)
        if (!values?.mobile) {
            notification.error({ message: 'Mobile is required' })
        }

        const [aadharResult, panResult, dlResult] = await Promise.allSettled([
            uploadIfNew(values?.aadharImage, initialValue?.aadharImage),
            uploadIfNew(values?.panImage, initialValue?.panImage),
            uploadIfNew(values?.dlImage, initialValue?.dlImage),
        ])

        const aadharImage = aadharResult.status === 'fulfilled' ? aadharResult.value : initialValue?.aadharImage
        const panImage = panResult.status === 'fulfilled' ? panResult.value : initialValue?.panImage
        const dlImage = dlResult.status === 'fulfilled' ? dlResult.value : initialValue?.dlImage

        if (values?.mobile) {
            const payload = {
                mobile: values?.mobile,
                first_name: selectedRider && !isAddRider ? riderProfile[0].user?.first_name : values?.first_name,
                last_name: values?.last_name,
                rider_type: values?.rider_type,
                service_latitude: values?.lat,
                service_longitude: values?.long,
                shift_start_time: values?.shift_start_time,
                shift_end_time: values?.shift_end_time,
                is_active: values?.is_active || false,
                agency: values?.agency || '',
                store_id: (values?.store as any)?.id || Number(values?.store) || '',
                rider_delivery_type: values?.rider_delivery_type || 'standard',
                zone: values?.rider_zone || '',
                delivery_type: values?.delivery_type,
                kyc_data: {
                    aadhar: aadharImage,
                    pan: panImage,
                    driving_license: dlImage,
                },
                bank_details: {
                    account_number: values?.bank_details?.account_number,
                    ifsc: values?.bank_details?.ifsc,
                    bank_name: values?.bank_details?.bank_name,
                },
                aadhar_number: values?.aadhar_number,
                pan_number: values?.pan_number,
                driving_license_number: values?.driving_license_number,
            }
            if (isAddRider) {
                ridersAdd(payload as any)
            } else {
                editRiders(payload as any)
            }
        }
    }
    const setSearchOnEnter = () => {
        if (searchInput.trim()) {
            setSelectedRider(searchInput.trim())
            refetch()
        }
    }

    const handleSearchWithIcon = () => {
        setSearchOnEnter()
    }
    const handleSelect = (e: any, setCurrent: any) => {
        const selected = SearchRider.find((item) => item.value === e)
        if (selected) {
            setCurrent(selected)
        }
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={initialValue as any} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="w-full mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
                        <FormContainer className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex gap-8 items-center mb-10 border-b pb-3 text-lg font-semibold">
                                {[
                                    { key: 'edit', label: 'Edit Existing Rider' },
                                    { key: 'add', label: 'Add New Riders' },
                                    { key: 'bulk-add', label: 'Bulk Add Rider' },
                                ].map((tab) => (
                                    <div
                                        key={tab.key}
                                        className={`pb-2 cursor-pointer transition-all duration-200 ${
                                            activeTab === tab.key
                                                ? 'border-b-2 border-green-500 text-green-600'
                                                : 'border-b-2 border-transparent text-gray-500 hover:text-green-600 hover:border-green-400'
                                        }`}
                                        onClick={() => {
                                            setActiveTab(tab.key as any)
                                            setIsAddRider(tab.key === 'add')
                                            setIsBulkAdd(tab.key === 'bulk-add')
                                        }}
                                    >
                                        {tab.label}
                                    </div>
                                ))}
                            </div>

                            {/* ================= Search Section ================= */}
                            {!isAddRider && (
                                <div className="mb-10 pl-4 border-l-4 border-blue-400 bg-gray-50 rounded-lg p-4">
                                    <div className="mb-6">
                                        <h5>Search Riders</h5>
                                    </div>
                                    <div className="flex  gap-4 items-center">
                                        <Input
                                            type="search"
                                            name="search"
                                            placeholder="Search riders..."
                                            value={searchInput}
                                            className="w-full"
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            onKeyDown={(e: any) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    setSearchOnEnter()
                                                }
                                            }}
                                        />
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                                            onClick={handleSearchWithIcon}
                                        >
                                            <HiSearch className="text-xl" />
                                        </button>

                                        <Dropdown
                                            title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                            className="bg-white shadow rounded-md"
                                            onSelect={(e) => handleSelect(e, setCurrentSelectedPage)}
                                        >
                                            {SearchRider?.map((item, key) => (
                                                <DropdownItem key={key} eventKey={item.value}>
                                                    {item.label}
                                                </DropdownItem>
                                            ))}
                                        </Dropdown>
                                    </div>
                                </div>
                            )}

                            {/* ================= Rider Details ================= */}
                            <div className="mb-10 pl-4 border-l-4 border-green-500 bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-green-700 mb-6">Rider Details</h3>

                                <FormContainer className="grid grid-cols-2 gap-6">
                                    {RiderFieldArray?.map((item, key) => (
                                        <FormItem key={key} label={item?.label}>
                                            <Field
                                                type={item.type}
                                                name={item.name}
                                                placeholder={`Enter ${item?.label}`}
                                                component={item.type === 'checkbox' ? Checkbox : Input}
                                                maxLength={item?.name === 'mobile' ? 10 : undefined}
                                                disabled={item?.name === 'mobile' && !isAddRider}
                                            />
                                        </FormItem>
                                    ))}
                                </FormContainer>
                            </div>

                            {/* ================= Store & Rider Type ================= */}
                            <div className="mb-10 pl-4 border-l-4 border-orange-400 bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-orange-700 mb-6">Store & Rider Type</h3>

                                <div className="grid grid-cols-2 gap-6">
                                    <StoreSelectForm isSingle label="Store Select" name="store" customCss="w-full" />

                                    <FormItem label="Rider Type">
                                        <Field name="rider_type">
                                            {({ form, field }: FieldProps) => (
                                                <Select
                                                    isClearable
                                                    className="w-full"
                                                    options={RiderTypeArray}
                                                    value={RiderTypeArray.find((o) => o.value === field.value) || null}
                                                    onChange={(val) => form.setFieldValue(field.name, val?.value)}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                            </div>

                            {/* ================= Shift & Agency ================= */}
                            <div className="mb-10 pl-4 border-l-4 border-purple-500 bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-purple-700 mb-6">Shift & Agency</h3>

                                <div className="grid grid-cols-2 gap-6">
                                    <FullTimePicker
                                        needClass
                                        customClass="w-full"
                                        fieldname="shift_start_time"
                                        label="SHIFT START"
                                        name="shift_start_time"
                                    />
                                    <FullTimePicker
                                        needClass
                                        customClass="w-full"
                                        fieldname="shift_end_time"
                                        label="SHIFT END"
                                        name="shift_end_time"
                                    />

                                    <FormItem label="Rider Agency">
                                        <Field name="agency">
                                            {({ field, form }: FieldProps<any>) => (
                                                <Select
                                                    isClearable
                                                    isSearchable
                                                    options={riderAgencyArray}
                                                    value={riderAgencyArray.find(
                                                        (o) => o.value?.toLowerCase() === field.value?.toLowerCase(),
                                                    )}
                                                    onChange={(opt) => form.setFieldValue(field.name, opt?.value || '')}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                    <CommonSelect name="delivery_type" options={RIDER_TYPES} label="Delivery Type" />
                                </div>
                            </div>

                            {/* ================= Zone ================= */}
                            <div className="mb-10 pl-4 border-l-4 border-yellow-400 bg-gray-50 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-yellow-700 mb-6">Rider Zone</h3>

                                <FormItem label="Select Rider Zone">
                                    <Field name="rider_zone">
                                        {({ form, field }: FieldProps) => (
                                            <Select
                                                isSearchable
                                                isClearable
                                                inputValue={searchZone}
                                                options={formattedData}
                                                value={formattedData?.find((o) => o.value === field.value)}
                                                onInputChange={handleSearch}
                                                onChange={(opt) => form.setFieldValue(field.name, opt?.value || '')}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </div>

                            <div className="pl-4 border-l-4 border-purple-500 bg-gray-50 rounded-lg p-6 mb-7">
                                <CommonAccordion startClosed header={<h3 className="text-lg font-bold text-red-700 mb-6">Rider KYC</h3>}>
                                    {/*  */}
                                    <RiderKyc isEdit={!isAddRider} values={values} />
                                </CommonAccordion>
                            </div>

                            {/* ================= Location ================= */}
                            <div className="pl-4 border-l-4 border-red-500 bg-gray-50 rounded-lg p-6">
                                <CommonAccordion
                                    startClosed
                                    header={<h3 className="text-lg font-bold text-red-700 mb-6">Rider Location</h3>}
                                >
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <Input
                                            name="lat"
                                            type="number"
                                            value={values.lat}
                                            placeholder="Latitude"
                                            onChange={(e) => setFieldValue('lat', Number(e.target.value))}
                                        />
                                        <Input
                                            name="long"
                                            type="number"
                                            value={values.long}
                                            placeholder="Longitude"
                                            onChange={(e) => setFieldValue('long', Number(e.target.value))}
                                        />
                                    </div>
                                    <AddRiderMap
                                        setMarkLat={(lat) => setFieldValue('lat', lat)}
                                        setMarkLong={(lng) => setFieldValue('long', lng)}
                                        markLat={values.lat as number}
                                        markLong={values.long as number}
                                    />
                                </CommonAccordion>
                            </div>
                        </FormContainer>

                        {/* ================= Submit ================= */}
                        <FormButton value="Submit" isSpinning={riderAddResponse.isLoading || riderEditResponse.isLoading} />
                    </Form>
                )}
            </Formik>
            {isBulkAdd && <AddBulk isOpen={isBulkAdd} setIsOpen={setIsBulkAdd} />}
        </div>
    )
}

export default AddRider
