import { useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import { PRODUCTTYPE_STATE } from '@/store/types/productType.types'

interface props {
    selectedDivision: string
    selectedCategory: string
    selectedSubCategory: string
}

export const useGetProductType = ({ selectedCategory, selectedDivision, selectedSubCategory }: props) => {
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const productTypeArray = useAppSelector<PRODUCTTYPE_STATE>((state) => state.product_type)

    let productType = []

    if (selectedDivision !== 'Select Division' && selectedCategory !== 'Select Category' && selectedSubCategory !== 'Select SubCategory') {
        productType =
            divisions?.divisions
                ?.find((division) => division?.name === selectedDivision)
                ?.categories?.find((category) => category?.name === selectedCategory)
                ?.sub_categories?.find((subCat) => subCat?.name === selectedSubCategory)?.product_types || []
    } else if (selectedSubCategory !== 'Select SubCategory') {
        productType =
            divisions?.divisions?.flatMap((division) =>
                division?.categories?.flatMap(
                    (category) => category?.sub_categories?.find((subCat) => subCat?.name === selectedSubCategory)?.product_types || [],
                ),
            ) || []
    } else if (selectedDivision !== 'Select Division') {
        productType =
            divisions?.divisions
                ?.find((division) => division?.name === selectedDivision)
                ?.categories?.flatMap((category) => category?.sub_categories?.flatMap((subCat) => subCat?.product_types || [])) || []
    } else if (selectedCategory !== 'Select Category') {
        productType =
            divisions?.divisions?.flatMap((division) =>
                division?.categories
                    ?.find((category) => category?.name === selectedCategory)
                    ?.sub_categories?.flatMap((subCat) => subCat?.product_types || []),
            ) || []
    } else {
        productType = productTypeArray?.product_types
    }
    return productType
}
