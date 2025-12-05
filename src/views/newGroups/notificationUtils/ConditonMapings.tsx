/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import React, { useEffect } from 'react'
import { ConditionArray, OperatorArray } from './notificationGroupsCommon'
import { FormContainer, FormItem, Input, Select } from '@/components/ui'
import FiltersSelect from './FiltersSelect'
import { Field, FieldProps } from 'formik'
import { useAppDispatch, useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { BRAND_STATE } from '@/store/types/brand.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'

interface Props {
    isFunction?: boolean
    isEdit?: boolean
    index: number
    cond: any
}

const ConditonMapings = ({ cond, index, isFunction, isEdit }: Props) => {
    const dispatch = useAppDispatch()
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const subCategoryData = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)

    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [])

    const selectedAggregation = isFunction ? cond?.aggregation : cond?.property
    const selectedCondition = isFunction ? cond?.agg_condition : cond?.condition

    return (
        <>
            {isEdit ? (
                <FormItem label={`${isFunction ? 'Aggregation' : ''} Condition`} className={'col-span-1 w-full'}>
                    <Field name={isFunction ? `conditions[${index}].agg_condition` : `conditions[${index}].condition`}>
                        {({ field, form }: FieldProps<any>) => {
                            return (
                                <Select
                                    isClearable
                                    isSearchable
                                    options={ConditionArray}
                                    value={ConditionArray?.find((option) => option.value?.toLowerCase() === field.value)}
                                    onChange={(option) => {
                                        const value = option ? option.value : ''
                                        form.setFieldValue(field.name, value)
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                />
                            )
                        }}
                    </Field>
                </FormItem>
            ) : (
                <CommonSelect
                    label={`${isFunction ? 'Aggregation' : ''} Condition`}
                    options={ConditionArray}
                    name={isFunction ? `conditions[${index}].agg_condition` : `conditions[${index}].condition`}
                />
            )}

            {isFunction && <CommonSelect label="Aggregation Operator" options={OperatorArray} name={`conditions[${index}].agg_function`} />}

            {/* CATEGORY */}
            {selectedAggregation?.toLowerCase()?.includes('category') && (
                <FormItem label={`${isFunction ? 'Aggregation' : ''} Value`}>
                    <FiltersSelect is_aggregation={isFunction} index={index} filter={category?.categories} />
                </FormItem>
            )}

            {/* DIVISION */}
            {selectedAggregation?.toLowerCase()?.includes('division') && (
                <FormItem label={`${isFunction ? 'Aggregation' : ''} Value`}>
                    <FiltersSelect is_aggregation={isFunction} index={index} filter={divisions?.divisions} />
                </FormItem>
            )}

            {/* SUBCATEGORY */}
            {selectedAggregation?.toLowerCase()?.includes('sub category') && (
                <FormItem label={`${isFunction ? 'Aggregation' : ''} Value`}>
                    <FiltersSelect is_aggregation={isFunction} index={index} filter={subCategoryData?.subcategories} />
                </FormItem>
            )}

            {/* BRAND */}
            {selectedAggregation?.toLowerCase()?.includes('brand') && (
                <FormItem label={`${isFunction ? 'Aggregation' : ''} Value`}>
                    <FiltersSelect is_aggregation={isFunction} index={index} filter={brands?.brands} />
                </FormItem>
            )}

            {/* NUMERIC INPUT HANDLING */}
            {!(
                selectedAggregation?.toLowerCase()?.includes('category') ||
                selectedAggregation?.toLowerCase()?.includes('division') ||
                selectedAggregation?.toLowerCase()?.includes('sub category') ||
                selectedAggregation?.toLowerCase()?.includes('brand')
            ) &&
                (selectedCondition?.toLowerCase()?.includes('between') || selectedCondition?.includes('Not Between') ? (
                    <FormContainer className="grid grid-cols-2 gap-2 col-span-2">
                        <FormItem label={`${isFunction ? 'Aggregation' : ''} Value(A)`}>
                            <Field
                                name={isFunction ? `conditions[${index}].agg_value_a` : `conditions[${index}].value_a`}
                                placeholder="Value A"
                                component={Input}
                            />
                        </FormItem>
                        <FormItem label={`${isFunction ? 'Aggregation' : ''} Value(B)`}>
                            <Field
                                name={isFunction ? `conditions[${index}].agg_value_b` : `conditions[${index}].value_b`}
                                placeholder="Value B"
                                component={Input}
                            />
                        </FormItem>
                    </FormContainer>
                ) : (
                    <FormItem label={`${isFunction ? 'Aggregation' : ''} Value`}>
                        <Field
                            name={isFunction ? `conditions[${index}].agg_value` : `conditions[${index}].value`}
                            placeholder="Value"
                            component={Input}
                        />
                    </FormItem>
                ))}
        </>
    )
}

export default ConditonMapings
