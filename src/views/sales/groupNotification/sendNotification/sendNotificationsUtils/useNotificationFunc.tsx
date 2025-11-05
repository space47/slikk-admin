/* eslint-disable @typescript-eslint/no-explicit-any */

interface props {
    data: any
}
export const useNotificationFunc = ({ data }: props) => {
    const d = data as any
    const filtersArr = d?.other_config?.filters || d?.filters || []
    const getFilterValue = (prefix: string) => {
        const found = filtersArr.find((f: string) => f.startsWith(prefix + '_'))
        return found ? found.split('_').slice(1).join('_') : ''
    }

    const initialValue = {
        title: d?.title || '',
        message: d?.message || '',
        event_name: d?.name || '',
        page_title: d?.other_config?.page_title || d?.page_title || '',
        filters: filtersArr?.filter(
            (f: string) =>
                !f?.startsWith('utm-') &&
                !f?.startsWith('maxprice_') &&
                !f?.startsWith('minprice_') &&
                !f?.startsWith('maxoff_') &&
                !f?.startsWith('minoff_') &&
                !f?.startsWith('sort_') &&
                !f?.startsWith('filterId_'),
        ),
        discountTags: filtersArr?.filter((f: string) => f?.startsWith('sort_')),
        utm_medium: getFilterValue('utm-medium'),
        utm_source: getFilterValue('utm-source'),
        utm_campaign: getFilterValue('utm-campaign'),
        utm_tags: getFilterValue('utm-tags'),
        maxprice: getFilterValue('maxprice'),
        minprice: getFilterValue('minprice'),
        maxoff: getFilterValue('maxoff'),
        minoff: getFilterValue('minoff'),
        filterId: getFilterValue('filterId'),
        target_page: d?.other_config?.target_page || d?.target_page || '',
        is_custom: d?.other_config?.page || d?.other_config?.sub_page ? true : false,
        page: d?.other_config?.page || '',
        sub_page: d?.other_config?.sub_page || '',
        users: d?.mobiles ? d?.mobiles?.join(',') : '',
        image_url: d?.image || d?.image_url || '',
    }

    return {
        initialValue,
    }
}
