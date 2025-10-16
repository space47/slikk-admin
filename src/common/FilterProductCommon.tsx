/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik, FieldProps } from 'formik'
import Select from '@/components/ui/Select'
import { Button, Drawer } from '@/components/ui'
import { BRAND_STATE } from '@/store/types/brand.types'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FILTER_STATE } from '@/store/types/filters.types'

interface PROPS {
    showDrawer: boolean
    setShowDrawer: (x: boolean) => void
    setTypeFetch: (x: string) => void
    isDispatch?: boolean
    brandList: any
    setBrandList: any
    typeFetch?: string
}

const FilterProductCommon = ({ showDrawer, setShowDrawer, setTypeFetch, brandList, setBrandList, typeFetch }: PROPS) => {
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)

    const [selectFilterString, setFilterString] = useState('')
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getAllBrandsAPI())
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const handleMultiSelect = (fieldName: string, selectedValues: any) => {
        if (fieldName === 'brand') {
            setBrandList(selectedValues)
        }
    }

    // useEffect(() => {
    //     if (showDrawer) {
    //         setInitialValues({ brand: [] })
    //     }
    // }, [showDrawer])

    const [initialValues, setInitialValues] = useState({
        brand: brandList,
        // filtersAdd:
        //     typeFetch?.split('&')?.map((item: string) => {
        //         console.log('inside', item)
        //         const [prefix, ...rest] = item.split('=')
        //         console.log(prefix, 'ssss', rest, 'lokokokokoo')
        //         return {
        //             label: prefix,
        //             options: rest?.map((dta) => ({
        //                 label: dta,
        //                 name: dta,
        //                 value: item?.replace('=', '_'),
        //             })),
        //         }
        //     }) || [],
    })

    const handleApply = () => {
        let query = ''
        if (brandList?.length > 0 && !selectFilterString) {
            const brandIds = brandList.join(',')
            if (query) query += '&'
            query += `brand=${encodeURIComponent(brandIds)}`
        }
        if (selectFilterString && brandList?.length === 0) {
            console.log('selected filter string', selectFilterString)
            query += `${selectFilterString}`
        }
        if (selectFilterString && brandList?.length > 0) {
            const brandIds = brandList.join(',')
            const data = selectFilterString
                ?.split('=')
                ?.filter((item) => item !== 'brand')
                ?.join('')
            if (selectFilterString.includes('brand')) {
                query += `brand=${encodeURIComponent(brandIds)},${data},`
            } else {
                query += `${selectFilterString}&brand=${encodeURIComponent(brandIds)}`
            }
        }
        setTypeFetch(query)
        setShowDrawer(false)
    }

    return (
        <div>
            <Drawer
                title=""
                isOpen={showDrawer}
                lockScroll={false}
                onRequestClose={() => setShowDrawer(false)}
                onClose={() => setShowDrawer(false)}
            >
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
                                <Field name="filtersAdd">
                                    {({ field, form }: FieldProps<any>) => (
                                        <Select
                                            isMulti
                                            placeholder="Select Filter Tags"
                                            className="xl:w-[300px] mt-2"
                                            options={filters.filters}
                                            getOptionLabel={(option: any) => option.label}
                                            getOptionValue={(option: any) => option.value}
                                            onChange={(newVal) => {
                                                const selectedValues = newVal ? newVal.map((val) => val.value) : []
                                                console.log('Selected Values:', selectedValues)

                                                const groupedValues: Record<string, string[]> = selectedValues.reduce(
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
                                                    .map(([key, values]) => `${key}=${encodeURIComponent(values.join(','))}`)
                                                    .join('&')

                                                form.setFieldValue(field.name, queryString)
                                                setFilterString(queryString)
                                            }}
                                        />
                                    )}
                                </Field>
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

export default FilterProductCommon
