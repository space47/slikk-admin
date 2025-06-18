import { useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'

interface props {
    selectedDivision: string
    selectedCategory: string
}

export const useGetSubCategory = ({ selectedCategory, selectedDivision }: props) => {
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const DivisionArray = divisions?.divisions?.map((item) => item?.name)

    let subCategories = []

    const division = divisions?.divisions?.find((d) => d?.name === selectedDivision)
    const category = division?.categories?.find((c) => c?.name === selectedCategory)
    if (selectedDivision !== 'Select Division' && selectedCategory !== 'Select Category') {
        subCategories =
            category?.sub_categories?.map((subCat) => ({
                ...subCat,
                division_name: selectedDivision,
                category_name: selectedCategory,
            })) || []
    } else if (selectedDivision !== 'Select Division') {
        subCategories =
            division?.categories?.flatMap((category) =>
                (category?.sub_categories || []).map((subCat) => ({
                    ...subCat,
                    division_name: selectedDivision,
                    category_name: category.name,
                })),
            ) || []
    } else if (selectedCategory !== 'Select Category') {
        subCategories =
            divisions?.divisions?.flatMap((division) =>
                (category?.sub_categories || []).map((subCat) => ({
                    ...subCat,
                    division_name: division.name,
                    category_name: selectedCategory,
                })),
            ) || []
    } else {
        subCategories =
            divisions?.divisions?.flatMap((division) =>
                division?.categories?.flatMap((category) =>
                    (category?.sub_categories || []).map((subCat) => ({
                        ...subCat,
                        division_name: division.name,
                        category_name: category.name,
                    })),
                ),
            ) || []
    }

    return { subCategories, DivisionArray }
}
