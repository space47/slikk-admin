/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import Select from '@/components/ui/Select'
import { Formik, Form, Field } from 'formik'
import { FormContainer } from '@/components/ui'

interface drawerProps {
    showDrawer: any
    handleCloseDrawer: any
    handleApply: any
    divisionArray: any
    categoryArray: any
    subCategoryArray: any
    handleMultiSelect: any
    handleResetFilters: any
    division: any
    category: any
    sub_category: any
}

const BrandOrderDrawer = ({
    showDrawer,
    handleCloseDrawer,
    handleApply,
    divisionArray,
    categoryArray,
    subCategoryArray,
    handleMultiSelect,
    handleResetFilters,
    division,
    category,
    sub_category,
}: drawerProps) => {
    const Footer = (
        <div className="text-right w-full">
            <Button
                size="sm"
                variant="default"
                onClick={() => handleResetFilters()}
            >
                Reset
            </Button>
            <Button size="sm" variant="solid" onClick={() => handleApply()}>
                APPLY
            </Button>
        </div>
    )

    return (
        <div>
            <Drawer
                title=""
                isOpen={showDrawer}
                onClose={handleCloseDrawer}
                onRequestClose={handleCloseDrawer}
                lockScroll={false}
            >
                <Formik
                    initialValues={{
                        division: division,
                        category: category,
                        sub_category: sub_category,
                    }}
                    onSubmit={handleApply}
                >
                    {({ setFieldValue, values, resetForm }) => (
                        <Form className="flex flex-col gap-10 w-full items-center">
                            {/* Division */}
                            <div className="flex flex-col gap-1 w-full max-w-md">
                                <div className="font-semibold">Division</div>
                                <Select
                                    className="w-full"
                                    isMulti
                                    options={divisionArray}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) =>
                                        option.id.toString()
                                    }
                                    value={values.division}
                                    onChange={(newVal) => {
                                        const selectedValues = newVal || []
                                        setFieldValue(
                                            'division',
                                            selectedValues,
                                        )
                                        handleMultiSelect(
                                            'division',
                                            selectedValues,
                                        )
                                    }}
                                />
                            </div>

                            {/* Category */}
                            <div className="flex flex-col gap-1 w-full max-w-md">
                                <div className="font-semibold">Category</div>
                                <Select
                                    className="w-full"
                                    isMulti
                                    options={categoryArray}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) =>
                                        option.id.toString()
                                    }
                                    value={values.category}
                                    onChange={(newVal) => {
                                        const selectedValues = newVal || []
                                        setFieldValue(
                                            'category',
                                            selectedValues,
                                        )
                                        handleMultiSelect(
                                            'category',
                                            selectedValues,
                                        )
                                    }}
                                />
                            </div>

                            {/* Sub Category */}
                            <div className="flex flex-col gap-1 w-full max-w-md">
                                <div className="font-semibold">
                                    Sub Category
                                </div>
                                <Select
                                    className="w-full"
                                    isMulti
                                    options={subCategoryArray}
                                    getOptionLabel={(option) => option.name}
                                    getOptionValue={(option) =>
                                        option.id.toString()
                                    }
                                    value={values.sub_category}
                                    onChange={(newVal) => {
                                        const selectedValues = newVal || []
                                        setFieldValue(
                                            'sub_category',
                                            selectedValues,
                                        )
                                        handleMultiSelect(
                                            'sub_category',
                                            selectedValues,
                                        )
                                    }}
                                />
                            </div>
                            <FormContainer className="flex gap-5 justify-end ">
                                <Button
                                    type="reset"
                                    variant="default"
                                    className="mt-4 p-2 rounded"
                                    onClick={() => handleResetFilters()}
                                >
                                    Reset
                                </Button>

                                <Button
                                    type="submit"
                                    variant="new"
                                    className="mt-4 bg-blue-500 text-white p-2 rounded"
                                >
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

export default BrandOrderDrawer
