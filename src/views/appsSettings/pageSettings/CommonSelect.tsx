/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React, { useState, useMemo } from 'react'

interface SELECTPROPS {
    label?: string
    name: string
    options: any[]
    className?: string
    needClassName?: boolean
    requireOnChange?: boolean
    onChange?: any
    isSearch?: boolean
    asterisk?: boolean
    isMulti?: boolean
}

const CommonSelect = ({
    label,
    name,
    options,
    className,
    asterisk = false,
    needClassName = false,
    requireOnChange = false,
    onChange,
    isSearch = false,
    isMulti = false,
}: SELECTPROPS) => {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredOptions = useMemo(() => {
        if (!isSearch || !searchTerm.trim()) return options
        return options.filter((opt) => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [options, searchTerm, isSearch])

    return (
        <FormContainer>
            <FormItem label={label || ''} className={needClassName ? className : 'col-span-1 w-full'} asterisk={asterisk}>
                <Field name={name}>
                    {({ field, form }: FieldProps<any>) => {
                        const selectedValue = isMulti
                            ? filteredOptions.filter((option) => field.value?.includes(option.value))
                            : filteredOptions.find((option) => option.value === field.value)

                        return (
                            <Select
                                isClearable
                                isSearchable
                                isMulti={isMulti} // ✅ important
                                options={filteredOptions}
                                value={selectedValue}
                                onChange={(option: any) => {
                                    if (requireOnChange && onChange) {
                                        onChange(option)
                                        return
                                    }

                                    if (isMulti) {
                                        const values = option ? option.map((opt: any) => opt.value) : []
                                        form.setFieldValue(field.name, values)
                                    } else {
                                        const value = option ? option.value : ''
                                        form.setFieldValue(field.name, value)
                                    }
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                            />
                        )
                    }}
                </Field>
            </FormItem>
        </FormContainer>
    )
}

export default CommonSelect
