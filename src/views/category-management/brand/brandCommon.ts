export type FormModel = {
    id: number
    name: string
    title: string
    description: string
    image: string
    is_top: boolean
    is_exclusive: boolean
    is_private: boolean
    footer: string | null
    quick_filter_tags: string[]
    is_active: boolean
    create_date: string
    update_date: string
    is_try_and_buy: boolean
    last_updated_by: string | null
    images: File[]
    logo_array: File[]
    logo: string
}

export interface BrandTypes {
    id: number
    name: string
    title: string
    description: string
    image: string
    is_top: boolean
    is_exclusive: boolean
    is_private: boolean
    footer: string | null
    quick_filter_tags: string[]
    is_active: boolean
    create_date: string
    update_date: string
    is_try_and_buy: boolean
    last_updated_by: string | null
}

export const initialBrandValue = (catedate: FormModel) => {
    return {
        id: catedate?.id,
        name: catedate?.name,
        title: catedate?.title,
        description: catedate?.description,
        image: catedate?.image,
        footer: catedate?.footer,
        quick_filter_tags: catedate?.quick_filter_tags,
        is_top: catedate?.is_top,
        is_exclusive: catedate?.is_exclusive,
        is_private: catedate?.is_private,
        is_active: catedate?.is_active,
        create_date: catedate?.create_date,
        update_date: catedate?.update_date,
        is_try_and_buy: catedate?.is_try_and_buy,
        last_updated_by: catedate?.last_updated_by,
        images: [],
        logo_array: [],
        logo: catedate?.logo,
    }
}
