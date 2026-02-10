import { BANNER_ITEM_FRONTEND, POSITION_ITEM_BACKEND } from '../DataTypes'

export const quickFiltersParse = (quick_filter_tags: string[]) => {
    if (!quick_filter_tags) return
    const filters: Record<any, any[]> = {}

    for (let i = 0; i < quick_filter_tags.length; i++) {
        const [filter, value] = quick_filter_tags[i].split('_')
        const show_filter = 'show_' + filter
        if (filters[show_filter]) {
            filters[show_filter] = [...filters[show_filter], value]
        } else {
            filters[show_filter] = [value]
        }
    }

    return arrayObjectToQueryString(filters)
}

export const FilterTagsParse = (tags: string[]) => {
    const filters: Record<any, any[]> = {}

    for (let i = 0; i < tags.length; i++) {
        // Check if the current tag is a string and not null/undefined
        if (typeof tags[i] === 'string' && tags[i] !== null) {
            const [filter, value] = tags[i].split('_')
            const show_filter = filter

            // Initialize filters[show_filter] if it doesn't exist
            if (filters[show_filter]) {
                filters[show_filter] = [...filters[show_filter], value]
            } else {
                filters[show_filter] = [value]
            }
        } else {
            console.warn(`Invalid tag at index ${i}:`, tags[i])
        }
    }

    return arrayObjectToQueryString(filters)
}

export const fieldsToListingPage = ({
    pk,
    name,
    division,
    category,
    sub_category,
    product_type,
    tags,
    quick_filter_tags,
    brand,
    offer_id,
    max_price,
    min_price,
    is_clickable,
    redirection_url,
    ...rest
}: BANNER_ITEM_FRONTEND) => {
    if (!is_clickable) return undefined
    if (redirection_url) return redirection_url

    const filters = {
        division: [division],
        category: [category],
        subcategory: [sub_category],
        producttype: [product_type],
        brand: [brand],
        offer_id: [offer_id],
        max_price: [max_price],
        min_price: [min_price],
    }

    const allFilters = [arrayObjectToQueryString(filters), FilterTagsParse(tags || []), quickFiltersParse(quick_filter_tags || [])].filter(
        (f) => f,
    )

    const finalString = allFilters.join('&')
    const quickFiltersString = [quickFiltersParse(quick_filter_tags || [])].join('&')
    let redirect = '/products?' + 'banner_id=' + pk + '&namex=' + name
    if (pk || pk !== -1) if (quickFiltersString) redirect += '&' + quickFiltersString
    if (pk && pk != -1) return redirect
    return '/products?' + finalString
}

export function arrayObjectToQueryString(obj: Record<any, any[]>) {
    return Object.keys(obj)
        ?.filter((key) => obj[key] && obj[key].length != 0 && obj[key][0])
        ?.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key].join(','))}`)
        ?.join('&')
}

export const sectionHeadingURLFn = ({ section_filters, is_section_clickable }: POSITION_ITEM_BACKEND) => {
    if (!is_section_clickable) return

    if (!section_filters) return

    if (!section_filters.length) return

    const tags = FilterTagsParse(section_filters)
    if (!tags) return '/products'

    return '/products?' + tags
}
