export function fieldsToPDPPage(category?: string, sub_category?: string, name?: string, brand?: string, barcode?: string) {
    const tempName = name?.replaceAll(/[^a-zA-Z0-9]/g, '-')
    return `/${category}/${sub_category}/${brand}/${tempName}/${barcode}`
}
