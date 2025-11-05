/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik, FieldProps, FieldArray } from 'formik'
import Select from '@/components/ui/Select'
import { Button, Drawer } from '@/components/ui'
import { BRAND_STATE } from '@/store/types/brand.types'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { IoMdAddCircle } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import { getAllFiltersAPI } from '@/store/action/filters.action'

interface PROPS {
    showDrawer: boolean
    handleCloseDrawer: any
    handleApply: any
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
    filters: any
    setFilterString: any
}

const ProductFilterNest = ({
    showDrawer,
    handleCloseDrawer,
    handleApply,
    divisionList,
    categroyList,
    productTypeList,
    brandList,
    subCategoryList,
    setDivisionList,
    setCategoryList,
    setSubCategoryList,
    setProductTypeList,
    setBrandList,
    filters,
    setFilterString,
}: PROPS) => {
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllBrandsAPI())
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const handleMultiSelect = (fieldName: string, selectedValues: any) => {
        if (fieldName === 'division') {
            setDivisionList(selectedValues)
        } else if (fieldName === 'category') {
            setCategoryList(selectedValues)
        } else if (fieldName === 'sub_category') {
            setSubCategoryList(selectedValues)
        } else if (fieldName === 'product_type') {
            setProductTypeList(selectedValues)
        } else if (fieldName === 'brand') {
            setBrandList(selectedValues)
        }
    }

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

    return (
        <div>
            <Drawer title="" isOpen={showDrawer} lockScroll={false} onRequestClose={handleCloseDrawer} onClose={handleCloseDrawer}>
                <Formik initialValues={initialValues} onSubmit={handleApply}>
                    {({ setFieldValue }) => (
                        <Form className="flex flex-col gap-10 w-full items-start">
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

                            <FormItem label="SEARCH FILTER STRINGS">
                                <FieldArray name="filtersAdd">
                                    {({ push, remove, form }) => (
                                        <>
                                            <FormContainer className="items-center mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => push([])} // Add a new empty array for multi-select values
                                                >
                                                    <IoMdAddCircle className="text-3xl text-green-500" />
                                                </button>
                                            </FormContainer>

                                            {form.values.filtersAdd?.map((_: any, index: any) => (
                                                <FormItem key={index} className="flex gap-2">
                                                    <div className="flex gap-3 items-center">
                                                        <Field name={`filtersAdd[${index}]`}>
                                                            {({ field, form }: FieldProps<any>) => (
                                                                <Select
                                                                    isMulti
                                                                    placeholder="Select Filter Tags"
                                                                    className="xl:w-[300px]"
                                                                    options={filters.filters}
                                                                    getOptionLabel={(option: any) => option.label}
                                                                    getOptionValue={(option: any) => option.value}
                                                                    onChange={(newVal) => {
                                                                        const selectedValues = newVal ? newVal.map((val) => val.value) : []
                                                                        console.log('Selected Values:', selectedValues)
                                                                        const groupedValues: Record<string, string[]> =
                                                                            selectedValues.reduce(
                                                                                (acc, curr) => {
                                                                                    const [prefix, ...rest] = curr.split('_')
                                                                                    const key = prefix.toLowerCase()
                                                                                    const value = rest.join('_')
                                                                                    acc[key] = acc[key] ? [...acc[key], value] : [value]
                                                                                    return acc
                                                                                },
                                                                                {} as Record<string, string[]>,
                                                                            )

                                                                        const queryString = Object.entries(groupedValues)
                                                                            .map(
                                                                                ([key, values]) =>
                                                                                    `${key}=${encodeURIComponent(values.join(','))}`,
                                                                            )
                                                                            .join('&')

                                                                        form.setFieldValue(field.name, queryString)
                                                                        setFilterString(queryString)
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>

                                                        <button type="button" onClick={() => remove(index)}>
                                                            <MdCancel className="text-xl text-red-500" />
                                                        </button>
                                                    </div>
                                                </FormItem>
                                            ))}
                                        </>
                                    )}
                                </FieldArray>
                            </FormItem>

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
