/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { IoMdAddCircle } from 'react-icons/io'
import { Field, FieldProps } from 'formik'
import { Button, Checkbox, Input, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FILTER_STATE } from '@/store/types/filters.types'
import { MdCancel } from 'react-icons/md'
import { MAXMINARRAY, OFFARRAY } from '../groupNotification/sendNotification/sendNotify.common'
import ComonFilterSelect from '@/common/ComonFilterSelect'

interface FILTERPROPS {
    handleAddFilter: any
    showAddFilter: any
    handleRemoveFilter: any
    handleAddFilters: any
    sortValue?: any
    targetPagevalue?: any
    filterValue?: any
    setFilterId?: any
}

const DISCOUNTOPTIONS = [
    { value: 'sort_lowtohigh', label: 'Low to High' },
    { value: 'sort_hightolow', label: 'High to Low' },
    { value: 'sort_discount', label: 'DISCOUNT' },
]

export const targetPageArray = [
    { label: 'product', value: 'product' },
    { label: 'login', value: 'login' },
    { label: 'productListing', value: 'products' },
    { label: 'wishlist', value: 'wishlist' },
    { label: 'order', value: 'order' },
    { label: 'cart', value: 'cart' },
    { label: 'home', value: 'home' },
    { label: 'events', value: 'events' },
    { label: 'signIn', value: 'signIn' },
    { label: 'otpVerification', value: 'otpVerification' },
    { label: 'homeTabs', value: 'homeTabs' },
    { label: 'profilePage', value: 'profilePage' },
    { label: 'profileEditPage', value: 'profileEditPage' },
    { label: 'addAddressPage', value: 'addAddressPage' },
    { label: 'addressesPage', value: 'addressesPage' },
    { label: 'addressMapPage', value: 'addressMapPage' },
    { label: 'collectionScreen', value: 'collectionScreen' },
    { label: 'productDescription', value: 'productDescription' },
    { label: 'collectionPage', value: 'collectionPage' },
    { label: 'slikkLoyalty', value: 'slikkLoyalty' },
    { label: 'orderDetailsMain', value: 'orderDetailsMain' },
    { label: 'applyOffer', value: 'applyOffer' },
    { label: 'myOffers', value: 'myOffers' },
    { label: 'creatorAddProducts', value: 'creatorAddProducts' },
    { label: 'newLookPost', value: 'newLookPost' },
    { label: 'newLookPage', value: 'newLookPage' },
    { label: 'orderFailed', value: 'orderFailed' },
    { label: 'orderPending', value: 'orderPending' },
    { label: 'creatorHome', value: 'creatorHome' },
    { label: 'feedbackReview', value: 'feedbackReview' },
    { label: 'reels', value: 'reels' },
    { label: 'reelVideo', value: 'reelVideo' },
    { label: 'trends', value: 'trends' },
    { label: 'creatorProfileMain', value: 'creatorProfileMain' },
    { label: 'referFriends', value: 'referFriends' },
    { label: 'termsOfUse', value: 'termsOfUse' },
    { label: 'globalSearch', value: 'globalSearch' },
    { label: 'aboutUs', value: 'aboutUs' },
    { label: 'contactUs', value: 'contactUs' },
    { label: 'searchPage', value: 'searchPage' },
    { label: 'brandList', value: 'brandList' },
]

const FilterSelect = ({ sortValue, filterValue, setFilterId }: FILTERPROPS) => {
    return (
        <div>
            {' '}
            <div>
                <ComonFilterSelect isEdit filterId={filterValue} setFilterId={setFilterId} />
            </div>
            <FormContainer className="flex gap-3 flex-col xl:flex-row">
                {MAXMINARRAY.map((item, key) => (
                    <FormItem key={key} label={item.label} className="w-full xl:w-2/3">
                        <Field
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            component={item?.type === 'checkbox' ? Checkbox : Input}
                        />
                    </FormItem>
                ))}
            </FormContainer>
            <FormContainer className="flex gap-3 flex-col xl:flex-row">
                {OFFARRAY.map((item, key) => (
                    <FormItem key={key} label={item.label} className="w-full xl:w-2/3">
                        <Field
                            type={item.type}
                            name={item.name}
                            placeholder={item.placeholder}
                            component={item?.type === 'checkbox' ? Checkbox : Input}
                        />
                    </FormItem>
                ))}
            </FormContainer>
            <div className="flex flex-col">
                <div>Sort By</div>
                <Field name="discountTags">
                    {({ field, form }: FieldProps<any>) => {
                        console.log('Field Value', field)
                        console.log('Sort', sortValue)
                        const selectedValue = DISCOUNTOPTIONS.find((option) => option.value === `sort_${sortValue}`)
                        console.log('Selected Value', selectedValue)
                        return (
                            <Select
                                isMulti
                                placeholder="Discount Tags"
                                options={DISCOUNTOPTIONS}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                // defaultValue={selectedValue}
                                onChange={(newVal) => {
                                    const newValues = newVal ? newVal.map((val) => val.value) : []
                                    console.log('onChange Values', newVal)
                                    form.setFieldValue(field.name, newValues)
                                }}
                            />
                        )
                    }}
                </Field>
            </div>
        </div>
    )
}

export default FilterSelect
