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

    if (selectedDivision !== 'Select Division' && selectedCategory !== 'Select Category') {
        subCategories =
            divisions?.divisions
                ?.find((division) => division?.name === selectedDivision)
                ?.categories?.find((category) => category?.name === selectedCategory)?.sub_categories || []
    } else if (selectedDivision !== 'Select Division') {
        subCategories =
            divisions?.divisions
                ?.find((division) => division?.name === selectedDivision)
                ?.categories?.flatMap((category) => category?.sub_categories || []) || []
    } else if (selectedCategory !== 'Select Category') {
        subCategories =
            divisions?.divisions?.flatMap(
                (division) => division?.categories?.find((category) => category?.name === selectedCategory)?.sub_categories || [],
            ) || []
    } else {
        subCategories =
            divisions?.divisions?.flatMap((division) => division?.categories?.flatMap((category) => category?.sub_categories || [])) || []
    }
    return { subCategories, DivisionArray }
}
