/* eslint-disable @typescript-eslint/no-explicit-any */
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import React, { useEffect } from 'react'
import { ConditionArray, OperatorArray } from './notificationGroupsCommon'
import { FormContainer, FormItem, Input } from '@/components/ui'
import FiltersSelect from './FiltersSelect'
import { Field } from 'formik'
import { useAppDispatch, useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { BRAND_STATE } from '@/store/types/brand.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { getAllBrandsAPI } from '@/store/action/brand.action'

interface Props {
    isFunction?: boolean
    index: number
    cond: any
    condition_name: string
    function_name?: string
    value_name: string
    value_name_A: string
    value_name_B: string
}

const ConditonMapings = ({ cond, index, isFunction, condition_name, function_name, value_name, value_name_A, value_name_B }: Props) => {
    const dispatch = useAppDispatch()
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const subCategoryData = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)

    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [])

    return (
        <>
            <CommonSelect label={`${isFunction ? 'Aggregation' : ''} Condition`} options={ConditionArray} name={condition_name} />
            {isFunction && <CommonSelect label="Aggregation Operator" options={OperatorArray} name={function_name as string} />}

            {cond?.aggregation?.toLocaleLowerCase()?.includes('category') && (
                <FormItem label={`${isFunction ? 'Aggregation' : ''} Value`}>
                    <FiltersSelect is_aggregation={isFunction} index={index} filter={category?.categories} />
                </FormItem>
            )}
            {cond?.aggregation?.toLocaleLowerCase()?.includes('division') && (
                <FormItem label={`${isFunction ? 'Aggregation' : ''} Value`}>
                    <FiltersSelect is_aggregation={isFunction} index={index} filter={divisions?.divisions} />
                </FormItem>
            )}
            {cond?.aggregation?.toLocaleLowerCase()?.includes('sub category') && (
                <FormItem label={`${isFunction ? 'Aggregation' : ''} Value`}>
                    <FiltersSelect is_aggregation={isFunction} index={index} filter={subCategoryData?.subcategories} />
                </FormItem>
            )}
            {cond?.aggregation?.toLocaleLowerCase()?.includes('brand') && (
                <FormItem label={`${isFunction ? 'Aggregation' : ''} Value`}>
                    <FiltersSelect is_aggregation={isFunction} index={index} filter={brands?.brands} />
                </FormItem>
            )}

            {!(
                cond?.aggregation?.toLocaleLowerCase()?.includes('category') ||
                cond?.aggregation?.toLocaleLowerCase()?.includes('division') ||
                cond?.aggregation?.toLocaleLowerCase()?.includes('sub category') ||
                cond?.aggregation?.toLocaleLowerCase()?.includes('brand')
            ) &&
                (cond?.agg_condition?.includes('BETWEEN') || cond?.agg_condition?.includes('Not Between') ? (
                    <FormContainer className="grid grid-cols-2 gap-2 col-span-2">
                        <FormItem label={`${isFunction ? 'Aggregation' : ''} Value(A)`}>
                            <Field name={value_name_A} placeholder="Value A" component={Input} />
                        </FormItem>
                        <FormItem label={`${isFunction ? 'Aggregation' : ''} Value(B)`}>
                            <Field name={value_name_B} placeholder="Value B" component={Input} />
                        </FormItem>
                    </FormContainer>
                ) : (
                    <FormItem label={`${isFunction ? 'Aggregation' : ''} Value`}>
                        <Field name={value_name} placeholder="Value " component={Input} />
                    </FormItem>
                ))}
        </>
    )
}

export default ConditonMapings
