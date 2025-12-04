export const DidAndNotArray = [
    { label: 'Did', value: 'Did' },
    { label: 'Did Not', value: 'Did Not' },
]

export const OperatorArray = [
    { label: 'Sum', value: 'SUM' },
    { label: 'Average', value: 'AVERAGE' },
    { label: 'Count', value: 'COUNT' },
    { label: 'Distinct Count', value: 'Distinct Count' },
    { label: 'Min', value: 'MIN' },
    { label: 'Max', value: 'MAX' },
    { label: 'No Aggregation', value: 'No Aggregation' },
]

export const ConditionArray = [
    { label: 'Equal', value: '=' },
    { label: 'Not Equal', value: '!=' },
    { label: 'Greater Than', value: '>' },
    { label: 'Greater or Equal', value: '>=' },
    { label: 'Less Than', value: '<' },
    { label: 'Less or Equal', value: '<=' },
    { label: 'Between', value: 'BETWEEN' },
    { label: 'Not Between', value: 'NOT BETWEEN' },
]

export const QuickFilterArray = [
    { label: 'Registered', value: 'registered' },
    { label: 'Non-Registered', value: 'non_registered' },
    { label: 'First Time', value: 'first_time' },
    { label: 'Try&Buy', value: 'try_and_buy' },
    { label: 'Express', value: 'express' },
]

export const PropertiesArray = [
    { label: 'Cart Value', value: 'cart_value' },
    { label: 'Cart Create Date (Start)', value: 'cart_create_date_start' },
    { label: 'Cart Create Date (End)', value: 'cart_create_date_end' },
    { label: 'Cart Size', value: 'cart_size' },
    { label: 'Category', value: 'category' },
    { label: 'Sub-Category', value: 'sub_category' },
    { label: 'SKU ID', value: 'sku_id' },
    { label: 'Brand', value: 'brand' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
    { label: 'Country', value: 'country' },
    { label: 'Pincode', value: 'pincode' },
    { label: 'Platform (iOS / Android / Web)', value: 'platform' },
    { label: 'App Version', value: 'app_version' },
    { label: 'OS Version', value: 'os_version' },
    { label: 'Loyalty Points Available', value: 'loyalty_points_available' },
    { label: 'Loyalty Points Earned', value: 'loyalty_points_earned' },
    { label: 'Loyalty Points Redeemed', value: 'loyalty_points_redeemed' },
    { label: 'Gender', value: 'gender' },
    { label: 'Category Gender', value: 'category_gender' },
    { label: 'Days Since Last Purchase', value: 'days_since_last_purchase' },
    { label: 'Days Since Last Login', value: 'days_since_last_login' },
    { label: 'Brand Repeat Count', value: 'brand_repeat_count' },
    { label: 'Age', value: 'age' },
    { label: 'Date of Birth', value: 'dob' },
    { label: 'Frequency (Event Count)', value: 'frequency' },
    { label: 'Acquisition Source', value: 'acquisition_source' },
    { label: 'Delivery Type', value: 'delivery_type' },
    { label: 'Referral Code Used/Coupon', value: 'referral_code' },
    { label: 'Is Referral Code', value: 'is_referral_code' },
    { label: 'Wishlist Count', value: 'wishlist_count' },
    { label: 'Order Value (₹)', value: 'order_value' },
    { label: 'Purchase Count', value: 'purchase_count' },
    { label: 'Payment Method Used', value: 'payment_method' },
    { label: 'Avg. Time Between Orders (Days)', value: 'avg_time_between_orders' },
    { label: 'Order Cancellations', value: 'order_cancellations' },
    { label: 'Delivery Failures', value: 'delivery_failures' },
]

export const TimeFrameArray = [
    { label: 'Last 7 Days', value: 'last_7_days' },
    { label: 'Custom Range', value: 'custom_range' },
]

export const ConditionsForEvent = {
    didDidNot: '',
    event: '',
    operator: '',
    property: '',
    condition: '',
    value: '',
    value_a: '',
    value_b: '',
    timeFrame: '',
    start_date: '',
    end_date: '',
    relation: '',
    aggregation: '',
    agg_condition: '',
    agg_value: '',
    agg_value_a: '',
    agg_value_b: '',
    agg_function: '',
    agg_operator: '',
}

export const mapConditionToOperator = (condition: string): string => {
    const operatorMap: { [key: string]: string } = {
        '=': '=',
        '!=': '!=',
        '>': '>',
        '<': '<',
        '>=': '>=',
        '<=': '<=',
        BETWEEN: 'BETWEEN',
        'Not Between': 'NOT BETWEEN',
        Contains: 'CONTAINS',
        'Not Contains': 'NOT CONTAINS',
        'Starts With': 'STARTS WITH',
        'Ends With': 'ENDS WITH',
    }

    return operatorMap[condition] || condition
}
