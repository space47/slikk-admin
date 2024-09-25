/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik, FieldProps } from 'formik'
import Select from '@/components/ui/Select'
import { Button, Drawer } from '@/components/ui'
import { DIVISION_STATE } from '@/store/types/division.types'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { PRODUCTTYPE_STATE } from '@/store/types/productType.types'
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
}

const StockOverviewFilter = ({
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
}: PROPS) => {
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const subCategory = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)
    const product_type = useAppSelector<PRODUCTTYPE_STATE>((state) => state.product_type)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllBrandsAPI())
        // dispatch(getAllFiltersAPI())
    }, [])

    console.log('LIST', divisionList)

    const [initialValues, setInitialValues] = useState({
        division: divisionList,
        category: categroyList,
        sub_category: subCategoryList,
        product_type: productTypeList,
        brand: brandList,
    })

    const handleFilterEmpty = (resetForm: any) => {
        // Clear the form values
        resetForm({
            values: {
                division: [],
                category: [],
                sub_category: [],
                product_type: [],
                brand: [],
            },
        })

        // Clear the external state
        setDivisionList([])
        setCategoryList([])
        setSubCategoryList([])
        setProductTypeList([])
        setBrandList([])
        setTypeFetch('')
    }

    return (
        <div>
            <Drawer title="" isOpen={showDrawer} onClose={handleCloseDrawer} onRequestClose={handleCloseDrawer} lockScroll={false}>
                <Formik initialValues={initialValues} onSubmit={handleApply}>
                    {({ setFieldValue, values, resetForm }) => (
                        <Form className="flex flex-col gap-10 w-full items-center">
                            {/* Division */}
                            <Field name="division">
                                {({ field }: FieldProps<any>) => {
                                    const fieldValue = Array.isArray(field.value) ? field.value : []
                                    console.log('DIVISION FIELD', fieldValue)
                                    return (
                                        <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                            <div className="font-semibold">Division</div>
                                            <Select
                                                className="w-full"
                                                isMulti
                                                options={divisions.divisions}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id.toString()}
                                                defaultValue={divisions.divisions.filter((option) =>
                                                    fieldValue.some((item) => item === option.name),
                                                )}
                                                onChange={(newVal) => {
                                                    const selectedValues = newVal.map((item) => item.name) || []
                                                    setFieldValue('division', selectedValues)
                                                    handleMultiSelect('division', selectedValues)
                                                }}
                                            />
                                        </div>
                                    )
                                }}
                            </Field>

                            {/* Category */}
                            <Field name="category">
                                {({ field }: FieldProps<any>) => {
                                    const fieldValue = Array.isArray(field.value) ? field.value : []
                                    console.log('DATATAMAIN', category.categories)
                                    return (
                                        <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                            <div className="font-semibold">Category</div>
                                            <Select
                                                className="w-full"
                                                isMulti
                                                options={category.categories}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id.toString()}
                                                defaultValue={category.categories.filter((option) =>
                                                    fieldValue.some((item) => item === option.name),
                                                )}
                                                onChange={(newVal) => {
                                                    const selectedValues = newVal.map((item) => item.name) || []
                                                    setFieldValue('category', selectedValues)
                                                    handleMultiSelect('category', selectedValues)
                                                }}
                                            />
                                        </div>
                                    )
                                }}
                            </Field>

                            {/* Sub Category */}
                            <Field name="sub_category">
                                {({ field }: FieldProps<any>) => {
                                    const fieldValue = Array.isArray(field.value) ? field.value : []
                                    return (
                                        <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                            <div className="font-semibold">Sub Category</div>
                                            <Select
                                                className="w-full"
                                                isMulti
                                                options={subCategory.subcategories}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id.toString()}
                                                defaultValue={subCategory.subcategories.filter((option) =>
                                                    fieldValue.some((item) => item === option.name),
                                                )}
                                                onChange={(newVal) => {
                                                    const selectedValues = newVal.map((item) => item.name) || []
                                                    setFieldValue('sub_category', selectedValues)
                                                    handleMultiSelect('sub_category', selectedValues)
                                                }}
                                            />
                                        </div>
                                    )
                                }}
                            </Field>

                            <Field name="product_type">
                                {({ field }: FieldProps<any>) => {
                                    const fieldValue = Array.isArray(field.value) ? field.value : []
                                    return (
                                        <div className="flex flex-col gap-1 w-full items-center xl:items-baseline max-w-md">
                                            <div className="font-semibold">Product Type</div>
                                            <Select
                                                className="w-full"
                                                isMulti
                                                options={product_type.product_types}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id.toString()}
                                                defaultValue={product_type.product_types.filter((option) =>
                                                    fieldValue.some((item) => item === option.name),
                                                )}
                                                onChange={(newVal) => {
                                                    const selectedValues = newVal.map((item) => item.name) || []

                                                    console.log('PRODUCTYPE', selectedValues)
                                                    setFieldValue('product_type', selectedValues)
                                                    handleMultiSelect('product_type', selectedValues)
                                                }}
                                            />
                                        </div>
                                    )
                                }}
                            </Field>

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
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id.toString()}
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
                                <Button
                                    type="reset"
                                    variant="default"
                                    className="mt-4 p-2 rounded"
                                    onClick={() => handleFilterEmpty(resetForm)}
                                >
                                    Reset
                                </Button>

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

export default StockOverviewFilter
