/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { IoMdAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'

interface props {
    handleAddFilter: any
    showAddFilter: any[]
    handleAddFilters: any
    handleRemoveFilter: any
    filters: any[]
}

const SearchStrings = ({ handleAddFilter, showAddFilter, handleAddFilters, handleRemoveFilter, filters }: props) => {
    return (
        <div>
            <FormItem label="SEARCH STRINGS">
                <FormContainer className="items-center mt-4">
                    <button onClick={handleAddFilter} type="button">
                        <IoMdAddCircle className="text-3xl text-green-500" />
                    </button>
                </FormContainer>

                {showAddFilter.map((_, index: any) => (
                    <FormItem key={index} className="flex  gap-2">
                        <div className="flex gap-3 items-center">
                            <Field name={`filtersAdd[${index}]`} key={index}>
                                {({ field, form }: FieldProps<any>) => (
                                    <Select
                                        isMulti
                                        placeholder={`Filter Tags ${index + 1}`}
                                        options={filters}
                                        getOptionLabel={(option) => option.label}
                                        getOptionValue={(option) => option.value}
                                        onChange={(newVal) => {
                                            const newValues = newVal ? newVal.map((val) => val.value) : []
                                            form.setFieldValue(field.name, newValues)
                                        }}
                                        className="w-3/4"
                                    />
                                )}
                            </Field>
                            <div className="">
                                <button type="button" className="" onClick={() => handleRemoveFilter(index)}>
                                    <MdCancel className="text-xl text-red-500" />
                                </button>
                            </div>
                        </div>
                    </FormItem>
                ))}

                {showAddFilter.length > 0 && (
                    <>
                        <Field>
                            {({ form }: FieldProps<any>) => (
                                <Button variant="new" onClick={() => handleAddFilters(form.values)} type="button">
                                    Search Strings
                                </Button>
                            )}
                        </Field>
                    </>
                )}
            </FormItem>
        </div>
    )
}

export default SearchStrings
