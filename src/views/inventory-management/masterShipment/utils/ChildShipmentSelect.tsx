/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import { shipmentService } from '@/store/services/shipmentService'
import { ShipmentData } from '@/store/types/shipment.types'
import { Field, FieldProps } from 'formik'
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState, useCallback } from 'react'
import { MultiValue } from 'react-select'

interface Props {
    shipmentId: number[]
    setShipmentId: Dispatch<SetStateAction<number[]>>
}

const ChildShipmentSelect: React.FC<Props> = ({ setShipmentId, shipmentId }) => {
    const [shipmentData, setShipmentData] = useState<ShipmentData[]>([])
    const [searchInput, setSearchInput] = useState('')
    const [selectedOptionsState, setSelectedOptionsState] = useState<MultiValue<any>>([])

    const [queryParams, setQueryParams] = useState({
        page: 1,
        pageSize: 100,
        shipment_id: '',
        available_for_master: true,
    })

    const { data, isSuccess } = shipmentService.useGetShipmentListQuery(queryParams)

    /**
     * ✅ Set API Data
     */
    useEffect(() => {
        if (isSuccess && data?.data?.results) {
            setShipmentData(data.data.results)
        }
    }, [isSuccess, data])

    /**
     * ✅ Create formatted API options
     */
    const apiOptions = useMemo(() => {
        return shipmentData.map((item) => ({
            label: `${item.name} (${item.shipment_id})`,
            value: item.id,
        }))
    }, [shipmentData])

    /**
     * ✅ Merge selected + API options (no duplicates)
     */
    const formattedData = useMemo(() => {
        const map = new Map<number, any>()

        ;[...selectedOptionsState, ...apiOptions].forEach((item) => {
            map.set(item.value, item)
        })

        return Array.from(map.values())
    }, [apiOptions, selectedOptionsState])

    /**
     * ✅ Set initial selected options from shipmentId
     */
    useEffect(() => {
        if (shipmentId.length && apiOptions.length) {
            const initialSelected = apiOptions.filter((option) => shipmentId.includes(option.value))

            setSelectedOptionsState(initialSelected)
        }
    }, [shipmentId, apiOptions])

    /**
     * ✅ Handle Search (debounce can be added later)
     */
    const handleSearch = useCallback((inputValue: string) => {
        setSearchInput(inputValue)

        setQueryParams((prev) => ({
            ...prev,
            shipment_id: inputValue,
        }))
    }, [])

    return (
        <FormItem label="" className="col-span-1 w-full">
            <Field name="child_shipments">
                {({ form }: FieldProps) => (
                    <Select
                        isSearchable
                        isMulti
                        isClearable
                        options={formattedData}
                        value={selectedOptionsState}
                        inputValue={searchInput}
                        onInputChange={handleSearch}
                        onChange={(selected) => {
                            const selectedArray = selected || []
                            const ids = selectedArray.map((item: any) => item.value)

                            setSelectedOptionsState(selectedArray)
                            setShipmentId(ids)

                            // ✅ FIXED field name
                            form.setFieldValue('child_shipments', ids)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') e.preventDefault()
                        }}
                    />
                )}
            </Field>
        </FormItem>
    )
}

export default ChildShipmentSelect
