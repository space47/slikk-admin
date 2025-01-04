/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input } from '@/components/ui'
import React from 'react'
import CommonSelect from './CommonSelect'
import { Field } from 'formik'
import FilterSelect from '@/views/sales/urlShortner/FilterSelect'
import { SubDataTypeArray } from './PageSettingsCommon'

const GenderArray = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
]

const dataTypeArray = [
    { label: 'Default', value: 'Default' },
    { label: 'banner', value: 'banner' },
    { label: 'wishlist', value: 'wishlist' },
    { label: 'purchases', value: 'purchases' },
    { label: 'searches', value: 'searches' },
    { label: 'spotlight', value: 'spotlight' },
    { label: 'products', value: 'products' },
    { label: 'brands', value: 'brands' },
    { label: 'post', value: 'post' },
    { label: 'creator', value: 'creator' },
    { label: 'Sub categories', value: 'categories' },
]

interface DataTypesProps {
    handleAddFilter: any
    showAddFilter: any
    handleAddFilters: any
    handleRemoveFilter: any
}

const DataTypes = ({ handleAddFilter, handleAddFilters, handleRemoveFilter, showAddFilter }: DataTypesProps) => {
    return (
        <FormContainer className="grid grid-cols-2 gap-3">
            <CommonSelect needClassName label="Data Types" name="data_type.type" options={dataTypeArray} className="w-2/3" />
            <CommonSelect
                needClassName
                label="Sub Data Types"
                name="data_type.sub_data_type"
                options={SubDataTypeArray}
                className="w-2/3"
            />

            <FormItem label="Filters" className="col-span-1 w-[60%] h-[80%]">
                <Field type="text" name="data_type.filters" placeholder="Place your header Text" component={Input} min="0" />
            </FormItem>

            <CommonSelect needClassName label="Division Select" options={GenderArray} name="division_select" className="w-1/2" />

            <FilterSelect
                handleAddFilter={handleAddFilter}
                showAddFilter={showAddFilter}
                handleAddFilters={handleAddFilters}
                handleRemoveFilter={handleRemoveFilter}
            />

            <FormItem label="Data Count" className="col-span-1 w-[60%] h-[80%]">
                <Field type="number" name="data_type.data_count" placeholder="Place Data Count" component={Input} min="0" />
            </FormItem>
        </FormContainer>
    )
}

export default DataTypes
