import { useAppSelector } from '@/store'
import { CATEGORY_STATE } from '@/store/types/category.types'
import { useMemo } from 'react'

interface Props {
    selectedDivision: string
}

export const useSubCategoryFilter = ({ selectedDivision }: Props) => {
    const category = useAppSelector<CATEGORY_STATE>((state) => state.category)

    const filteredCategories = useMemo(() => {
        if (selectedDivision === 'Select Division') {
            return category.categories
        }

        return category.categories.filter((item) => item.division_name === selectedDivision)
    }, [category.categories, selectedDivision])

    const categoriesArray = filteredCategories?.map((item) => item?.name)

    return categoriesArray
}
