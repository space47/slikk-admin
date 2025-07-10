/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Select } from '@/components/ui'
import { useAppSelector } from '@/store'
// import { CATEGORY_STATE } from '@/store/types/category.types'
import { DIVISION_STATE } from '@/store/types/division.types'
import { PRODUCTTYPE_STATE } from '@/store/types/productType.types'
import { Field, FieldProps } from 'formik'
import React from 'react'

interface CATEGORYBANNERPROPS {
    setFieldValue: any
}

const BannerCategories = ({ setFieldValue }: CATEGORYBANNERPROPS) => {
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    // const categories = useAppSelector<CATEGORY_STATE>((state)=>state.category)
    const productType = useAppSelector<PRODUCTTYPE_STATE>((state) => state.product_type)

    return (
        <div className="grid grid-cols-2 gap-10">
            <FormContainer>
                <FormItem label="Division" className="col-span-1 w-full">
                    <Field name="division">
                        {({ field }: FieldProps) => {
                            const fieldValue = Array.isArray(field.value) ? field.value : []
                            const selectedIds = fieldValue.map((item) => item.id)
                            const selectedOption = divisions.divisions?.filter((item) => selectedIds.includes(item.id)) || []

                            return (
                                <Select
                                    isMulti
                                    field={field}
                                    value={selectedOption}
                                    options={divisions.divisions}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id.toString()}
                                    onChange={(newVal) => {
                                        setFieldValue('division', newVal)
                                    }}
                                />
                            )
                        }}
                    </Field>
                </FormItem>
            </FormContainer>
            <FormContainer>
                <FormItem label="Category" className="col-span-1 w-full">
                    <Field name="category">
                        {({ field, form }: FieldProps<any>) => {
                            const fieldValue = Array.isArray(field.value) ? field.value : []
                            const selectedCategoryIds = fieldValue.map((item) => item.id)
                            const selectedDivisions = form.values.division || []
                            const selectedDivisionIds = selectedDivisions.map((div: any) => div.id)
                            const filteredCategories =
                                divisions.divisions
                                    ?.filter((div) => selectedDivisionIds.includes(div.id))
                                    ?.map((div) => div.categories || [])
                                    ?.flat() || []

                            const selectedOption = filteredCategories.filter((cat) => selectedCategoryIds.includes(cat.id))
                            return (
                                <Select
                                    isMulti
                                    value={selectedOption}
                                    options={filteredCategories}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id.toString()}
                                    onChange={(newVal) => {
                                        form.setFieldValue('category', newVal || [])
                                    }}
                                />
                            )
                        }}
                    </Field>
                </FormItem>
            </FormContainer>
            <FormContainer>
                <FormItem label="Sub-Category" className="col-span-1 w-full">
                    <Field name="sub_category">
                        {({ field, form }: FieldProps<any>) => {
                            const fieldValue = Array.isArray(field.value) ? field.value : []
                            const selectedSubCategoriesId = fieldValue.map((item) => item.id) || []
                            const selectedCategories = form.values.category || []
                            const categoryId = selectedCategories?.map((item: any) => item?.id)
                            const filteredSubCategories =
                                divisions.divisions
                                    ?.flatMap((div) => div.categories || [])
                                    ?.filter((item) => categoryId?.includes(item?.id))
                                    ?.flatMap((item) => item?.sub_categories) || []

                            const selectedOption = filteredSubCategories.filter((cat) => {
                                return selectedSubCategoriesId.includes(cat.id)
                            })

                            return (
                                <Select
                                    isMulti
                                    value={selectedOption}
                                    options={filteredSubCategories}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) => option.id.toString()}
                                    onChange={(newVal) => {
                                        form.setFieldValue('sub_category', newVal || [])
                                    }}
                                />
                            )
                        }}
                    </Field>
                </FormItem>
            </FormContainer>
            <FormContainer>
                <FormItem label="Product Type" className="col-span-1 w-full">
                    <Field name="product_type">
                        {({ field }: FieldProps<any>) => {
                            return (
                                <Select
                                    isMulti
                                    field={field}
                                    defaultValue={productType?.product_types}
                                    options={productType?.product_types}
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
