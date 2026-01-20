/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Select } from '@/components/ui'
import { riderZoneService } from '@/store/services/riderZoneService'
import React, { useMemo, useState } from 'react'

interface OptionType {
    label: string
    value: number
}

interface Props {
    label: string
    zone: number | number[]
    setZone: (val: number | number[] | any) => void
    customCss?: string
    isSingle?: boolean
}

const ZoneSelectComponent = ({ label, zone, setZone, customCss, isSingle = false }: Props) => {
    const [queryParams, setQueryParams] = useState({
        page: 1,
        pageSize: 10,
        name: '',
    })

    const { data } = riderZoneService.useLiveZonesQuery(queryParams, {
        refetchOnMountOrArgChange: true,
    })

    const formattedData: OptionType[] = useMemo(() => {
        return (
            data?.results?.map((item: any) => ({
                label: item.name,
                value: item.id,
            })) ?? []
        )
    }, [data])

    const handleSearch = (inputValue: string) => {
        setQueryParams((prev) => ({
            ...prev,
            name: inputValue,
            page: 1,
        }))
    }

    const selectedZone = useMemo(() => {
        if (isSingle) {
            return formattedData.find((opt) => opt.value === zone) ?? null
        }

        if (Array.isArray(zone)) {
            return formattedData.filter((opt) => zone.includes(opt.value))
        }

        return []
    }, [formattedData, zone, isSingle])

    return (
        <FormContainer>
            <FormItem label={label}>
                <Select
                    isClearable
                    isSearchable
                    isMulti={!isSingle}
                    placeholder="Select Zone"
                    className={customCss ?? 'w-full'}
                    options={formattedData}
                    value={selectedZone}
                    getOptionLabel={(option: OptionType) => option.label}
                    getOptionValue={(option: OptionType) => option.value.toString()}
                    onInputChange={(value, action) => {
                        if (action.action === 'input-change') {
                            handleSearch(value)
                        }
                    }}
                    onChange={(val: any) => {
                        if (isSingle) {
                            setZone(val?.value ?? null)
                        } else {
                            setZone(val?.map((item: OptionType) => item.value) ?? [])
                        }
                    }}
                />
            </FormItem>
        </FormContainer>
    )
}

export default ZoneSelectComponent
