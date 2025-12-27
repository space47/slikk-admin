import { Drawer, FormItem, Select } from '@/components/ui'
import { RIDER_TYPES, RiderAgency } from '../RiderDetailsCommon'
import { TimePicker } from 'antd'
import dayjs from 'dayjs'
import ZoneSelectComponent from '@/common/ZoneSelectCommon'

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
                        options={RIDER_TYPES}
                        className="mt-5"
                        defaultValue={RIDER_TYPES.find((option) => option.value === riderType)}
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
                        options={RiderAgency}
                        className="mt-5"
                        defaultValue={RiderAgency.find((option) => option.value === currentAgency)}
                        onChange={(val) => {
                            if (val) {
                                setCurrentAgency(val?.value)
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
