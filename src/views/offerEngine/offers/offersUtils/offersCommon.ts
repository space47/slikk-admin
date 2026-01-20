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
    { name: 'is_freebie', label: 'Is Freebie', type: 'checkbox', required: false },
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
    { label: 'Sunday', value: '1' },
    { label: 'Monday', value: '2' },
    { label: 'Tuesday', value: '3' },
    { label: 'Wednesday', value: '4' },
    { label: 'Thursday', value: '5' },
    { label: 'Friday', value: '6' },
    { label: 'Saturday', value: '7' },
]

export const offerBodyFile = (values: any) => {
    console.log('values', values)
    const body = {
        offer_name: values?.offer_name || null, // mandatory
        store_ids: values?.store ? values?.store?.join(',') : null, // mandatory
        week_day_number: values?.week_day_number ? values?.week_day_number?.join(',') : null,
        slab_id: values?.slab_id ? Number(values?.slab_id) : 1, // mandatory
        apply_type: values?.apply_type || null, // PRODUCT / USER
        discount_type: values?.discount_type || null, //PERCENTAGE FLAT BXGY  // mandatory
        discount_value: values?.discount_value || null, // mandatory
        min_purchase_amount: values?.min_purchase_amount || null,
        max_discount_amount: values?.max_discount_amount,
        start_date: moment(values?.start_date, 'YYYY-MM-DD HH:mm:ss').utc().format() || null, // mandatory
        end_date: moment(values?.end_date, 'YYYY-MM-DD HH:mm:ss').utc().format() || null, // mandatory
        is_active: values?.is_active || false,
        is_freebie: values?.is_freebie || false,
        min_order_quantity: values?.min_order_quantity || null,
        max_order_quantity: values?.max_order_quantity || null,
        is_multi_unit_eligible: values?.is_multi_unit_eligible || false,
        set_size: values?.set_size || null,
        max_sets: values?.max_sets || null,
        buy_quantity: values?.buy_quantity || null, // mandatory
        get_quantity: values?.get_quantity || null,
        user_filter_id: values?.groupId?.id || null,
        get_reward_type: values?.get_reward_type || null, //PERCENTAGE / FLAT / CONSTANT_PRICE
        get_reward_value: values?.get_reward_value || null,
        get_reward_limit: values?.get_reward_limit || null,
        terms_and_conditions: values?.terms_and_conditions || null,
        product_max_discount_amount: values?.product_max_discount_amount || null,
        daily_time_windows: values?.daily_time_windows?.length
            ? values?.daily_time_windows?.map((timeWindow: any) => ({
                  start: timeWindow?.start,
                  end: timeWindow?.end,
              }))
            : [],
    }

    return { body }
}
