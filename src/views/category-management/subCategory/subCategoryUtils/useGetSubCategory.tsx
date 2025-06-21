import { useAppSelector } from '@/store'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { DIVISION_STATE } from '@/store/types/division.types'
import { SUBCATEGORY_STATE } from '@/store/types/subcategory.types'

interface props {
    selectedDivision: string
    selectedCategory: string
}

export const useGetSubCategory = ({ selectedCategory, selectedDivision }: props) => {
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const categoryArray = useAppSelector<CATEGORY_STATE>((state) => state.category)
    const DivisionArray = divisions?.divisions?.map((item) => item?.name)
    const subCategoryArray = useAppSelector<SUBCATEGORY_STATE>((state) => state.subCategory)

    console.log(categoryArray)

    let subCategories = subCategoryArray?.subcategories

    const division = divisions?.divisions?.find((d) => d?.name === selectedDivision)
    const category = division?.categories?.find((c) => c?.name === selectedCategory)
    const divisionThroughCategory = division?.categories?.flatMap((category) =>
        (category?.sub_categories || []).map((subCat) => subCat?.id),
    )
    const divisionCategoryPC = subCategoryArray?.subcategories?.find((sub) => divisionThroughCategory?.includes(sub.id))?.product_count
    const subCategoryProductCount = subCategoryArray?.subcategories?.find((c) => c.category_name === selectedCategory)?.product_count

    if (selectedDivision !== 'Select Division' && selectedCategory !== 'Select Category') {
        subCategories =
            category?.sub_categories?.map((subCat) => ({
                ...subCat,
                product_count: subCategoryProductCount,
                division_name: selectedDivision,
                category_name: selectedCategory,
            })) || []
    } else if (selectedDivision !== 'Select Division') {
        subCategories =
            division?.categories?.flatMap((category) =>
                (category?.sub_categories || []).map((subCat) => ({
                    ...subCat,
                    product_count: divisionCategoryPC,
                    division_name: selectedDivision,
                    category_name: category.name,
                })),
            ) || []
    } else if (selectedCategory !== 'Select Category') {
        subCategories =
            divisions?.divisions?.flatMap((division) =>
                (category?.sub_categories || []).map((subCat) => ({
                    ...subCat,
                    product_count: subCategoryProductCount,
                    division_name: division.name,
                    category_name: selectedCategory,
                })),
            ) || []
    } else {
        subCategories = subCategoryArray?.subcategories || []
    }

    return { subCategories, DivisionArray }
}
