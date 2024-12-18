/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface CATEGORYBANNERPROPS {
    initialValue: any
    options: any
    setFieldValue: any
    setFilteredCategories: any
    filteredCategories: any
    setFilteredSubCategories: any
    filteredSubCategories: any
    setFilteredProductTypes: any
    filteredProductTypes: any
}

const BannerCategories = ({
    initialValue,
    options,
    setFieldValue,
    setFilteredCategories,
    setFilteredProductTypes,
    setFilteredSubCategories,
    filteredCategories,
    filteredProductTypes,
    filteredSubCategories,
}: CATEGORYBANNERPROPS) => {
    return (
        <div className="grid grid-cols-2 gap-10">
            <FormContainer>
                <FormItem label="Division" className="col-span-1 w-full">
                    <Field name="division">
                        {({ field }: FieldProps) => {
                            const fieldValue = Array.isArray(field.value) ? field.value : []

                            return (
                                <Select
                                    isMulti
                                    field={field}
                                    defaultValue={initialValue.division.filter((option) =>
                                        fieldValue.some((item) => item.name === option.name),
                                    )}
                                    options={options} //divisions.divisions
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id.toString()}
                                    onChange={(newVal) => {
                                        setFieldValue('division', newVal ? newVal : [])

                                        // Get selected division's categories
                                        const selectedDivision = newVal ? newVal.map((division) => division.categories).flat() : []

                                        // Reset category, sub-category, and product type fields
                                        setFieldValue('category', [])
                                        setFieldValue('sub_category', [])
                                        setFieldValue('product_type', [])

                                        // Update the filtered categories
                                        setFilteredCategories(selectedDivision)
                                    }}
                                />
                            )
                        }}
                    </Field>
                </FormItem>
            </FormContainer>

            {/* CATEGORY ...................................... */}
            <FormContainer>
                <FormItem label="Category" className="col-span-1 w-full">
                    <Field name="category">
                        {({ field }: FieldProps<any>) => {
                            const fieldValue = Array.isArray(field.value) ? field.value : []

                            return (
                                <Select
                                    isMulti
                                    field={field}
                                    defaultValue={filteredCategories}
                                    options={filteredCategories} // Use the filtered categories here
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id.toString()}
                                    onChange={(newVal) => {
                                        setFieldValue('category', newVal ? newVal : [])

                                        const selectedSubCategories = newVal ? newVal.map((category) => category.sub_categories).flat() : []

                                        setFieldValue('sub_category', [])
                                        setFieldValue('product_type', [])

                                        setFilteredSubCategories(selectedSubCategories)
                                    }}
                                />
                            )
                        }}
                    </Field>
                </FormItem>
            </FormContainer>

            {/* SUB-CATEGORY ...................................... */}
            <FormContainer>
                <FormItem label="Sub-Category" className="col-span-1 w-full">
                    <Field name="sub_category">
                        {({ field }: FieldProps<any>) => {
                            const fieldValue = Array.isArray(field.value) ? field.value : []

                            return (
                                <Select
                                    isMulti
                                    field={field}
                                    defaultValue={filteredSubCategories}
                                    options={filteredSubCategories}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id.toString()}
                                    onChange={(newVal) => {
                                        setFieldValue('sub_category', newVal ? newVal : [])

                                        const selectedProductTypes = newVal
                                            ? newVal.map((sub_category) => sub_category.product_types).flat()
                                            : []

                                        setFieldValue('product_type', [])

                                        setFilteredProductTypes(selectedProductTypes)
                                    }}
                                />
                            )
                        }}
                    </Field>
                </FormItem>
            </FormContainer>

            {/* PRODUCT TYPE ...................................... */}
            <FormContainer>
                <FormItem label="Product Type" className="col-span-1 w-full">
                    <Field name="product_type">
                        {({ field }: FieldProps<any>) => {
                            const fieldValue = Array.isArray(field.value) ? field.value : []

                            return (
                                <Select
                                    isMulti
                                    field={field}
                                    defaultValue={filteredProductTypes}
                                    options={filteredProductTypes}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id.toString()}
                                    onChange={(newVal) => {
                                        setFieldValue('product_type', newVal ? newVal : [])
                                    }}
                                />
                            )
                        }}
                    </Field>
                </FormItem>
            </FormContainer>
        </div>
    )
}

export default BannerCategories
