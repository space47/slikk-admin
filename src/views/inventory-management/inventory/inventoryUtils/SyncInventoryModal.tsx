/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, FormContainer, FormItem, Input, Select } from '@/components/ui'
import FormButton from '@/components/ui/Button/FormButton'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { BRAND_STATE } from '@/store/types/brand.types'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { DIVISION_STATE } from '@/store/types/division.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { filterEmptyValues } from '@/utils/apiBodyUtility'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage, successMessage } from '@/utils/responseMessages'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { AxiosError } from 'axios'
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'

interface props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    storeId: number
}

const SyncInventoryModal = ({ isOpen, setIsOpen, storeId }: props) => {
    const division = useAppSelector<DIVISION_STATE>((state) => state.division)
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const subCategory = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const [spinner, setSpinner] = useState(false)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [dispatch])

    const handleSubmit = async (values: any) => {
        setSpinner(true)
        const body = {
            store_id: storeId,
            sync_type: values?.sync || 'soft',
            brand_id: values?.brand?.id || '',
            company_id: values?.companyList?.map((item: any) => item?.id)?.join(','),
            category: values?.category?.name || '',
            division: values?.division?.name || '',
            subcategory: values?.sub_categories?.name || '',
            row: values?.row || '',
            location: values?.location || '',
        }
        const filteredBody = filterEmptyValues(body)

        try {
            const res = await axioisInstance.post(`/inventory-location/sync/inventory`, filteredBody)
            successMessage(res)
            setIsOpen(false)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        } finally {
            setSpinner(false)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={800}>
            <Formik enableReinitialize initialValues={{} as any} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form>
                        <CommonSelect
                            name="sync"
                            label="Sync Type"
                            options={[
                                { label: 'soft', value: 'soft' },
                                { label: 'hard', value: 'hard' },
                            ]}
                        />

                        {values?.sync === 'hard' && (
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
                        )}

                        <FormButton isSpinning={spinner} value="Apply" />
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default SyncInventoryModal
