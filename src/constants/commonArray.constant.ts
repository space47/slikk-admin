export const OrderCancelReasons = [
    {
        label: 'Ordered by Mistake: I accidentally ordered the wrong item or quantity.',
        value: 'ordered_by_mistake',
    },
    {
        label: 'Payment Issues: There was a problem with my payment method.',
        value: 'payment_issues',
    },
    {
        label: 'Changed Mind: I changed my mind about the purchase.',
        value: 'changed_mind',
    },
    {
        label: 'Customer Not Reachable: The customer is not responding.',
        value: 'customer_not_reachable',
    },
    {
        label: 'Other: I have another reason for canceling my order.',
        value: 'other',
    },
]

export const OrderReturnReasons = [
    {
        label: "Size and Fit Issues: The clothing doesn't fit as expected.",
        value: 'size_fit_issues',
        name: 'Size and Fit Issues',
    },
    {
        label: 'Colour and Appearance: The actual color or appearance of the clothing item differs from how it appeared online.',
        value: 'colour_appearance',
        name: 'Color and Appearence',
    },
    {
        label: "Quality and Fabric: The quality or feel of the fabric doesn't meet the expectation.",
        value: 'quality_fabric',
        name: 'Quality and Fabric',
    },
    {
        label: 'Change of mind: I no longer want the item.',
        value: 'change_of_mind',
        name: 'Change of Mind',
    },
    {
        label: 'Defects and Damage: The clothing arrived damaged or with manufacturing defects, such as holes, loose threads, or stains.',
        value: 'defects_damage',
        name: 'Defects and Damage',
    },
    {
        label: 'Try And Buy',
        value: 'try_and_buy',
        name: 'Try & Buy',
    },
]

export const CouponDiscountTypeArray = [
    { label: 'PERCENT_OFF', value: 'PERCENT_OFF' },
    { label: 'FLAT_OFF', value: 'FLAT_OFF' },
]
export const CouponTypeArray = [
    { label: 'PERIODIC', value: 'PERIODIC' },
    { label: 'COUPON', value: 'COUPON' },
    { label: 'REFERRAL', value: 'REFERRAL' },
    { label: 'REFEREE', value: 'REFEREE' },
]
