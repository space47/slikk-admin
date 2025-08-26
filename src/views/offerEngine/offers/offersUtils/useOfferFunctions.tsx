import { OfferFormTypes } from '../../offerEngineCommon'

interface props {
    offersData: OfferFormTypes | null
}

export const useOfferFunctions = ({ offersData }: props) => {
    const initialValues = {
        store: offersData?.store_id || '',
        offer_name: offersData?.offer_name || '',
        buy_filter_id: offersData?.buy_filter_id || '',
        get_filter_id: offersData?.get_filter_id || '',
        slab_id: offersData?.slab_id || '',
        discount_value: offersData?.discount_value || '',
        min_purchase_amount: offersData?.min_purchase_amount || '',
        max_discount_amount: offersData?.max_discount_amount || '',
        is_active: offersData?.is_active ?? false,
        min_order_quantity: offersData?.min_order_quantity || '',
        max_order_quantity: offersData?.max_order_quantity || '',
        is_multi_unit_eligible: offersData?.is_multi_unit_eligible ?? false,
        set_size: offersData?.set_size || '',
        max_sets: offersData?.max_sets || '',
        buy_quantity: offersData?.buy_quantity || '',
        get_quantity: offersData?.get_quantity || '',
        get_reward_value: offersData?.get_reward_value || '',
        daily_time_windows: offersData?.daily_time_windows || [{ start: '', end: '' }],
        start_date: offersData?.start_date || '',
        end_date: offersData?.end_date || '',
        discount_type: offersData?.discount_type || '',
        get_reward_type: offersData?.get_reward_type || '',
    }
    return { initialValues }
}
