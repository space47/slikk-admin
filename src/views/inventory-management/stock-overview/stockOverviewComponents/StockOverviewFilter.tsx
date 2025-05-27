/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { FormContainer } from '@/components/ui/Form'
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
    categoryList: any
    productTypeList: any
    brandList: any
    subCategoryList: any
}

const StockOverviewFilter = ({
    showDrawer,
    handleCloseDrawer,
    handleApply,
    handleMultiSelect,
    divisionList,
    categoryList: categoryList,
    productTypeList,
    brandList,
    subCategoryList,
}: PROPS) => {
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const subCategory = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)
    const product_type = useAppSelector<PRODUCTTYPE_STATE>((state) => state.product_type)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [dispatch])

    const initialValues = {
        division: divisionList,
        category: categoryList,
        sub_category: subCategoryList,
        product_type: productTypeList,
        brand: brandList,
    }

    return (
        <div>
            <Drawer lockScroll={false} title="" isOpen={showDrawer} onClose={handleCloseDrawer} onRequestClose={handleCloseDrawer}>
                <Formik initialValues={initialValues} onSubmit={handleApply}>
                    {({ setFieldValue }) => (
                        <Form className="flex flex-col gap-10 w-full items-center">
                            {/* Division */}
                            <Field name="division">
                                {({ field }: FieldProps<any>) => {
                                    const fieldValue = Array.isArray(field.value) ? field.value : []

                                    return (
                                        <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                            <div className="font-semibold">Division</div>
                                            <Select
                                                isMulti
                                                className="w-full"
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
                                    let divFilteredCategories = category.categories
                                    if (divisionList.length > 0) {
                                        divFilteredCategories = category.categories.filter((option) => {
                                            return divisionList.some((item: any) => item === option.division_name)
                                        })
                                    }

                                    return (
                                        <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                            <div className="font-semibold">Category</div>
                                            <Select
                                                isMulti
                                                className="w-full"
                                                options={divFilteredCategories}
                                                getOptionLabel={(option) => option?.name}
                                                getOptionValue={(option) => option?.id}
                                                value={divFilteredCategories.filter((option) => {
                                                    return fieldValue.some((item) => {
                                                        return item === option.name
                                                    })
                                                })}
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
                                    let catFilteredSubCat = subCategory.subcategories
                                    if (categoryList.length > 0) {
                                        catFilteredSubCat = subCategory.subcategories.filter((option) => {
                                            return categoryList.some((item: any) => item === option.category_name)
                                        })
                                    }
                                    return (
                                        <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                            <div className="font-semibold">Sub Category</div>
                                            <Select
                                                isMulti
                                                className="w-full"
                                                options={catFilteredSubCat}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id.toString()}
                                                defaultValue={catFilteredSubCat.filter((option) =>
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
                                    let subCatFilteredProductTypes = product_type.product_types
                                    if (subCategoryList.length > 0) {
                                        subCatFilteredProductTypes = product_type.product_types.filter((option) => {
                                            return subCategoryList.some((item: any) => item === option.sub_category_name)
                                        })
                                    }

                                    return (
                                        <div className="flex flex-col gap-1 w-full items-center xl:items-baseline max-w-md">
                                            <div className="font-semibold">Product Type</div>
                                            <Select
                                                isMulti
                                                className="w-full"
                                                options={subCatFilteredProductTypes}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id.toString()}
                                                defaultValue={subCatFilteredProductTypes.filter((option) =>
                                                    fieldValue.some((item) => item === option.name),
                                                )}
                                                onChange={(newVal) => {
                                                    const selectedValues = newVal.map((item) => item.name) || []
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
                                                isMulti
                                                className="w-full"
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
