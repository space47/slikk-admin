export const offersFormList = [
    { name: 'discount_value', label: 'Discount Value', type: 'number', required: true },
    { name: 'min_purchase_amount', label: 'Min Purchase Amount', type: 'number', required: false },
    { name: 'max_discount_amount', label: 'Max Discount Amount', type: 'number', required: false },
    { name: 'min_order_quantity', label: 'Min Item Quantity', type: 'number', required: false },
    { name: 'max_order_quantity', label: 'Max Item Quantity', type: 'number', required: false },
    { name: 'set_size', label: 'Set Size', type: 'number', required: false },
    { name: 'max_sets', label: 'Max Sets', type: 'number', required: false },
    { name: 'buy_quantity', label: 'Buy Quantity', type: 'number', required: true },
    { name: 'get_quantity', label: 'Get Quantity', type: 'number', required: false },
    { name: 'get_reward_value', label: 'Get Reward Value', type: 'number', required: false },
]

export const OfferFromList1 = [
    { name: 'offer_name', label: 'Offer Name', type: 'text', required: true },
    { name: 'slab_id', label: 'Priority List', type: 'text', required: true },
    { name: 'is_active', label: 'Is Active', type: 'checkbox', required: false },
    { name: 'is_multi_unit_eligible', label: 'Is Multi Unit Eligible', type: 'checkbox', required: false },
]

export const OfferDiscountType = [
    { label: 'PERCENTAGE', value: 'PERCENTAGE' },
    { label: 'FLAT', value: 'FLAT' },
    { label: 'BXGY', value: 'BXGY' },
]
export const GET_REWARD_TYPE = [
    { label: 'FREE', value: 'FREE' },
    { label: 'PERCENTAGE', value: 'PERCENTAGE' },
    { label: 'FLAT', value: 'FLAT' },
]

// Missing keys from offersFormList (present in JSON but not in array):
// "daily_time_windows"
