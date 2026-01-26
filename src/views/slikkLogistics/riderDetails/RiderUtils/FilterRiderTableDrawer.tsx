/* eslint-disable @typescript-eslint/no-explicit-any */
import { Drawer, FormItem, Select } from '@/components/ui'
import { DeliveryType, RIDER_TYPES_FILTER, RiderAgency } from '../RiderDetailsCommon'
import { TimePicker } from 'antd'
import dayjs from 'dayjs'
import ZoneSelectComponent from '@/common/ZoneSelectCommon'
import { useEffect, useState } from 'react'
import { deliveryAgency } from '@/store/services/deliveryAgencyService'

interface props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    currentAgency: string
    setCurrentAgency: (x: string) => void
    shiftStart: string
    setShiftStart: (x: string) => void
    shiftEnd: string
    setShiftEnd: (x: string) => void
    riderType: string
    setRiderType: (x: string) => void
    zoneId: number[]
    setZoneId: (x: number[]) => void
}

const FilterRiderTableDrawer = ({
    isOpen,
    setIsOpen,
    currentAgency,
    setCurrentAgency,
    setShiftEnd,
    setShiftStart,
    shiftEnd,
    shiftStart,
    riderType,
    setRiderType,
    zoneId,
    setZoneId,
}: props) => {
    const [riderAgencyArray, setRiderAgencyArray] = useState<DeliveryType[]>([])

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

    return (
        <Drawer
            title="Rider Filters"
            lockScroll={false}
            className="xl:mx-0 mx-8"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onRequestClose={() => setIsOpen(false)}
        >
            <div>
                <FormItem label="Rider Type" className="mb-10">
                    <Select
                        isClearable
                        isSearchable
                        options={RIDER_TYPES_FILTER}
                        className="mt-5"
                        defaultValue={RIDER_TYPES_FILTER.find((option) => option.value === riderType)}
                        onChange={(val) => {
                            if (val) {
                                setRiderType(val?.value)
                            } else {
                                setRiderType('')
                            }
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    />
                </FormItem>
                <FormItem label="Select Agency" className="mb-10">
                    <Select
                        isClearable
                        isSearchable
                        className="mt-5"
                        options={riderAgencyArray}
                        value={riderAgencyArray.find((o) => o.value?.toLowerCase() === currentAgency?.toLowerCase())}
                        onChange={(val) => {
                            if (val) {
                                setCurrentAgency(val?.value as string)
                            } else {
                                setCurrentAgency('')
                            }
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    />
                </FormItem>

                <FormItem label="Shift Start" className="mb-6">
                    <TimePicker
                        placeholder="Select Start Time"
                        className="w-full"
                        format="HH:mm:ss"
                        value={shiftStart ? dayjs(shiftStart, 'HH:mm:ss') : undefined}
                        onChange={(value) => {
                            if (value) {
                                setShiftStart(value.format('HH:mm:ss'))
                            } else {
                                setShiftStart('')
                            }
                        }}
                    />
                </FormItem>

                <FormItem label="Shift End">
                    <TimePicker
                        placeholder="Select End Time"
                        className="w-full"
                        format="HH:mm:ss"
                        value={shiftEnd ? dayjs(shiftEnd, 'HH:mm:ss') : undefined}
                        onChange={(value) => {
                            if (value) {
                                setShiftEnd(value.format('HH:mm:ss'))
                            } else {
                                setShiftEnd('')
                            }
                        }}
                    />
                </FormItem>
                <ZoneSelectComponent label="Select Zone" setZone={setZoneId} zone={zoneId} />
            </div>
        </Drawer>
    )
}

export default FilterRiderTableDrawer
