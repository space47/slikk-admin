import { StoreTypes } from '../commonStores'

interface props {
    storeData?: StoreTypes
}

export const useStoresFunctions = ({ storeData }: props) => {
    const initialValue: StoreTypes = {
        company: storeData?.company || 0,
        code: storeData?.code || '',
        name: storeData?.name || '',
        description: storeData?.description || '',
        area: storeData?.area || '',
        city: storeData?.city || '',
        state: storeData?.state || '',
        pincode: storeData?.pincode || null,
        latitude: storeData?.latitude || null,
        longitude: storeData?.longitude || null,
        contactNumber: storeData?.contactNumber || '',
        poc: storeData?.poc || '',
        poc_designation: storeData?.poc_designation || '',
        type: storeData?.type || '',
        return_area: storeData?.return_area || '',
        return_city: storeData?.return_city || '',
        return_state: storeData?.return_state || '',
        return_pincode: storeData?.return_pincode || '',
        gstin: storeData?.gstin || '',
        instruction: storeData?.instruction || '',
        location_url: storeData?.location_url || '',
        is_fulfillment_center: storeData?.is_fulfillment_center || false,
        image: storeData?.image || '',
        opening_hours: storeData?.opening_hours || [],
        images_array: storeData?.images_array || [],
        is_volumetric_store: storeData?.is_volumetric_store || false,
    }

    return { initialValue }
}
