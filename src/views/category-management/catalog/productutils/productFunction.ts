import { ProductFilterArray } from '../ProductCommon'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleApply = (
    brandList: any[],
    selectFilterString: string,
    setShowDrawer: React.Dispatch<React.SetStateAction<boolean>>,
    setTypeFetch: React.Dispatch<React.SetStateAction<string>>,
) => {
    let query = ''
    if (brandList?.length > 0 && !selectFilterString) {
        const brandIds = brandList.join(',')
        if (query) query += '&'
        query += `brand=${brandIds}`
    }
    if (selectFilterString && brandList?.length === 0) {
        query += `&${selectFilterString}`
    }
    if (selectFilterString && brandList?.length > 0) {
        const brandIds = brandList.join(',')
        const data = selectFilterString
            ?.split('=')
            ?.filter((item) => item !== 'brand')
            ?.join('')
        if (selectFilterString.includes('brand')) {
            query += `&brand=${brandIds},${data},`
        } else {
            query += `&${selectFilterString}&brand=${brandIds}`
        }
    }

    setTypeFetch(query)
    setShowDrawer(false)
}

export const handleProductSelect = (value: any, setCurrentSelectedPage: React.Dispatch<React.SetStateAction<any>>) => {
    const selected = ProductFilterArray.find((item) => item.value === value)
    if (selected) {
        setCurrentSelectedPage(selected)
    }
}
