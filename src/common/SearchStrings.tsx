/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Select, Upload } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { IoMdAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import { beforeUpload } from './beforeUpload'

interface props {
    handleAddFilter: any
    showAddFilter: any[]
    handleAddFilters: any
    handleRemoveFilter: any
    filters: any[]
    setCsvFile: any
    values: any
}

const SearchStrings = ({ handleAddFilter, showAddFilter, handleAddFilters, handleRemoveFilter, filters, setCsvFile, values }: props) => {
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

                <FormItem label="" className="grid grid-rows-2">
                    <Field name="csvList">
                        {({ form }: FieldProps<any>) => (
                            <>
                                <div className="font-semibold flex justify-center">Upload Csv</div>
                                <Upload
                                    beforeUpload={beforeUpload}
                                    fileList={values.csvList} // uploadedd the file
                                    className="flex justify-center"
                                    onFileRemove={(files) => {
                                        form.setFieldValue('csvList', files)
                                    }}
                                    onChange={(files) => {
                                        form.setFieldValue('csvList', files)
                                        setCsvFile(files)
                                    }}
                                />
                            </>
                        )}
                    </Field>
                </FormItem>

                <>
                    <Field>
                        {({ form }: FieldProps<any>) => (
                            <Button variant="new" onClick={() => handleAddFilters(form.values)} type="button">
                                Search Strings
                            </Button>
                        )}
                    </Field>
                </>
            </FormItem>
        </div>
    )
}

export default SearchStrings
