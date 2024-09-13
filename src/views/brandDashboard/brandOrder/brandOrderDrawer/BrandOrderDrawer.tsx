/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import Select from '@/components/ui/Select'

interface drawerProps {
    showDrawer: any
    handleCloseDrawer: any
    handleApply: any
    divisionArray: any
    categoryArray: any
    subCategoryArray: any
    handleMultiSelect: any
}

const BrandOrderDrawer = ({
    showDrawer,
    handleCloseDrawer,
    handleApply,
    divisionArray,
    categoryArray,
    subCategoryArray,
    handleMultiSelect,
}: drawerProps) => {
    const Footer = (
        <div className="text-right w-full">
            <Button size="sm" variant="solid" onClick={() => handleApply()}>
                Confirm
            </Button>
        </div>
    )

    return (
        <div>
            <Drawer
                title=""
                isOpen={showDrawer}
                footer={Footer}
                onClose={handleCloseDrawer}
                onRequestClose={handleCloseDrawer}
                lockScroll={false}
            >
                <div className="flex flex-col gap-10 w-full items-center">
                    <div className="flex flex-col gap-1 w-full max-w-md">
                        <div className="font-semibold">Division</div>
                        <Select
                            className="w-full"
                            isMulti
                            options={divisionArray}
                            getOptionLabel={(option: any) => option.name}
                            getOptionValue={(option) => option.id.toString()}
                            onChange={(newVal) => {
                                const selectedValues = newVal
                                    .map((val) => val.name)
                                    .join(',')
                                handleMultiSelect('division', selectedValues)
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-full max-w-md">
                        <div className="font-semibold">Category</div>
                        <Select
                            className="w-full"
                            isMulti
                            options={categoryArray}
                            getOptionLabel={(option: any) => option.name}
                            getOptionValue={(option: any) =>
                                option.id.toString()
                            }
                            onChange={(newVal) => {
                                const selectedValues = newVal
                                    .map((val) => val.name)
                                    .join(',')
                                handleMultiSelect('category', selectedValues)
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-1 w-full max-w-md">
                        <div className="font-semibold">Sub_Category</div>
                        <Select
                            className="w-full"
                            isMulti
                            options={subCategoryArray}
                            getOptionLabel={(option: any) => option.name}
                            getOptionValue={(option: any) =>
                                option.id.toString()
                            }
                            onChange={(newVal) => {
                                const selectedValues = newVal
                                    .map((val: any) => val.name)
                                    .join(',')
                                handleMultiSelect(
                                    'sub_category',
                                    selectedValues,
                                )
                            }}
                        />
                    </div>
                </div>
            </Drawer>
        </div>
    )
}

export default BrandOrderDrawer
