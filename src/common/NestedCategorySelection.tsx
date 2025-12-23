/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Select } from '@/components/ui'
import { useAppSelector } from '@/store'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { DIVISION_STATE } from '@/store/types/division.types'
import { PRODUCTTYPE_STATE } from '@/store/types/productType.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface PROPS {
    values?: any
    setFieldValue: any
    isSub?: boolean
    isProductType?: boolean
}

const normalizeToIdArray = (value: any): number[] => {
    if (!value) return []
    if (Array.isArray(value)) {
        return value.map((v) => (typeof v === 'object' ? v.id : v))
    }

    if (typeof value === 'object') {
        return [value.id]
    }

    return [value]
}

const NestedCategorySelection = ({ setFieldValue, isProductType, isSub }: PROPS) => {
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const productType = useAppSelector<PRODUCTTYPE_STATE>((state) => state.product_type)
    const categories = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const subCategories = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)

    return (
        <div className="grid grid-cols-2 gap-10">
            {/* ================= Division ================= */}
            <FormContainer>
                <FormItem label="Division" className="w-full">
                    <Field name="division">
                        {({ field }: FieldProps) => {
                            const selectedIds = normalizeToIdArray(field.value)

                            const selectedOption = divisions.divisions?.find((item) => selectedIds.includes(item.id)) || null

                            return (
                                <Select
                                    isClearable
                                    value={selectedOption}
                                    options={divisions.divisions}
                                    getOptionLabel={(option) => option?.name}
                                    getOptionValue={(option) => option?.id?.toString()}
                                    onChange={(val) => setFieldValue('division', val ? [val] : [])}
                                />
                            )
                        }}
                    </Field>
                </FormItem>
            </FormContainer>

            {/* ================= Category ================= */}
            <FormContainer>
                <FormItem label="Category" className="w-full">
                    <Field name="category">
                        {({ field, form }: FieldProps<any>) => {
                            const selectedCategoryIds = normalizeToIdArray(field.value)

                            const selectedDivisionIds = normalizeToIdArray(form.values?.division)

                            const filteredCategories =
                                selectedDivisionIds.length > 0
                                    ? divisions.divisions
                                          ?.filter((div) => selectedDivisionIds.includes(div.id))
                                          ?.flatMap((div) => div.categories || [])
                                    : categories.categories

                            const selectedOption = filteredCategories?.find((cat) => selectedCategoryIds.includes(cat.id)) || null

                            return (
                                <Select
                                    isClearable
                                    value={selectedOption}
                                    options={filteredCategories}
                                    getOptionLabel={(option) => option?.name}
                                    getOptionValue={(option) => option?.id?.toString()}
                                    onChange={(val) => form.setFieldValue('category', val ? [val] : [])}
                                />
                            )
                        }}
                    </Field>
                </FormItem>
            </FormContainer>

            {/* ================= Sub Category ================= */}
            {isSub && (
                <FormContainer>
                    <FormItem label="Sub-Category" className="w-full">
                        <Field name="sub_category">
                            {({ field, form }: FieldProps<any>) => {
                                const selectedSubCategoryIds = normalizeToIdArray(field.value)

                                const selectedCategoryIds = normalizeToIdArray(form.values?.category)

                                const filteredSubCategories =
                                    selectedCategoryIds.length > 0
                                        ? divisions.divisions
                                              ?.flatMap((div) => div.categories || [])
                                              ?.filter((cat) => selectedCategoryIds.includes(cat.id))
                                              ?.flatMap((cat) => cat.sub_categories || [])
                                        : subCategories.subcategories

                                const selectedOption = filteredSubCategories?.find((sub) => selectedSubCategoryIds.includes(sub.id)) || null

                                return (
                                    <Select
                                        isClearable
                                        value={selectedOption}
                                        options={filteredSubCategories}
                                        getOptionLabel={(option) => option?.name}
                                        getOptionValue={(option) => option?.id?.toString()}
                                        onChange={(val) => form.setFieldValue('sub_category', val ? [val] : [])}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                </FormContainer>
            )}

            {/* ================= Product Type ================= */}
            {isProductType && (
                <FormContainer>
                    <FormItem label="Product Type" className="w-full">
                        <Field name="product_type">
                            {({ field }: FieldProps<any>) => {
                                const selectedIds = normalizeToIdArray(field.value)

                                const selectedOption = productType.product_types?.find((item) => selectedIds.includes(item.id)) || null

                                return (
                                    <Select
                                        isClearable
                                        value={selectedOption}
                                        options={productType.product_types}
                                        getOptionLabel={(option) => option?.name}
                                        getOptionValue={(option) => option?.id?.toString()}
                                        onChange={(val) => setFieldValue('product_type', val ? [val] : [])}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                </FormContainer>
            )}
        </div>
    )
}

export default NestedCategorySelection
