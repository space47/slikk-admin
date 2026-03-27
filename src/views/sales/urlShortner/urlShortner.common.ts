/* eslint-disable @typescript-eslint/no-explicit-any */
export type URLTYPES = {
    short_code: string
    web_url: string
    android_url: string
    ios_url: string
    default_url: string
    select_filter?: boolean
    target_page?: any
}

export const initialValueForUrl: any = {
    short_code: '',
    web_url: '',
    android_url: '',
    ios_url: '',
    default_url: '',
}

export const URLARRAY = [
    {
        label: 'Link TITLE(Enter unique title)',
        name: 'short_code',
        placeholder: 'Enter short code',
        type: 'text',
        classname: 'w-full',
    },
    // {
    //     label: 'Page Title',
    //     name: 'page_title',
    //     placeholder: 'Enter app page display name',
    //     type: 'text',
    //     classname: 'w-full',
    // },
    {
        label: 'Web URL',
        name: 'web_url',
        placeholder: 'Enter web URL',
        type: 'url',
        classname: 'w-full',
    },
    {
        label: 'Android URL',
        name: 'android_url',
        placeholder: 'Enter Android URL',
        type: 'url',
        classname: 'w-full',
    },
    {
        label: 'iOS URL',
        name: 'ios_url',
        placeholder: 'Enter iOS URL',
        type: 'url',
        classname: 'w-full',
    },
    // {
    //     label: 'Default URL',
    //     name: 'default_url',
    //     placeholder: 'Enter default URL',
    //     type: 'url',
    //     classname: 'w-full',
    // },
]

export const initialValuesEdit = (urlFieldDatas: any, baseUrl: string) => {
    const initialValues: any = {
        short_code: urlFieldDatas?.short_code || '',
        web_url: urlFieldDatas?.ios_url ? `${baseUrl}` : '',
        android_url: urlFieldDatas?.ios_url ? `${`slikk://page`}` : '',
        ios_url: urlFieldDatas?.ios_url ? `${`slikk://page`}` : '',
        page: urlFieldDatas?.extra_attributes?.page,
        sub_page: urlFieldDatas?.extra_attributes?.subPage,
        maxoff: urlFieldDatas?.extra_attributes?.max_off,
        minoff: urlFieldDatas?.extra_attributes?.min_off,
        maxprice: urlFieldDatas?.extra_attributes?.max_price,
        minprice: urlFieldDatas?.extra_attributes?.min_price,
        target_page: urlFieldDatas?.extra_attributes?.target_page,
        utm_medium: urlFieldDatas?.extra_attributes?.utm_medium,
        utm_source: urlFieldDatas?.extra_attributes?.utm_source,
        utm_campaign: urlFieldDatas?.extra_attributes?.utm_campaign,
        utm_tags: urlFieldDatas?.extra_attributes?.utm_tags,
        filter_id: urlFieldDatas?.extra_attributes?.filter_id,
        select_filter: urlFieldDatas?.extra_attributes?.selectFilter,
        is_custom: urlFieldDatas?.extra_attributes?.is_custom,
        app: urlFieldDatas?.extra_attributes?.appOnly,
        discountTags: urlFieldDatas?.extra_attributes?.discount_tags,
        page_title: urlFieldDatas?.extra_attributes?.page_title,
        is_banner: urlFieldDatas?.extra_attributes?.is_banner,
        banners: urlFieldDatas?.extra_attributes?.banner_id,
        product_code: urlFieldDatas?.extra_attributes?.product_code,
    }

    return initialValues
}
