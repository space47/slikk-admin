import moment from 'moment'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const offersFormList = [
    { name: 'min_purchase_amount', label: 'Min Purchase Amount', type: 'number', required: false },
    { name: 'max_discount_amount', label: 'Max Discount Amount', type: 'number', required: false },
    { name: 'set_size', label: 'Set Size', type: 'number', required: false },
    { name: 'max_sets', label: 'Max Sets', type: 'number', required: false },
]
export const GetTypesList = [
    { name: 'get_reward_value', label: 'Get(Y) Discount Value', type: 'number', required: false },
    { name: 'get_quantity', label: 'Get(Y) Quantity', type: 'number', required: false },
    { name: 'get_reward_limit', label: 'Get(Y) Limit', type: 'number', required: false },
]

export const OfferFromList1 = [
    { name: 'offer_name', label: 'Offer Name', type: 'text', required: true },
    { name: 'slab_id', label: 'Slab', type: 'number', required: true },
    { name: 'is_active', label: 'Is Active', type: 'checkbox', required: false },
    // { name: 'is_multi_unit_eligible', label: 'Is Multi Unit Eligible', type: 'checkbox', required: false },
]

export const OfferDiscountType = [
    { label: 'PERCENTAGE', value: 'PERCENTAGE' },
    { label: 'AMOUNT OFF', value: 'FLAT' },
    { label: 'FLAT PRICE', value: 'CONSTANT_PRICE' },
    { label: 'BXGY', value: 'BXGY' },
]
export const GET_REWARD_TYPE = [
    { label: 'PERCENTAGE', value: 'PERCENTAGE' },
    { label: 'AMOUNT OFF', value: 'FLAT' },
    { label: 'FLAT PRICE', value: 'CONSTANT_PRICE' },
]
export const APPLY_TYPE = [
    { label: 'Apply on Each Item', value: 'PRODUCT' },
    { label: 'Apply on Group of Items', value: 'CART' },
]
export const WEEKDAY_ARRAY = [
    { label: 'Monday', value: 1 },
    { label: 'TuesDay', value: 2 },
    { label: 'Wednesday', value: 3 },
    { label: 'Thursday', value: 4 },
    { label: 'Friday', value: 5 },
    { label: 'Saturday', value: 6 },
    { label: 'Sunday', value: 7 },
]

export const offerBodyFile = (values: any, buyFilterId: number | string | undefined, getFilterId: number | string | undefined) => {
    console.log('values', values)
    const body = {
        offer_name: values?.offer_name || '', // mandatory
        store_ids: values?.store ? values?.store?.join(',') : '', // mandatory
        weekday_number: values?.weekday_number ? values?.weekday_number?.join(',') : '',
        slab_id: values?.slab_id ? Number(values?.slab_id) : 1, // mandatory
        apply_type: values?.apply_type || '', // PRODUCT / USER
        discount_type: values?.discount_type || '', //PERCENTAGE FLAT BXGY  // mandatory
        discount_value: values?.discount_value || '', // mandatory
        min_purchase_amount: values?.min_purchase_amount || '',
        max_discount_amount: values?.max_discount_amount,
        start_date: moment(values?.start_date, 'YYYY-MM-DD HH:mm:ss').utc().format() || '', // mandatory
        end_date: moment(values?.end_date, 'YYYY-MM-DD HH:mm:ss').utc().format() || '', // mandatory
        is_active: values?.is_active || false,
        min_order_quantity: values?.min_order_quantity || '',
        max_order_quantity: values?.max_order_quantity || '',
        is_multi_unit_eligible: values?.is_multi_unit_eligible || false,
        set_size: values?.set_size || '',
        max_sets: values?.max_sets || '',
        buy_quantity: values?.buy_quantity || '', // mandatory
        buy_filter_id: values?.buy_filter_id || buyFilterId || '', // mandatory
        get_quantity: values?.get_quantity || '',
        user_filter_id: values?.groupId?.id || '',
        get_filter_id: values?.is_same_as_buy_filter ? values?.buy_filter_id : values?.get_filter_id || getFilterId || '',
        get_reward_type: values?.get_reward_type || '', //PERCENTAGE / FLAT / CONSTANT_PRICE
        get_reward_value: values?.get_reward_value || '',
        get_reward_limit: values?.get_reward_limit || '',
        daily_time_windows: values?.daily_time_windows?.length
            ? values?.daily_time_windows?.map((timeWindow: any) => ({
                  start: timeWindow?.start,
                  end: timeWindow?.end,
              }))
            : [],
    }

    return { body }
}
