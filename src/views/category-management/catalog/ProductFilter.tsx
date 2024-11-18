/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik, FieldProps } from 'formik'
import Select from '@/components/ui/Select'
import { Button, Drawer } from '@/components/ui'
import { BRAND_STATE } from '@/store/types/brand.types'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllBrandsAPI } from '@/store/action/brand.action'

interface PROPS {
    showDrawer: boolean
    handleCloseDrawer: any
    handleApply: any
    handleMultiSelect: any
    divisionList: any
    categroyList: any
    productTypeList: any
    brandList: any
    subCategoryList: any
    setDivisionList: any
    setCategoryList: any
    setSubCategoryList: any
    setProductTypeList: any
    setBrandList: any
    setTypeFetch: any
    setFilteredCategories: any
    setFilteredProductTypes: any
    setFilteredSubCategories: any
    filteredCategories: any
    filteredProductTypes: any
    filteredSubCategories: any
    options: any
}

const ProductFilterNest = ({
    showDrawer,
    handleCloseDrawer,
    handleApply,
    handleMultiSelect,
    divisionList,
    categroyList,
    productTypeList,
    brandList,
    subCategoryList,
    setDivisionList,
    setCategoryList,
    setSubCategoryList,
    setTypeFetch,
    setBrandList,
    setProductTypeList,
    setFilteredCategories,
    setFilteredProductTypes,
    setFilteredSubCategories,
    filteredCategories,
    filteredProductTypes,
    filteredSubCategories,
    options,
}: PROPS) => {
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllBrandsAPI())
        // dispatch(getAllFiltersAPI())
    }, [])

    useEffect(() => {
        if (showDrawer) {
            setInitialValues({
                division: [],
                category: [],
                sub_category: [],
                product_type: [],
                brand: [],
            })
        }
    }, [showDrawer])

    const [initialValues, setInitialValues] = useState({
        division: divisionList,
        category: categroyList,
        sub_category: subCategoryList,
        product_type: productTypeList,
        brand: brandList,
    })

    // const handleFilterEmpty = (resetForm: any) => {
    //     // Clear the form values
    //     resetForm({
    //         values: {
    //             division: [],
    //             category: [],
    //             sub_category: [],
    //             product_type: [],
    //             brand: [],
    //         },
    //     })

    //     // Clear the external state
    //     setDivisionList([])
    //     setCategoryList([])
    //     setSubCategoryList([])
    //     setProductTypeList([])
    //     setBrandList([])
    //     setTypeFetch('')
    // }

    return (
        <div>
            <Drawer title="" isOpen={showDrawer} onClose={handleCloseDrawer} onRequestClose={handleCloseDrawer} lockScroll={false}>
                <Formik initialValues={initialValues} onSubmit={handleApply} enableReinitialize>
                    {({ setFieldValue, values, resetForm }) => (
                        <Form className="flex flex-col gap-10 w-full items-start">
                            {/* Division */}

                            <FormItem asterisk label="Division" className="col-span-1 w-full">
                                <Field name="division">
                                    {({ field }: FieldProps) => {
                                        console.log('FieldValue ', field.value)
                                        return (
                                            <Select
                                                isMulti
                                                className="w-full"
                                                field={field}
                                                options={options} //divisions.divisions
                                                getOptionLabel={(option: any) => option?.name}
                                                defaultValue={field.value || []}
                                                getOptionValue={(option) => option.id?.toString() || ''}
                                                onChange={(newVal) => {
                                                    setFieldValue('division', newVal ? newVal : [])
                                                    setDivisionList(newVal?.map((item) => item.name))

                                                    const selectedDivision = newVal
                                                        ? newVal.map((division) => division.categories).flat()
                                                        : []

                                                    setFieldValue('category', [])
                                                    setFieldValue('sub_category', [])
                                                    setFieldValue('product_type', [])
                                                    setFilteredCategories(selectedDivision)
                                                }}
                                            />
                                        )
                                    }}
                                </Field>
                            </FormItem>

                            {/* CATEGORY ...................................... */}

                            <FormItem asterisk label="Category" className="col-span-1 w-full">
                                <Field name="category">
                                    {({ field }: FieldProps<any>) => {
                                        return (
                                            <Select
                                                isMulti
                                                className="w-full"
                                                field={field}
                                                defaultValue={field.value || []}
                                                options={filteredCategories}
                                                getOptionLabel={(option: any) => option.name}
                                                getOptionValue={(option) => option.id?.toString() || ''}
                                                onChange={(newVal) => {
                                                    setFieldValue('category', newVal ? newVal : [])
                                                    setCategoryList(newVal?.map((item) => item.name))

                                                    const selectedSubCategories = newVal
                                                        ? newVal.map((category) => category.sub_categories).flat()
                                                        : []

                                                    setFieldValue('sub_category', [])
                                                    setFieldValue('product_type', [])
                                                    setFilteredSubCategories(selectedSubCategories)
                                                }}
                                            />
                                        )
                                    }}
                                </Field>
                            </FormItem>

                            {/* SUB-CATEGORY ...................................... */}

                            <FormItem asterisk label="Sub-Category" className="col-span-1 w-full">
                                <Field name="sub_category">
                                    {({ field }: FieldProps<any>) => {
                                        return (
                                            <Select
                                                isMulti
                                                className="w-full"
                                                field={field}
                                                defaultValue={field.value || []}
                                                options={filteredSubCategories}
                                                getOptionLabel={(option: any) => option?.name}
                                                getOptionValue={(option) => option?.id?.toString() || ''}
                                                onChange={(newVal) => {
                                                    setFieldValue('sub_category', newVal ? newVal : [])
                                                    setSubCategoryList(newVal?.map((item) => item.name))
                                                    const selectedProductTypes = newVal
                                                        ? newVal.map((sub_category) => sub_category?.product_types)?.flat()
                                                        : []

                                                    setFieldValue('product_type', [])

                                                    setFilteredProductTypes(selectedProductTypes)
                                                }}
                                            />
                                        )
                                    }}
                                </Field>
                            </FormItem>

                            {/* PRODUCT TYPE ...................................... */}

                            <FormItem asterisk label="Product Type" className="col-span-1 w-full">
                                <Field name="product_type">
                                    {({ field }: FieldProps<any>) => {
                                        return (
                                            <Select
                                                isMulti
                                                className="w-full"
                                                field={field}
                                                defaultValue={field.value || []}
                                                options={filteredProductTypes}
                                                getOptionLabel={(option: any) => option?.name}
                                                getOptionValue={(option) => option?.id?.toString() || ''}
                                                onChange={(newVal) => {
                                                    setFieldValue('product_type', newVal ? newVal : [])
                                                    setProductTypeList(newVal?.map((item) => item.name))
                                                }}
                                            />
                                        )
                                    }}
                                </Field>
                            </FormItem>

                            <Field name="brand">
                                {({ field }: FieldProps<any>) => {
                                    const fieldValue = Array.isArray(field.value) ? field.value : []
                                    return (
                                        <div className="flex flex-col gap-1 w-full items-center xl:items-baseline max-w-md">
                                            <div className="font-semibold">Brands</div>
                                            <Select
                                                className="w-full"
                                                isMulti
                                                options={brands.brands}
                                                getOptionLabel={(option) => option?.name}
                                                getOptionValue={(option) => option?.id?.toString()}
                                                defaultValue={brands.brands.filter((option) =>
                                                    fieldValue.some((item) => item === option.name),
                                                )}
                                                onChange={(newVal) => {
                                                    const selectedValues = newVal.map((item) => item.name) || []
                                                    setFieldValue('brand', selectedValues)
                                                    handleMultiSelect('brand', selectedValues)
                                                }}
                                            />
                                        </div>
                                    )
                                }}
                            </Field>

                            <FormContainer className="flex gap-5 justify-end ">
                                <Button type="submit" variant="new" className="mt-4 bg-blue-500 text-white p-2 rounded">
                                    APPLY
                                </Button>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </Drawer>
        </div>
    )
}

export default ProductFilterNest
