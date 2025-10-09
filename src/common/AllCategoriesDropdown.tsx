import React, { useMemo } from 'react'
import { Select } from '@/components/ui'
import { useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { useSubCategoryFilter } from '@/views/category-management/subCategory/subCategoryUtils/subCategoryFilter'

interface props {
    selectedDivision: string
    setSelectedDivision: (x: string) => void
    selectedCategory: string
    setSelectedCategory: (x: string) => void
    selectedSubCategory: string
    setSelectedSubCategory: (x: string) => void
}

const AllCategoriesDropdown = ({
    selectedCategory,
    selectedDivision,
    selectedSubCategory,
    setSelectedCategory,
    setSelectedDivision,
    setSelectedSubCategory,
}: props) => {
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const subCategories = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)
    const categoryArray = useSubCategoryFilter({ selectedDivision })

    const filteredSubCategories = useMemo(() => {
        if (selectedCategory === 'Select Category') {
            return subCategories?.subcategories
        }
        return subCategories.subcategories.filter((item) => item.category_name === selectedCategory)
    }, [subCategories?.subcategories, selectedCategory])

    return (
        <div className="flex flex-col xl:flex-row items-start gap-3">
            {/* Division Select */}
            <Select
                isClearable
                options={divisions?.divisions || []}
                placeholder="Select Division"
                getOptionLabel={(option) => option?.name}
                getOptionValue={(option) => option?.name}
                className="w-full xl:w-1/3"
                value={divisions?.divisions?.find((item) => item.name === selectedDivision) || null}
                onChange={(val) => {
                    setSelectedDivision(val?.name || 'Select Division')
                    setSelectedCategory('Select Category')
                }}
            />

            {/* Category Select */}
            <Select
                isClearable
                options={categoryArray?.map((item) => ({ name: item, id: item })) || []}
                placeholder="Select Category"
                getOptionLabel={(option) => option?.name}
                getOptionValue={(option) => option?.id}
                className="w-full xl:w-1/3"
                value={selectedCategory !== 'Select Category' ? { name: selectedCategory, id: selectedCategory } : null}
                onChange={(val) => {
                    setSelectedCategory(val?.name || 'Select Category')
                }}
            />

            {/* Subcategory Select */}
            <Select
                isClearable
                options={
                    filteredSubCategories?.map((item) => ({
                        name: item?.name,
                        id: item?.id?.toString(),
                    })) || []
                }
                placeholder="Select Sub Category"
                getOptionLabel={(option) => option?.name}
                getOptionValue={(option) => option?.id}
                className="w-full xl:w-1/3"
                value={selectedSubCategory ? { name: selectedSubCategory, id: selectedSubCategory } : null}
                onChange={(val) => {
                    setSelectedSubCategory(val?.name || '')
                }}
            />
        </div>
    )
}

export default AllCategoriesDropdown
