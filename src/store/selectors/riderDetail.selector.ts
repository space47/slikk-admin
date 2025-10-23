// store/slices/riderDetails/riderDetails.selectors.ts
import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { calculateDistance } from '@/views/slikkLogistics/riderDetails/RiderUtils/RiderDetailsColumns'

export const sortedRiderSelector = createSelector(
    [(state: RootState) => state.riderDetails.riderDetails, (state: RootState) => state.riderDetails.currentStoreLocation],
    (riderDetails, currentStoreLocation) => {
        if (!riderDetails?.length) return []

        return [...riderDetails]?.sort((a, b) => {
            const distance1 = calculateDistance(
                Number(a.profile?.current_location?.latitude),
                Number(a.profile?.current_location?.longitude),
                currentStoreLocation?.lat ?? 0,
                currentStoreLocation?.long ?? 0,
            )
            const distance2 = calculateDistance(
                Number(b.profile?.current_location?.latitude),
                Number(b.profile?.current_location?.longitude),
                currentStoreLocation?.lat ?? 0,
                currentStoreLocation?.long ?? 0,
            )
            return distance1 - distance2
        })
    },
)
