import dayjs from 'dayjs'
import moment from 'moment'

/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const transformRulesToConditions = (rules: any) => {
    if (!rules) return [ConditionsForEvent]
    if (rules.operations && Array.isArray(rules.rules)) {
        const conditions: any[] = []

        rules.rules.forEach((rule: any, index: number) => {
            const condition = transformSingleRuleToCondition(rule)
            if (index > 0 && rules.operations[index - 1]) {
                condition.relation = rules.operations[index - 1]
            } else {
                condition.relation = 'AND'
            }
            conditions.push(condition)
        })

        return conditions
    }
    if (rules.type === 'group' && Array.isArray(rules.rules)) {
        return rules.rules.flatMap((rule: any) => {
            const arr = transformRulesToConditions(rule)
            return arr.map((c: any) => ({ ...c, relation: (rules.op || 'and').toUpperCase() }))
        })
    }

    if (rules.type === 'rule') {
        const condition = transformSingleRuleToCondition(rules)
        condition.relation = 'AND'
        return [condition]
    }
    return [ConditionsForEvent]
}

export const transformSingleRuleToCondition = (rule: any) => {
    const isBetween = rule.properties?.[0]?.op === 'BETWEEN' || rule.properties?.[0]?.op === 'NOT BETWEEN'
    const propertyValue = rule.properties?.value
    const aggregationValue = rule?.aggregation?.value
    return {
        event: {
            id: '',
            value: rule.event,
            label: rule.event,
        },
        property: rule.properties?.path || '',
        aggregation: rule?.aggregation?.path || '',
        condition: rule.properties?.op,
        agg_condition: rule?.aggregation?.op,
        agg_function: rule?.aggregation?.function,
        operator: rule.properties?.op,
        value: isBetween ? '' : Array.isArray(propertyValue) ? propertyValue[0] : propertyValue,
        value_a: isBetween && Array.isArray(propertyValue) ? propertyValue[0] : '',
        value_b: isBetween && Array.isArray(propertyValue) ? propertyValue[1] : '',
        agg_value: isBetween ? '' : Array.isArray(aggregationValue) ? aggregationValue[0] : aggregationValue,
        agg_value_a: isBetween && Array.isArray(aggregationValue) ? aggregationValue[0] : '',
        agg_value_b: isBetween && Array.isArray(aggregationValue) ? aggregationValue[1] : '',
        timeFrame: rule.time_frame ? 'custom_range' : '',
        start_date: dayjs(rule.time_frame?.range?.start).toISOString() || '',
        end_date: dayjs(rule.time_frame?.range?.end).toISOString() || '',
        relation: 'AND',
        includeExclude: rule.include_cohort_id ? true : rule.exclude_cohort_id ? false : undefined,
        cohort_id: rule.include_cohort_id?.[0] || rule.exclude_cohort_id?.[0] || '',
    }
}

export const transformConditionToRule = (condition: any = {}) => {
    const normalizeValue = (val: any) => {
        if (typeof val === 'string') {
            const lower = val.toLowerCase()
            if (lower === 'true' || lower === 'false') return lower === 'true'
        }
        if (!isNaN(val) && val !== '') return Number(val)
        return val
    }

    const safeLower = (v: any) => (typeof v === 'string' ? v.toLowerCase() : (v ?? ''))

    const safeIncludes = (hay: any, needle: string) => typeof hay === 'string' && hay.includes(needle)

    const propertyBuilder = (pathKey: string, condKey: string, fnc: string, valA: string, valB: string, valueKey: string) => {
        if (!condition[pathKey] || !condition[condKey]) return []

        const property = safeLower(condition[pathKey])
        const rawCond = condition[condKey] || ''
        const operator = mapConditionToOperator(rawCond)

        let value: any

        if (safeIncludes(rawCond, 'BETWEEN') || safeIncludes(rawCond, 'Not Between')) {
            value = [condition[valA], condition[valB]]
        } else {
            value = normalizeValue(condition[valueKey])
        }

        let result: any[] = []

        if (condition[fnc]) {
            result.push({
                path: property,
                op: operator,
                value,
                function: condition[fnc],
            })
        } else {
            result.push({
                path: property,
                op: operator,
                value,
            })
        }

        // special override
        const specialKeys = ['category', 'division', 'sub category', 'brand']
        if (specialKeys.some((k) => property?.includes(k)) && condition[valueKey] !== undefined) {
            result = [
                {
                    path: property,
                    op: operator,
                    value: condition[valueKey],
                },
            ]
        }

        return result
    }

    const properties = propertyBuilder('property', 'condition', '', 'value_a', 'value_b', 'value')

    const aggregation = propertyBuilder('aggregation', 'agg_condition', 'agg_function', 'agg_value_a', 'agg_value_b', 'agg_value')

    // TIME RANGE
    const range: any = {}
    if (condition.timeFrame && condition.timeFrame !== 'custom_range') {
        range.start = moment().startOf('isoWeek').format('YYYY-MM-DD')
        range.end = moment().endOf('isoWeek').format('YYYY-MM-DD')
    } else if (condition.timeFrame === 'custom_range' && condition.start_date && condition.end_date) {
        range.start = condition.start_date
        range.end = condition.end_date
    }

    const rule: any = {}

    if (condition.event) {
        rule.event = condition.event?.value || condition.event
    }

    if (properties.length > 0) {
        rule.properties = properties[0]
    }

    if (aggregation.length > 0) {
        rule.aggregation = aggregation[0]
    }

    if (Object.keys(range).length > 0) {
        rule.time_frame = { range }
    }

    // include/exclude cohort
    if (condition.cohort_id) {
        if (condition.includeExclude === true) {
            rule.include_cohort_id = [condition.cohort_id]
        } else if (condition.includeExclude === false) {
            rule.exclude_cohort_id = [condition.cohort_id]
        }
    }

    return rule
}

export const transformConditionsToRules = (conditions: any[]) => {
    if (conditions.length === 0) return { operations: [], rules: [] }
    if (conditions.length === 1) return { operations: [], rules: [transformConditionToRule(conditions[0])] }
    const operations: string[] = []
    const rules: any[] = []
    rules.push(transformConditionToRule(conditions[0]))
    for (let i = 1; i < conditions.length; i++) {
        const currentCondition = conditions[i]
        const previousRelation = conditions[i].relation || 'Error'
        operations.push(previousRelation)
        rules.push(transformConditionToRule(currentCondition))
    }
    return { operations, rules }
}
