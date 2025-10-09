/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, FormContainer, FormItem, Select } from '@/components/ui'
import FormButton from '@/components/ui/Button/FormButton'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllBrandsAPI } from '@/store/action/brand.action'
import { BRAND_STATE } from '@/store/types/brand.types'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { DIVISION_STATE } from '@/store/types/division.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage } from '@/utils/responseMessages'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'

interface props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    storeId: number
}

const DownloadInventoryModal = ({ isOpen, setIsOpen, storeId }: props) => {
    const division = useAppSelector<DIVISION_STATE>((state) => state.division)
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const subCategory = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)
    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const [spinner, setSpinner] = useState(false)

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getAllBrandsAPI())
    }, [dispatch])

    const handleSubmit = async (values: any) => {
        notification.info({ message: 'Download in progress' })
        // company_id: values?.companyList?.map((item: any) => item?.id)?.join(','),
        const brandFilter = values?.brand ? `&brand=${values?.brand?.name}` : ''
        const divisionFilter = values?.division ? `&division=${values?.division?.name}` : ''
        const categoryFilter = values?.category ? `&category=${values?.category?.name}` : ''
        const subCategoryFilter = values?.subCategory ? `&subCategory=${values?.subCategory?.name}` : ''
        setSpinner(true)
        try {
            const res = await axioisInstance.get(
                `/inventory-location?download=true&store_id=${storeId}&${brandFilter}&${divisionFilter}&${categoryFilter}&${subCategoryFilter}`,
            )
            notification.success({ message: res?.data?.message || 'Successfully downloaded' })
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        } finally {
            setSpinner(false)
            setIsOpen(false)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={800}>
            <Formik enableReinitialize initialValues={{} as any} onSubmit={handleSubmit}>
                {({ setFieldValue }) => (
                    <Form>
                        <FormContainer>
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

                        <FormButton isSpinning={spinner} value="Download" />
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default DownloadInventoryModal
