/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Field, FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'

interface props {
    name: string
    label: string
    searchInputs?: string
    index?: number
    handleSearch?: any
    isMulti?: boolean
}

const SearchableGroups = ({ label, name, index, handleSearch, searchInputs, isMulti }: props) => {
    const [groupData, setGroupData] = useState<any[]>([])

    const fetchGroupNotification = async (inputValue = '') => {
        let filter = ''
        if (inputValue) {
            filter = `&group_name=${inputValue}`
        }
        try {
            const response = await axioisInstance.get(`/notification/groups?p=1&page_size=10&is_active=true${filter}`)
            const data = response?.data?.data
            setGroupData(data?.results)
        } catch (error: any) {
            console.log(error)
        }
    }

    const formattedData = groupData.map((group) => ({
        value: group.id,
        label: group.name,
    }))

    useEffect(() => {
        fetchGroupNotification(searchInputs)
    }, [searchInputs])

    return (
        <div>
            <FormItem label={label} className="col-span-1 w-full">
                <Field name={name}>
                    {({ form, field }: FieldProps) => {
                        return (
                            <Select
                                isSearchable
                                isClearable
                                isMulti={isMulti}
                                inputValue={searchInputs}
                                options={formattedData}
                                value={
                                    isMulti
                                        ? formattedData.filter((option) =>
                                              Array.isArray(field.value) ? field.value.includes(option.value) : false,
                                          )
                                        : formattedData.find((option) => option.value === field.value) || null
                                }
                                onInputChange={(inputValue: string) => (index ? handleSearch(inputValue, index) : handleSearch(inputValue))}
                                onChange={(selectedOption: any) => {
                                    if (isMulti) {
                                        const values = selectedOption ? selectedOption.map((opt: any) => opt.value) : []
                                        form.setFieldValue(field.name, values)
                                    } else {
                                        const value = selectedOption ? selectedOption.value : ''
                                        form.setFieldValue(field.name, value)
                                    }
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                            />
                        )
                    }}
                </Field>
            </FormItem>
        </div>
    )
}

export default SearchableGroups
