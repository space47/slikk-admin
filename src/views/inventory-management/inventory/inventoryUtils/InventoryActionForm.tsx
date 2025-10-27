/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { BRAND_STATE } from '@/store/types/brand.types'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { DIVISION_STATE } from '@/store/types/division.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { Field, FormikErrors } from 'formik'
import React, { useEffect } from 'react'

interface props {
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<any>>
}

const InventoryActionForm = ({ setFieldValue }: props) => {
    const dispatch = useAppDispatch()
    const division = useAppSelector<DIVISION_STATE>((state) => state.division)
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const subCategory = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)

    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [dispatch])

    return (
        <FormContainer>
            <FormItem label="Rack Number">
                <Field name="row" type="text" placeholder="Enter Rack Number" component={Input} />
            </FormItem>
            <FormItem label="Location">
                <Field name="location" type="text" placeholder="Enter Location" component={Input} />
            </FormItem>
            <FormItem label="Company" asterisk>
                <Field name="companyList">
                    {() => {
                        return (
                            <Select
                                isMulti
                                className="w-full"
                                options={companyList}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id?.toString()}
                                onChange={(newVal) => {
                                    const selectedValues = newVal
                                    setFieldValue('companyList', selectedValues)
                                }}
                            />
                        )
                    }}
                </Field>
            </FormItem>

            <FormItem label="Brand">
                <div className="flex flex-col xl:flex-row items-start gap-2">
                    <Select
                        options={brands.brands}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id.toString()}
                        className="w-full"
                        onChange={(val) => {
                            setFieldValue('brand', val)
                        }}
                    />
                </div>
            </FormItem>
            <FormItem label="Division">
                <div className="flex flex-col xl:flex-row items-start gap-2">
                    <Select
                        options={division.divisions}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option?.id?.toString()}
                        className="w-full"
                        onChange={(val) => {
                            setFieldValue('division', val)
                        }}
                    />
                </div>
            </FormItem>
            <FormItem label="Category">
                <div className="flex flex-col xl:flex-row items-start gap-2">
                    <Select
                        options={category.categories}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option?.id?.toString()}
                        className="w-full"
                        onChange={(val) => {
                            setFieldValue('category', val)
                        }}
                    />
                </div>
            </FormItem>
            <FormItem label="Sub Category">
                <div className="flex flex-col xl:flex-row items-start gap-2">
                    <Select
                        options={subCategory.subcategories}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option?.id?.toString()}
                        className="w-full"
                        onChange={(val) => {
                            setFieldValue('sub_categories', val)
                        }}
                    />
                </div>
            </FormItem>
        </FormContainer>
    )
}

export default InventoryActionForm
