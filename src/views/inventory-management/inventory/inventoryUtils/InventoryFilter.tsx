import { Button, Drawer, Select } from '@/components/ui'
import { useAppSelector } from '@/store'
import { BRAND_STATE } from '@/store/types/brand.types'
import { DIVISION_STATE } from '@/store/types/division.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'
import { useSubCategoryFilter } from '@/views/category-management/subCategory/subCategoryUtils/subCategoryFilter'
import React, { useEffect, useMemo, useState } from 'react'
import { InventoryCatalog } from './inventoryCommon'
import { Filter } from 'lucide-react'

interface props {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    setFilteredCatalog: (x: InventoryCatalog) => void
    filteredCatalog: InventoryCatalog
}

const InventoryFilter = ({ isOpen, setIsOpen, setFilteredCatalog, filteredCatalog }: props) => {
    const [selectedDivision, setSelectedDivision] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedSubCategory, setSelectedSubCategory] = useState('')
    const [brandsList, setBrandList] = useState<number[]>([])

    const brands = useAppSelector<BRAND_STATE>((state) => state.brands)
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const subCategories = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)

    const categoryArray = useSubCategoryFilter({ selectedDivision })

    const filteredSubCategories = useMemo(() => {
        if (selectedCategory === 'Select Category') return subCategories?.subcategories
        return subCategories.subcategories.filter((item) => item.category_name === selectedCategory)
    }, [subCategories?.subcategories, selectedCategory])

    useEffect(() => {
        if (isOpen && filteredCatalog) {
            setSelectedDivision(filteredCatalog.division || '')
            setSelectedCategory(filteredCatalog.category || '')
            setSelectedSubCategory(filteredCatalog.subCategory || '')
            setBrandList(filteredCatalog.brand || [])
        }
    }, [isOpen, filteredCatalog])

    const handleSetFilters = () => {
        setFilteredCatalog({
            brand: brandsList,
            category: selectedCategory,
            division: selectedDivision,
            subCategory: selectedSubCategory,
        })
        setIsOpen(false)
    }

    return (
        <Drawer
            title={
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Filter className="w-5 h-5 text-blue-500" />
                    Inventory Filters
                </div>
            }
            lockScroll={false}
            className="xl:mx-0 mx-4"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onRequestClose={() => setIsOpen(false)}
        >
            <div className="space-y-6">
                <div className="grid gap-6 xl:grid-cols-1">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Division</label>
                        <Select
                            isClearable
                            options={divisions?.divisions || []}
                            placeholder="Select Division"
                            getOptionLabel={(option) => option?.name}
                            getOptionValue={(option) => option?.name}
                            className="w-full"
                            value={divisions?.divisions?.find((item) => item.name === selectedDivision) || null}
                            onChange={(val) => {
                                setSelectedDivision(val?.name as string)
                                setSelectedCategory('')
                            }}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Category</label>
                        <Select
                            isClearable
                            options={categoryArray?.map((item) => ({ name: item, id: item })) || []}
                            placeholder="Select Category"
                            getOptionLabel={(option) => option?.name}
                            getOptionValue={(option) => option?.id}
                            className="w-full"
                            value={selectedCategory !== '' ? { name: selectedCategory, id: selectedCategory } : null}
                            onChange={(val) => setSelectedCategory(val?.name || '')}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Sub Category</label>
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
                            className="w-full"
                            value={selectedSubCategory ? { name: selectedSubCategory, id: selectedSubCategory } : null}
                            onChange={(val) => setSelectedSubCategory(val?.name || '')}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600">Brands</label>
                        <Select
                            isMulti
                            isClearable
                            options={brands.brands}
                            placeholder="Select Brands"
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id.toString()}
                            value={brands?.brands?.filter((item) => brandsList?.includes(item?.id))}
                            className="w-full"
                            onChange={(val) => {
                                if (val) setBrandList(val.map((item) => item?.id))
                                else setBrandList([])
                            }}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button
                        variant="blue"
                        type="button"
                        onClick={handleSetFilters}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>
        </Drawer>
    )
}

export default InventoryFilter
