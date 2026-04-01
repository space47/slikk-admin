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
    const [isInitialized, setIsInitialized] = useState(false)

    const [queryParams, setQueryParams] = useState({
        page: 1,
        pageSize: 100,
        shipment_id: '',
        available_for_master: true,
    })

    const { data, isSuccess } = shipmentService.useGetShipmentListQuery(queryParams)

    useEffect(() => {
        if (isSuccess && data?.data?.results) {
            setShipmentData(data.data.results)
        }
    }, [isSuccess, data])

    const formattedData = useMemo(() => {
        const apiOptions = shipmentData.map((item) => ({
            label: `${item.name} (${item.shipment_id})`,
            value: item.id,
        }))
        const merged = [...selectedOptionsState]

        apiOptions.forEach((opt) => {
            if (!merged.some((m) => m.value === opt.value)) {
                merged.push(opt)
            }
        })

        return merged
    }, [shipmentData, selectedOptionsState])

    // Initialize selected options when both shipmentId and formattedData are available
    useEffect(() => {
        if (shipmentId?.length > 0 && formattedData?.length > 0 && !isInitialized) {
            const initialSelected = formattedData.filter((option) => shipmentId.includes(option.value))
            if (initialSelected.length > 0) {
                setSelectedOptionsState(initialSelected)
                setIsInitialized(true)
            }
        }
    }, [shipmentId, formattedData, isInitialized])

    // Handle case when shipmentId is empty but we have data (for clearing selection)
    useEffect(() => {
        if (isInitialized && shipmentId?.length === 0) {
            setSelectedOptionsState([])
        }
    }, [shipmentId, isInitialized])

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
                            const ids = selectedArray.map((item) => item.value)

                            setSelectedOptionsState(selectedArray)
                            setShipmentId(ids)
                            form.setFieldValue('child_shipment', ids)
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    />
                )}
            </Field>
        </FormItem>
    )
}

export default ChildShipmentSelect
